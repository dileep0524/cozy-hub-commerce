package models

import (
	"time"

	"github.com/google/uuid"
)

type Enquiry struct {
	ID           uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	Name         string    `json:"name" gorm:"not null"`
	Email        string    `json:"email" gorm:"not null"`
	Phone        string    `json:"phone"`
	BusinessType string    `json:"business_type"`
	Message      string    `json:"message" gorm:"not null"`
	Status       string    `json:"status" gorm:"default:'new'"`
	CreatedAt    time.Time `json:"created_at"`
}
