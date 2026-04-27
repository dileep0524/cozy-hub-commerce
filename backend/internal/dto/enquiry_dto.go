package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateEnquiryRequest struct {
	Name         string `json:"name" binding:"required,min=2,max=100"`
	Email        string `json:"email" binding:"required,email"`
	Phone        string `json:"phone" binding:"max=20"`
	BusinessType string `json:"business_type" binding:"max=50"`
	Message      string `json:"message" binding:"required,min=10,max=1000"`
}

type UpdateEnquiryStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=new read replied closed"`
}

type EnquiryResponse struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	Phone        string    `json:"phone"`
	BusinessType string    `json:"business_type"`
	Message      string    `json:"message"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
}

type EnquiriesListResponse struct {
	Data       []EnquiryResponse `json:"data"`
	Total      int64             `json:"total"`
	Page       int               `json:"page"`
	Limit      int               `json:"limit"`
	TotalPages int               `json:"total_pages"`
}
