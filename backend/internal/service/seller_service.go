package service

import (
	"errors"
	"time"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/config"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type SellerService interface {
	CreateSeller(req dto.CreateSellerRequest) (*models.Seller, error)
	Login(req dto.SellerLoginRequest) (*dto.SellerLoginResponse, error)
	GetByID(id string) (*models.Seller, error)
	ListSellers(page, limit int, status, search string) ([]models.Seller, int64, error)
	UpdateStatus(id, status string) error
}

type sellerService struct {
	repo       repository.SellerRepository
	walletRepo repository.WalletRepository
	cfg        *config.Config
}

func NewSellerService(repo repository.SellerRepository, walletRepo repository.WalletRepository, cfg *config.Config) SellerService {
	return &sellerService{repo: repo, walletRepo: walletRepo, cfg: cfg}
}

func (s *sellerService) CreateSeller(req dto.CreateSellerRequest) (*models.Seller, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	seller := &models.Seller{
		Name:         req.Name,
		Email:        req.Email,
		Password:     string(hashed),
		Phone:        req.Phone,
		BusinessName: req.BusinessName,
		GSTIN:        req.GSTIN,
		Status:       "active",
	}

	if err := s.repo.Create(seller); err != nil {
		return nil, errors.New("email already registered")
	}

	// Create associated wallet
	wallet := &models.Wallet{SellerID: seller.ID}
	db := s.walletRepo.GetDB()
	_ = s.walletRepo.CreateWallet(db, wallet)

	return seller, nil
}

func (s *sellerService) Login(req dto.SellerLoginRequest) (*dto.SellerLoginResponse, error) {
	seller, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}
	if seller.Status == "suspended" {
		return nil, errors.New("account is suspended")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(seller.Password), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	claims := jwt.MapClaims{
		"sub":  seller.ID.String(),
		"role": "seller",
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
		"iat":  time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return nil, err
	}

	return &dto.SellerLoginResponse{
		Token: signed,
		Seller: dto.SellerInfo{
			ID:           seller.ID,
			Name:         seller.Name,
			Email:        seller.Email,
			Phone:        seller.Phone,
			BusinessName: seller.BusinessName,
			GSTIN:        seller.GSTIN,
			Status:       seller.Status,
		},
	}, nil
}

func (s *sellerService) GetByID(id string) (*models.Seller, error) {
	uid, err := parseUUID(id)
	if err != nil {
		return nil, err
	}
	return s.repo.FindByID(uid)
}

func (s *sellerService) ListSellers(page, limit int, status, search string) ([]models.Seller, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	return s.repo.FindAll(page, limit, status, search)
}

func (s *sellerService) UpdateStatus(id, status string) error {
	uid, err := parseUUID(id)
	if err != nil {
		return err
	}
	return s.repo.UpdateStatus(uid, status)
}
