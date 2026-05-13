package controller

import (
	"io"
	"net/http"
	"strconv"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type WalletController struct {
	svc service.WalletService
}

func NewWalletController(svc service.WalletService) *WalletController {
	return &WalletController{svc: svc}
}

func (c *WalletController) GetWallet(ctx *gin.Context) {
	sellerID := ctx.GetString("userID")
	wallet, err := c.svc.GetWallet(sellerID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "wallet not found"})
		return
	}
	ctx.JSON(http.StatusOK, wallet)
}

func (c *WalletController) GetTransactions(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	sellerID := ctx.GetString("userID")

	txns, total, err := c.svc.GetTransactions(sellerID, page, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data":  txns,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (c *WalletController) InitiateTopup(ctx *gin.Context) {
	var req dto.TopupInitiateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sellerID := ctx.GetString("userID")
	resp, err := c.svc.InitiateTopup(sellerID, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, resp)
}

func (c *WalletController) VerifyTopup(ctx *gin.Context) {
	var req dto.TopupVerifyRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sellerID := ctx.GetString("userID")
	if err := c.svc.VerifyTopup(sellerID, req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "wallet topped up successfully"})
}

func (c *WalletController) RazorpayWebhook(ctx *gin.Context) {
	signature := ctx.GetHeader("X-Razorpay-Signature")
	body, err := io.ReadAll(ctx.Request.Body)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "cannot read body"})
		return
	}
	if err := c.svc.HandleRazorpayWebhook(signature, body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
}
