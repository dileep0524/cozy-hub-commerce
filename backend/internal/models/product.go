package models

import (
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID             uuid.UUID        `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	Name           string           `json:"name" gorm:"not null"`
	Description    string           `json:"description"`
	SKU            string           `json:"sku" gorm:"uniqueIndex"`
	Price          float64          `json:"price"`
	Stock          int              `json:"stock" gorm:"default:0"`
	Category       string           `json:"category"`
	Status         string           `json:"status" gorm:"default:'active'"`
	IsActive       bool             `json:"is_active" gorm:"default:true"`
	WeightGrams    float64          `json:"weight_grams"`
	LengthCM       float64          `json:"length_cm"`
	WidthCM        float64          `json:"width_cm"`
	HeightCM       float64          `json:"height_cm"`
	ShippingCharge float64          `json:"shipping_charge" gorm:"default:0"`
	Images         []ProductImage   `json:"images,omitempty" gorm:"foreignKey:ProductID"`
	Variants       []ProductVariant `json:"variants,omitempty" gorm:"foreignKey:ProductID"`
	CreatedAt      time.Time        `json:"created_at"`
	UpdatedAt      time.Time        `json:"updated_at"`
}
