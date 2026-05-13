package controller

import (
	"net/http"
	"strconv"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type OrderController struct {
	svc service.OrderService
}

func NewOrderController(svc service.OrderService) *OrderController {
	return &OrderController{svc: svc}
}

func (c *OrderController) Place(ctx *gin.Context) {
	var req dto.PlaceOrderRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	sellerID := ctx.GetString("userID")
	order, err := c.svc.PlaceOrder(sellerID, req)
	if err != nil {
		status := http.StatusBadRequest
		if err.Error() == "marketplace order ID already placed" {
			status = http.StatusConflict
		}
		if err.Error() == "insufficient wallet balance" {
			status = http.StatusPaymentRequired
		}
		ctx.JSON(status, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, order)
}

func (c *OrderController) List(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	status := ctx.Query("status")
	search := ctx.Query("search")
	sellerID := ctx.GetString("userID")

	orders, total, err := c.svc.ListSellerOrders(sellerID, page, limit, status, search)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data":  orders,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (c *OrderController) GetOne(ctx *gin.Context) {
	sellerID := ctx.GetString("userID")
	order, err := c.svc.GetOrder(ctx.Param("id"), sellerID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, order)
}

func (c *OrderController) Cancel(ctx *gin.Context) {
	sellerID := ctx.GetString("userID")
	if err := c.svc.CancelOrder(ctx.Param("id"), sellerID); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "order cancelled"})
}

// Admin handlers
func (c *OrderController) AdminList(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	status := ctx.Query("status")
	search := ctx.Query("search")

	orders, total, err := c.svc.AdminListOrders(page, limit, status, search)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data":  orders,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (c *OrderController) AdminGetOne(ctx *gin.Context) {
	order, err := c.svc.AdminGetOrder(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
		return
	}
	ctx.JSON(http.StatusOK, order)
}

func (c *OrderController) AdminUpdateStatus(ctx *gin.Context) {
	var req dto.UpdateOrderStatusRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.svc.AdminUpdateStatus(ctx.Param("id"), req.Status); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "status updated"})
}
