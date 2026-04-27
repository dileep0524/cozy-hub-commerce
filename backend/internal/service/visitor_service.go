package service

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
)

type VisitorService interface {
	TrackVisitor(req dto.CreateVisitorRequest, ip, userAgent string) error
}

type visitorService struct {
	repo repository.VisitorRepository
}

func NewVisitorService(repo repository.VisitorRepository) VisitorService {
	return &visitorService{repo: repo}
}

func (s *visitorService) TrackVisitor(req dto.CreateVisitorRequest, ip, userAgent string) error {
	visitor := &models.Visitor{
		IP:        ip,
		UserAgent: userAgent,
		Page:      req.Page,
	}
	return s.repo.Create(visitor)
}
