package models

import (
	"time"

	"github.com/google/uuid"
)

// Immutable ledger entry — no UpdatedAt by design
type WalletTransaction struct {
	ID                uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	WalletID          uuid.UUID `json:"wallet_id" gorm:"type:uuid;not null;index"`
	SellerID          uuid.UUID `json:"seller_id" gorm:"type:uuid;not null;index"`
	Type              string    `json:"type" gorm:"not null"` // credit, debit, refund, reversal, adjustment
	Amount            float64   `json:"amount" gorm:"not null"`
	BalanceAfter      float64   `json:"balance_after" gorm:"not null"`
	ReferenceType     string    `json:"reference_type"` // order, razorpay, return, manual
	ReferenceID       string    `json:"reference_id"`
	Description       string    `json:"description"`
	RazorpayOrderID   string    `json:"razorpay_order_id,omitempty"`
	RazorpayPaymentID string    `json:"razorpay_payment_id,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
}
