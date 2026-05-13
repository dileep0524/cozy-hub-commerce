package dto

import "github.com/google/uuid"

type CreateSellerRequest struct {
	Name         string `json:"name" binding:"required,min=2,max=100"`
	Email        string `json:"email" binding:"required,email"`
	Password     string `json:"password" binding:"required,min=8"`
	Phone        string `json:"phone"`
	BusinessName string `json:"business_name"`
	GSTIN        string `json:"gstin"`
}

type UpdateSellerStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=active suspended pending"`
}

type SellerLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type SellerInfo struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	Phone        string    `json:"phone"`
	BusinessName string    `json:"business_name"`
	GSTIN        string    `json:"gstin"`
	Status       string    `json:"status"`
}

type SellerLoginResponse struct {
	Token  string     `json:"token"`
	Seller SellerInfo `json:"seller"`
}
