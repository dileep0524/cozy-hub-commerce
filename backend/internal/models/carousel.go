package models

import (
	"time"

	"github.com/google/uuid"
)

type CarouselSlide struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	Title      string    `json:"title" gorm:"not null"`
	Subtitle   string    `json:"subtitle"`
	ImageURL   string    `json:"image_url"`
	CTAText    string    `json:"cta_text"`
	CTALink    string    `json:"cta_link"`
	BadgeText  string    `json:"badge_text"`
	BgColor    string    `json:"bg_color" gorm:"default:'from-brand-600 to-brand-900'"`
	SortOrder  int       `json:"sort_order" gorm:"default:0"`
	IsActive   bool      `json:"is_active" gorm:"default:true"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
