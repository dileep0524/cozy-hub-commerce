package models

import (
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	SKU         string    `json:"sku" gorm:"uniqueIndex"`
	Price       float64   `json:"price"`
	Stock       int       `json:"stock" gorm:"default:0"`
	Category    string    `json:"category"`
	Status      string    `json:"status" gorm:"default:'active'"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
