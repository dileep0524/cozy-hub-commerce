package dto

import (
	"time"

	"github.com/google/uuid"
)

type PlaceOrderRequest struct {
	MarketplaceOrderID string    `json:"marketplace_order_id" binding:"required"`
	ShipByDate         time.Time `json:"ship_by_date" binding:"required"`
	ProductID          uuid.UUID `json:"product_id" binding:"required"`
	VariantID          *uuid.UUID `json:"variant_id"`
	Quantity           int       `json:"quantity" binding:"required,gt=0"`
	Notes              string    `json:"notes"`
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=pending confirmed processing packed shipped delivered cancelled returned refunded"`
}
