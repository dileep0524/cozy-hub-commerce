package dto

import "github.com/google/uuid"

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type AdminInfo struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
	Role     string    `json:"role"`
}

type LoginResponse struct {
	Token string    `json:"token"`
	Admin AdminInfo `json:"admin"`
}
