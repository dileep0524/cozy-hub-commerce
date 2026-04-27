package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreateCarouselSlideRequest struct {
	Title     string `json:"title" binding:"required,min=2,max=200"`
	Subtitle  string `json:"subtitle" binding:"max=500"`
	ImageURL  string `json:"image_url" binding:"max=500"`
	CTAText   string `json:"cta_text" binding:"max=100"`
	CTALink   string `json:"cta_link" binding:"max=200"`
	BadgeText string `json:"badge_text" binding:"max=100"`
	BgColor   string `json:"bg_color" binding:"max=100"`
	SortOrder int    `json:"sort_order"`
	IsActive  bool   `json:"is_active"`
}

type UpdateCarouselSlideRequest struct {
	Title     string `json:"title" binding:"required,min=2,max=200"`
	Subtitle  string `json:"subtitle" binding:"max=500"`
	ImageURL  string `json:"image_url" binding:"max=500"`
	CTAText   string `json:"cta_text" binding:"max=100"`
	CTALink   string `json:"cta_link" binding:"max=200"`
	BadgeText string `json:"badge_text" binding:"max=100"`
	BgColor   string `json:"bg_color" binding:"max=100"`
	SortOrder int    `json:"sort_order"`
	IsActive  bool   `json:"is_active"`
}

type CarouselSlideResponse struct {
	ID        uuid.UUID `json:"id"`
	Title     string    `json:"title"`
	Subtitle  string    `json:"subtitle"`
	ImageURL  string    `json:"image_url"`
	CTAText   string    `json:"cta_text"`
	CTALink   string    `json:"cta_link"`
	BadgeText string    `json:"badge_text"`
	BgColor   string    `json:"bg_color"`
	SortOrder int       `json:"sort_order"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
