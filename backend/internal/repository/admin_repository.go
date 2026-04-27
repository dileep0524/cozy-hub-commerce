package repository

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AdminRepository interface {
	Create(a *models.Admin) error
	FindByEmail(email string) (*models.Admin, error)
	FindByID(id uuid.UUID) (*models.Admin, error)
	ExistsAny() (bool, error)
}

type adminRepository struct {
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) AdminRepository {
	return &adminRepository{db: db}
}

func (r *adminRepository) Create(a *models.Admin) error {
	return r.db.Create(a).Error
}

func (r *adminRepository) FindByEmail(email string) (*models.Admin, error) {
	var admin models.Admin
	if err := r.db.Where("email = ?", email).First(&admin).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *adminRepository) FindByID(id uuid.UUID) (*models.Admin, error) {
	var admin models.Admin
	if err := r.db.First(&admin, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *adminRepository) ExistsAny() (bool, error) {
	var count int64
	if err := r.db.Model(&models.Admin{}).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
