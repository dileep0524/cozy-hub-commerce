package service

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/config"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
	"gorm.io/gorm"
)

type WalletService interface {
	GetWallet(sellerID string) (*models.Wallet, error)
	GetTransactions(sellerID string, page, limit int) ([]models.WalletTransaction, int64, error)
	InitiateTopup(sellerID string, req dto.TopupInitiateRequest) (*dto.TopupInitiateResponse, error)
	VerifyTopup(sellerID string, req dto.TopupVerifyRequest) error
	HandleRazorpayWebhook(signature string, body []byte) error
}

type walletService struct {
	walletRepo repository.WalletRepository
	cfg        *config.Config
}

func NewWalletService(walletRepo repository.WalletRepository, cfg *config.Config) WalletService {
	return &walletService{walletRepo: walletRepo, cfg: cfg}
}

func (s *walletService) GetWallet(sellerID string) (*models.Wallet, error) {
	uid, err := parseUUID(sellerID)
	if err != nil {
		return nil, err
	}
	return s.walletRepo.FindBySellerID(uid)
}

func (s *walletService) GetTransactions(sellerID string, page, limit int) ([]models.WalletTransaction, int64, error) {
	uid, err := parseUUID(sellerID)
	if err != nil {
		return nil, 0, err
	}
	wallet, err := s.walletRepo.FindBySellerID(uid)
	if err != nil {
		return nil, 0, err
	}
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	return s.walletRepo.FindTransactions(wallet.ID, page, limit)
}

func (s *walletService) InitiateTopup(sellerID string, req dto.TopupInitiateRequest) (*dto.TopupInitiateResponse, error) {
	if s.cfg.RazorpayKeyID == "" || s.cfg.RazorpayKeySecret == "" {
		return nil, errors.New("payment gateway not configured")
	}

	amountPaise := int64(req.Amount * 100)
	payload := map[string]interface{}{
		"amount":   amountPaise,
		"currency": "INR",
	}
	body, _ := json.Marshal(payload)

	httpReq, err := http.NewRequest("POST", "https://api.razorpay.com/v1/orders", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.SetBasicAuth(s.cfg.RazorpayKeyID, s.cfg.RazorpayKeySecret)

	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("razorpay API error: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("razorpay returned %d: %s", resp.StatusCode, string(respBody))
	}

	var result map[string]interface{}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return nil, err
	}

	orderID, _ := result["id"].(string)
	return &dto.TopupInitiateResponse{
		RazorpayOrderID: orderID,
		Amount:          amountPaise,
		Currency:        "INR",
		KeyID:           s.cfg.RazorpayKeyID,
	}, nil
}

func (s *walletService) VerifyTopup(sellerID string, req dto.TopupVerifyRequest) error {
	sUID, err := parseUUID(sellerID)
	if err != nil {
		return err
	}

	// Always verify Razorpay signature
	message := req.RazorpayOrderID + "|" + req.RazorpayPaymentID
	mac := hmac.New(sha256.New, []byte(s.cfg.RazorpayKeySecret))
	mac.Write([]byte(message))
	expected := hex.EncodeToString(mac.Sum(nil))
	if !hmac.Equal([]byte(expected), []byte(req.RazorpaySignature)) {
		return errors.New("payment verification failed: invalid signature")
	}

	wallet, err := s.walletRepo.FindBySellerID(sUID)
	if err != nil {
		return errors.New("wallet not found")
	}

	db := s.walletRepo.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		balanceAfter, err := s.walletRepo.Credit(tx, wallet.ID, req.Amount)
		if err != nil {
			return err
		}
		txn := &models.WalletTransaction{
			WalletID:          wallet.ID,
			SellerID:          sUID,
			Type:              "credit",
			Amount:            req.Amount,
			BalanceAfter:      balanceAfter,
			ReferenceType:     "razorpay",
			ReferenceID:       req.RazorpayPaymentID,
			Description:       "Wallet top-up via Razorpay",
			RazorpayOrderID:   req.RazorpayOrderID,
			RazorpayPaymentID: req.RazorpayPaymentID,
		}
		return s.walletRepo.CreateTransaction(tx, txn)
	})
}

func (s *walletService) HandleRazorpayWebhook(signature string, body []byte) error {
	if s.cfg.RazorpayWebhookSecret == "" {
		return nil
	}
	mac := hmac.New(sha256.New, []byte(s.cfg.RazorpayWebhookSecret))
	mac.Write(body)
	expected := hex.EncodeToString(mac.Sum(nil))
	if !hmac.Equal([]byte(expected), []byte(signature)) {
		return errors.New("invalid webhook signature")
	}
	// Webhook events handled; frontend verify is the primary path
	return nil
}
