package models

import (
	"time"

	"github.com/google/uuid"
)

type ProductVariant struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProductID uuid.UUID `json:"product_id" gorm:"type:uuid;not null;index"`
	Name      string    `json:"name" gorm:"not null"`
	SKU       string    `json:"sku" gorm:"uniqueIndex"`
	Price     float64   `json:"price"`
	Stock     int       `json:"stock" gorm:"default:0"`
	Status    string    `json:"status" gorm:"default:'active'"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
