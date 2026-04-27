package repository

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"gorm.io/gorm"
)

type VisitorRepository interface {
	Create(v *models.Visitor) error
	CountAll() (int64, error)
	CountByDay(days int) ([]dto.DailyStat, error)
}

type visitorRepository struct {
	db *gorm.DB
}

func NewVisitorRepository(db *gorm.DB) VisitorRepository {
	return &visitorRepository{db: db}
}

func (r *visitorRepository) Create(v *models.Visitor) error {
	return r.db.Create(v).Error
}

func (r *visitorRepository) CountAll() (int64, error) {
	var count int64
	if err := r.db.Model(&models.Visitor{}).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *visitorRepository) CountByDay(days int) ([]dto.DailyStat, error) {
	var stats []dto.DailyStat
	err := r.db.Raw(`
		SELECT TO_CHAR(created_at::date, 'YYYY-MM-DD') AS date, COUNT(*) AS count
		FROM visitors
		WHERE created_at >= NOW() - INTERVAL '1 day' * ?
		GROUP BY created_at::date
		ORDER BY created_at::date ASC
	`, days).Scan(&stats).Error
	return stats, err
}
