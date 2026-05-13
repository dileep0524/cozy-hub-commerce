package controller

import (
	"net/http"
	"strconv"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type SellerController struct {
	svc service.SellerService
}

func NewSellerController(svc service.SellerService) *SellerController {
	return &SellerController{svc: svc}
}

func (c *SellerController) Login(ctx *gin.Context) {
	var req dto.SellerLoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := c.svc.Login(req)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, resp)
}

func (c *SellerController) Me(ctx *gin.Context) {
	sellerID := ctx.GetString("userID")
	seller, err := c.svc.GetByID(sellerID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "seller not found"})
		return
	}
	ctx.JSON(http.StatusOK, seller)
}

// Admin: create seller
func (c *SellerController) AdminCreate(ctx *gin.Context) {
	var req dto.CreateSellerRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	seller, err := c.svc.CreateSeller(req)
	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, seller)
}

// Admin: list sellers
func (c *SellerController) AdminList(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	status := ctx.Query("status")
	search := ctx.Query("search")

	sellers, total, err := c.svc.ListSellers(page, limit, status, search)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data":  sellers,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// Admin: get seller
func (c *SellerController) AdminGetOne(ctx *gin.Context) {
	seller, err := c.svc.GetByID(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "seller not found"})
		return
	}
	ctx.JSON(http.StatusOK, seller)
}

// Admin: update seller status
func (c *SellerController) AdminUpdateStatus(ctx *gin.Context) {
	var req dto.UpdateSellerStatusRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := c.svc.UpdateStatus(ctx.Param("id"), req.Status); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "status updated"})
}
