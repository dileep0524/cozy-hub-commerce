package repository

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WalletRepository interface {
	CreateWallet(tx *gorm.DB, w *models.Wallet) error
	FindBySellerID(sellerID uuid.UUID) (*models.Wallet, error)
	Credit(tx *gorm.DB, walletID uuid.UUID, amount float64) (float64, error)
	Debit(tx *gorm.DB, walletID uuid.UUID, amount float64) (float64, error)
	CreateTransaction(tx *gorm.DB, t *models.WalletTransaction) error
	FindTransactions(walletID uuid.UUID, page, limit int) ([]models.WalletTransaction, int64, error)
	GetDB() *gorm.DB
}

type walletRepository struct {
	db *gorm.DB
}

func NewWalletRepository(db *gorm.DB) WalletRepository {
	return &walletRepository{db: db}
}

func (r *walletRepository) GetDB() *gorm.DB {
	return r.db
}

func (r *walletRepository) CreateWallet(tx *gorm.DB, w *models.Wallet) error {
	return tx.Create(w).Error
}

func (r *walletRepository) FindBySellerID(sellerID uuid.UUID) (*models.Wallet, error) {
	var wallet models.Wallet
	if err := r.db.Where("seller_id = ?", sellerID).First(&wallet).Error; err != nil {
		return nil, err
	}
	return &wallet, nil
}

func (r *walletRepository) Credit(tx *gorm.DB, walletID uuid.UUID, amount float64) (float64, error) {
	var wallet models.Wallet
	if err := tx.Model(&wallet).Where("id = ?", walletID).
		UpdateColumn("balance", gorm.Expr("balance + ?", amount)).Error; err != nil {
		return 0, err
	}
	if err := tx.Where("id = ?", walletID).First(&wallet).Error; err != nil {
		return 0, err
	}
	return wallet.Balance, nil
}

func (r *walletRepository) Debit(tx *gorm.DB, walletID uuid.UUID, amount float64) (float64, error) {
	result := tx.Model(&models.Wallet{}).
		Where("id = ? AND balance >= ?", walletID, amount).
		UpdateColumn("balance", gorm.Expr("balance - ?", amount))
	if result.Error != nil {
		return 0, result.Error
	}
	if result.RowsAffected == 0 {
		return 0, gorm.ErrRecordNotFound
	}
	var wallet models.Wallet
	if err := tx.Where("id = ?", walletID).First(&wallet).Error; err != nil {
		return 0, err
	}
	return wallet.Balance, nil
}

func (r *walletRepository) CreateTransaction(tx *gorm.DB, t *models.WalletTransaction) error {
	return tx.Create(t).Error
}

func (r *walletRepository) FindTransactions(walletID uuid.UUID, page, limit int) ([]models.WalletTransaction, int64, error) {
	var txns []models.WalletTransaction
	var total int64

	query := r.db.Model(&models.WalletTransaction{}).Where("wallet_id = ?", walletID)
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&txns).Error; err != nil {
		return nil, 0, err
	}

	return txns, total, nil
}
