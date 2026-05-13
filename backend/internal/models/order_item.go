package models

import (
	"time"

	"github.com/google/uuid"
)

type OrderItem struct {
	ID             uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	OrderID        uuid.UUID  `json:"order_id" gorm:"type:uuid;not null;index"`
	ProductID      uuid.UUID  `json:"product_id" gorm:"type:uuid;not null"`
	VariantID      *uuid.UUID `json:"variant_id,omitempty" gorm:"type:uuid"`
	SKU            string     `json:"sku"`
	ProductName    string     `json:"product_name"`
	Quantity       int        `json:"quantity" gorm:"not null"`
	UnitPrice      float64    `json:"unit_price"`
	ShippingCharge float64    `json:"shipping_charge"`
	TotalPrice     float64    `json:"total_price"`
	CreatedAt      time.Time  `json:"created_at"`
}
