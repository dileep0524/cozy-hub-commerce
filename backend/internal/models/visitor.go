package models

import (
	"time"

	"github.com/google/uuid"
)

type Visitor struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	IP        string    `json:"ip"`
	UserAgent string    `json:"user_agent"`
	Page      string    `json:"page"`
	CreatedAt time.Time `json:"created_at"`
}
