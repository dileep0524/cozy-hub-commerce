package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Seller struct {
	ID           uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	Name         string         `json:"name" gorm:"not null"`
	Email        string         `json:"email" gorm:"uniqueIndex;not null"`
	Password     string         `json:"-" gorm:"not null"`
	Phone        string         `json:"phone"`
	BusinessName string         `json:"business_name"`
	GSTIN        string         `json:"gstin"`
	Status       string         `json:"status" gorm:"default:'active'"` // active, suspended, pending
	Wallet       *Wallet        `json:"wallet,omitempty" gorm:"foreignKey:SellerID"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}
