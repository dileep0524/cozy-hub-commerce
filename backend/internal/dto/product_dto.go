package dto

type CreateProductRequest struct {
	Name           string  `json:"name" binding:"required,min=2,max=200"`
	Description    string  `json:"description"`
	SKU            string  `json:"sku" binding:"required"`
	Price          float64 `json:"price" binding:"required,gt=0"`
	Stock          int     `json:"stock" binding:"gte=0"`
	Category       string  `json:"category"`
	IsActive       bool    `json:"is_active"`
	WeightGrams    float64 `json:"weight_grams"`
	LengthCM       float64 `json:"length_cm"`
	WidthCM        float64 `json:"width_cm"`
	HeightCM       float64 `json:"height_cm"`
	ShippingCharge float64 `json:"shipping_charge"`
}

type UpdateProductRequest struct {
	Name           string  `json:"name"`
	Description    string  `json:"description"`
	Price          float64 `json:"price"`
	Stock          int     `json:"stock"`
	Category       string  `json:"category"`
	IsActive       *bool   `json:"is_active"`
	WeightGrams    float64 `json:"weight_grams"`
	LengthCM       float64 `json:"length_cm"`
	WidthCM        float64 `json:"width_cm"`
	HeightCM       float64 `json:"height_cm"`
	ShippingCharge float64 `json:"shipping_charge"`
}

type CreateVariantRequest struct {
	Name  string  `json:"name" binding:"required"`
	SKU   string  `json:"sku" binding:"required"`
	Price float64 `json:"price" binding:"required,gt=0"`
	Stock int     `json:"stock" binding:"gte=0"`
}

type UpdateVariantRequest struct {
	Name   string  `json:"name"`
	Price  float64 `json:"price"`
	Stock  int     `json:"stock"`
	Status string  `json:"status" binding:"omitempty,oneof=active inactive"`
}
