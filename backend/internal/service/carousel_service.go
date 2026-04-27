package service

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
	"github.com/google/uuid"
)

type CarouselService interface {
	CreateSlide(req dto.CreateCarouselSlideRequest) (*models.CarouselSlide, error)
	GetAllSlides() ([]models.CarouselSlide, error)
	GetActiveSlides() ([]models.CarouselSlide, error)
	UpdateSlide(id string, req dto.UpdateCarouselSlideRequest) (*models.CarouselSlide, error)
	DeleteSlide(id string) error
}

type carouselService struct {
	repo repository.CarouselRepository
}

func NewCarouselService(repo repository.CarouselRepository) CarouselService {
	return &carouselService{repo: repo}
}

func (s *carouselService) CreateSlide(req dto.CreateCarouselSlideRequest) (*models.CarouselSlide, error) {
	bgColor := req.BgColor
	if bgColor == "" {
		bgColor = "from-brand-600 to-brand-900"
	}
	slide := &models.CarouselSlide{
		Title:     req.Title,
		Subtitle:  req.Subtitle,
		ImageURL:  req.ImageURL,
		CTAText:   req.CTAText,
		CTALink:   req.CTALink,
		BadgeText: req.BadgeText,
		BgColor:   bgColor,
		SortOrder: req.SortOrder,
		IsActive:  req.IsActive,
	}
	if err := s.repo.Create(slide); err != nil {
		return nil, err
	}
	return slide, nil
}

func (s *carouselService) GetAllSlides() ([]models.CarouselSlide, error) {
	return s.repo.FindAll()
}

func (s *carouselService) GetActiveSlides() ([]models.CarouselSlide, error) {
	return s.repo.FindActive()
}

func (s *carouselService) UpdateSlide(id string, req dto.UpdateCarouselSlideRequest) (*models.CarouselSlide, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return nil, err
	}
	slide, err := s.repo.FindByID(uid)
	if err != nil {
		return nil, err
	}

	slide.Title = req.Title
	slide.Subtitle = req.Subtitle
	slide.ImageURL = req.ImageURL
	slide.CTAText = req.CTAText
	slide.CTALink = req.CTALink
	slide.BadgeText = req.BadgeText
	slide.BgColor = req.BgColor
	slide.SortOrder = req.SortOrder
	slide.IsActive = req.IsActive

	if err := s.repo.Update(slide); err != nil {
		return nil, err
	}
	return slide, nil
}

func (s *carouselService) DeleteSlide(id string) error {
	uid, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	return s.repo.Delete(uid)
}
