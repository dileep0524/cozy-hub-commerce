package repository

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EnquiryRepository interface {
	Create(e *models.Enquiry) error
	FindAll(page, limit int, status, search string) ([]models.Enquiry, int64, error)
	FindByID(id uuid.UUID) (*models.Enquiry, error)
	UpdateStatus(id uuid.UUID, status string) error
	CountAll() (int64, error)
	CountNew() (int64, error)
	CountByDay(days int) ([]dto.DailyStat, error)
}

type enquiryRepository struct {
	db *gorm.DB
}

func NewEnquiryRepository(db *gorm.DB) EnquiryRepository {
	return &enquiryRepository{db: db}
}

func (r *enquiryRepository) Create(e *models.Enquiry) error {
	return r.db.Create(e).Error
}

func (r *enquiryRepository) FindAll(page, limit int, status, search string) ([]models.Enquiry, int64, error) {
	var enquiries []models.Enquiry
	var total int64

	query := r.db.Model(&models.Enquiry{})

	if status != "" {
		query = query.Where("status = ?", status)
	}
	if search != "" {
		like := "%" + search + "%"
		query = query.Where("name ILIKE ? OR email ILIKE ? OR business_type ILIKE ?", like, like, like)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&enquiries).Error; err != nil {
		return nil, 0, err
	}

	return enquiries, total, nil
}

func (r *enquiryRepository) FindByID(id uuid.UUID) (*models.Enquiry, error) {
	var enquiry models.Enquiry
	if err := r.db.First(&enquiry, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &enquiry, nil
}

func (r *enquiryRepository) UpdateStatus(id uuid.UUID, status string) error {
	return r.db.Model(&models.Enquiry{}).Where("id = ?", id).Update("status", status).Error
}

func (r *enquiryRepository) CountAll() (int64, error) {
	var count int64
	if err := r.db.Model(&models.Enquiry{}).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *enquiryRepository) CountNew() (int64, error) {
	var count int64
	if err := r.db.Model(&models.Enquiry{}).Where("status = ?", "new").Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *enquiryRepository) CountByDay(days int) ([]dto.DailyStat, error) {
	var stats []dto.DailyStat
	err := r.db.Raw(`
		SELECT TO_CHAR(created_at::date, 'YYYY-MM-DD') AS date, COUNT(*) AS count
		FROM enquiries
		WHERE created_at >= NOW() - INTERVAL '1 day' * ?
		GROUP BY created_at::date
		ORDER BY created_at::date ASC
	`, days).Scan(&stats).Error
	return stats, err
}
