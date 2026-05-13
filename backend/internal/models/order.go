package models

import (
	"time"

	"github.com/google/uuid"
)

// Valid statuses: pending, confirmed, processing, packed, shipped, delivered, cancelled, returned, refunded
type Order struct {
	ID                 uuid.UUID   `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	SellerID           uuid.UUID   `json:"seller_id" gorm:"type:uuid;not null;index"`
	Seller             *Seller     `json:"seller,omitempty" gorm:"foreignKey:SellerID"`
	MarketplaceOrderID string      `json:"marketplace_order_id" gorm:"not null;index"`
	ShipByDate         time.Time   `json:"ship_by_date"`
	Status             string      `json:"status" gorm:"default:'pending'"`
	TotalAmount        float64     `json:"total_amount"`
	ShippingCharge     float64     `json:"shipping_charge"`
	WalletDeducted     float64     `json:"wallet_deducted"`
	Notes              string      `json:"notes"`
	Items              []OrderItem `json:"items,omitempty" gorm:"foreignKey:OrderID"`
	CreatedAt          time.Time   `json:"created_at"`
	UpdatedAt          time.Time   `json:"updated_at"`
}
