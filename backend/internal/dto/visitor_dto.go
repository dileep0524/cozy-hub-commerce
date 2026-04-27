package dto

type CreateVisitorRequest struct {
	Page string `json:"page" binding:"required"`
}
