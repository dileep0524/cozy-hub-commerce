package repository

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SellerRepository interface {
	Create(s *models.Seller) error
	FindByEmail(email string) (*models.Seller, error)
	FindByID(id uuid.UUID) (*models.Seller, error)
	FindAll(page, limit int, status, search string) ([]models.Seller, int64, error)
	UpdateStatus(id uuid.UUID, status string) error
}

type sellerRepository struct {
	db *gorm.DB
}

func NewSellerRepository(db *gorm.DB) SellerRepository {
	return &sellerRepository{db: db}
}

func (r *sellerRepository) Create(s *models.Seller) error {
	return r.db.Create(s).Error
}

func (r *sellerRepository) FindByEmail(email string) (*models.Seller, error) {
	var seller models.Seller
	if err := r.db.Where("email = ? AND deleted_at IS NULL", email).First(&seller).Error; err != nil {
		return nil, err
	}
	return &seller, nil
}

func (r *sellerRepository) FindByID(id uuid.UUID) (*models.Seller, error) {
	var seller models.Seller
	if err := r.db.Preload("Wallet").First(&seller, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &seller, nil
}

func (r *sellerRepository) FindAll(page, limit int, status, search string) ([]models.Seller, int64, error) {
	var sellers []models.Seller
	var total int64

	query := r.db.Model(&models.Seller{})
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if search != "" {
		like := "%" + search + "%"
		query = query.Where("name ILIKE ? OR email ILIKE ? OR business_name ILIKE ?", like, like, like)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := query.Preload("Wallet").Order("created_at DESC").Offset(offset).Limit(limit).Find(&sellers).Error; err != nil {
		return nil, 0, err
	}

	return sellers, total, nil
}

func (r *sellerRepository) UpdateStatus(id uuid.UUID, status string) error {
	return r.db.Model(&models.Seller{}).Where("id = ?", id).Update("status", status).Error
}
