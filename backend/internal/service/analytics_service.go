package service

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
)

type AnalyticsService interface {
	GetAnalytics() (*dto.AnalyticsResponse, error)
}

type analyticsService struct {
	visitorRepo  repository.VisitorRepository
	enquiryRepo  repository.EnquiryRepository
}

func NewAnalyticsService(vr repository.VisitorRepository, er repository.EnquiryRepository) AnalyticsService {
	return &analyticsService{visitorRepo: vr, enquiryRepo: er}
}

func (s *analyticsService) GetAnalytics() (*dto.AnalyticsResponse, error) {
	totalVisitors, err := s.visitorRepo.CountAll()
	if err != nil {
		return nil, err
	}

	totalEnquiries, err := s.enquiryRepo.CountAll()
	if err != nil {
		return nil, err
	}

	newEnquiries, err := s.enquiryRepo.CountNew()
	if err != nil {
		return nil, err
	}

	visitorsPerDay, err := s.visitorRepo.CountByDay(7)
	if err != nil {
		return nil, err
	}

	enquiriesPerDay, err := s.enquiryRepo.CountByDay(7)
	if err != nil {
		return nil, err
	}

	var conversionRate float64
	if totalVisitors > 0 {
		conversionRate = (float64(totalEnquiries) / float64(totalVisitors)) * 100
	}

	if visitorsPerDay == nil {
		visitorsPerDay = []dto.DailyStat{}
	}
	if enquiriesPerDay == nil {
		enquiriesPerDay = []dto.DailyStat{}
	}

	return &dto.AnalyticsResponse{
		TotalVisitors:   totalVisitors,
		TotalEnquiries:  totalEnquiries,
		NewEnquiries:    newEnquiries,
		ConversionRate:  conversionRate,
		VisitorsPerDay:  visitorsPerDay,
		EnquiriesPerDay: enquiriesPerDay,
	}, nil
}
