package dto

type TopupInitiateRequest struct {
	Amount float64 `json:"amount" binding:"required,gt=0"`
}

type TopupInitiateResponse struct {
	RazorpayOrderID string  `json:"razorpay_order_id"`
	Amount          int64   `json:"amount"` // in paise
	Currency        string  `json:"currency"`
	KeyID           string  `json:"key_id"`
}

type TopupVerifyRequest struct {
	RazorpayOrderID   string  `json:"razorpay_order_id" binding:"required"`
	RazorpayPaymentID string  `json:"razorpay_payment_id" binding:"required"`
	RazorpaySignature string  `json:"razorpay_signature" binding:"required"`
	Amount            float64 `json:"amount" binding:"required,gt=0"`
}
