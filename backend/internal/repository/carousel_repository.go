package repository

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CarouselRepository interface {
	Create(s *models.CarouselSlide) error
	FindAll() ([]models.CarouselSlide, error)
	FindActive() ([]models.CarouselSlide, error)
	FindByID(id uuid.UUID) (*models.CarouselSlide, error)
	Update(s *models.CarouselSlide) error
	Delete(id uuid.UUID) error
}

type carouselRepository struct {
	db *gorm.DB
}

func NewCarouselRepository(db *gorm.DB) CarouselRepository {
	return &carouselRepository{db: db}
}

func (r *carouselRepository) Create(s *models.CarouselSlide) error {
	return r.db.Create(s).Error
}

func (r *carouselRepository) FindAll() ([]models.CarouselSlide, error) {
	var slides []models.CarouselSlide
	err := r.db.Order("sort_order ASC, created_at ASC").Find(&slides).Error
	return slides, err
}

func (r *carouselRepository) FindActive() ([]models.CarouselSlide, error) {
	var slides []models.CarouselSlide
	err := r.db.Where("is_active = ?", true).Order("sort_order ASC, created_at ASC").Find(&slides).Error
	return slides, err
}

func (r *carouselRepository) FindByID(id uuid.UUID) (*models.CarouselSlide, error) {
	var slide models.CarouselSlide
	if err := r.db.First(&slide, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &slide, nil
}

func (r *carouselRepository) Update(s *models.CarouselSlide) error {
	return r.db.Save(s).Error
}

func (r *carouselRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.CarouselSlide{}, "id = ?", id).Error
}
