package models

import (
	"time"

	"github.com/google/uuid"
)

type ProductImage struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProductID uuid.UUID `json:"product_id" gorm:"type:uuid;not null;index"`
	URL       string    `json:"url" gorm:"not null"`
	SortOrder int       `json:"sort_order" gorm:"default:0"`
	IsPrimary bool      `json:"is_primary" gorm:"default:false"`
	CreatedAt time.Time `json:"created_at"`
}
