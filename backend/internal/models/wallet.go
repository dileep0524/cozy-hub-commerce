package models

import (
	"time"

	"github.com/google/uuid"
)

type Wallet struct {
	ID           uuid.UUID           `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	SellerID     uuid.UUID           `json:"seller_id" gorm:"type:uuid;uniqueIndex;not null"`
	Balance      float64             `json:"balance" gorm:"default:0"`
	Transactions []WalletTransaction `json:"transactions,omitempty" gorm:"foreignKey:WalletID"`
	CreatedAt    time.Time           `json:"created_at"`
	UpdatedAt    time.Time           `json:"updated_at"`
}
