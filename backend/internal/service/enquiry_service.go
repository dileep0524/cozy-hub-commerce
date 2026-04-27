package service

import (
	"math"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
	"github.com/google/uuid"
)

type EnquiryService interface {
	CreateEnquiry(req dto.CreateEnquiryRequest) (*models.Enquiry, error)
	GetEnquiries(page, limit int, status, search string) (*dto.EnquiriesListResponse, error)
	UpdateEnquiryStatus(id string, status string) (*models.Enquiry, error)
}

type enquiryService struct {
	repo repository.EnquiryRepository
}

func NewEnquiryService(repo repository.EnquiryRepository) EnquiryService {
	return &enquiryService{repo: repo}
}

func (s *enquiryService) CreateEnquiry(req dto.CreateEnquiryRequest) (*models.Enquiry, error) {
	enquiry := &models.Enquiry{
		Name:         req.Name,
		Email:        req.Email,
		Phone:        req.Phone,
		BusinessType: req.BusinessType,
		Message:      req.Message,
		Status:       "new",
	}
	if err := s.repo.Create(enquiry); err != nil {
		return nil, err
	}
	return enquiry, nil
}

func (s *enquiryService) GetEnquiries(page, limit int, status, search string) (*dto.EnquiriesListResponse, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	enquiries, total, err := s.repo.FindAll(page, limit, status, search)
	if err != nil {
		return nil, err
	}

	var items []dto.EnquiryResponse
	for _, e := range enquiries {
		items = append(items, dto.EnquiryResponse{
			ID:           e.ID,
			Name:         e.Name,
			Email:        e.Email,
			Phone:        e.Phone,
			BusinessType: e.BusinessType,
			Message:      e.Message,
			Status:       e.Status,
			CreatedAt:    e.CreatedAt,
		})
	}
	if items == nil {
		items = []dto.EnquiryResponse{}
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	return &dto.EnquiriesListResponse{
		Data:       items,
		Total:      total,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
	}, nil
}

func (s *enquiryService) UpdateEnquiryStatus(id string, status string) (*models.Enquiry, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return nil, err
	}
	if err := s.repo.UpdateStatus(uid, status); err != nil {
		return nil, err
	}
	return s.repo.FindByID(uid)
}
