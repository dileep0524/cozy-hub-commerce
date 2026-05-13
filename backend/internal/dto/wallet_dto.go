package dto

type TopupInitiateRequest struct {
	Amount float64 `json:"amount" binding:"required,gt=0"`
}

type TopupInitiateResponse struct {
	RazorpayOrderID string  `json:"razorpay_order_id"`
	Amount          int64   `json:"amount"`        // charged amount in paise (includes 2.5% fee)
	WalletAmount    float64 `json:"wallet_amount"` // amount credited to wallet (what seller asked for)
	GatewayFee      float64 `json:"gateway_fee"`   // 2.5% fee in rupees
	Currency        string  `json:"currency"`
	KeyID           string  `json:"key_id"`
}

type TopupVerifyRequest struct {
	RazorpayOrderID   string  `json:"razorpay_order_id" binding:"required"`
	RazorpayPaymentID string  `json:"razorpay_payment_id" binding:"required"`
	RazorpaySignature string  `json:"razorpay_signature" binding:"required"`
	Amount            float64 `json:"amount" binding:"required,gt=0"`
}
