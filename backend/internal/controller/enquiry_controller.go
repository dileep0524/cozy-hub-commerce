package controller

import (
	"net/http"
	"strconv"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type EnquiryController struct {
	svc service.EnquiryService
}

func NewEnquiryController(svc service.EnquiryService) *EnquiryController {
	return &EnquiryController{svc: svc}
}

func (c *EnquiryController) Create(ctx *gin.Context) {
	var req dto.CreateEnquiryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	enquiry, err := c.svc.CreateEnquiry(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to submit enquiry"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "enquiry submitted successfully",
		"data":    enquiry,
	})
}

func (c *EnquiryController) List(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	status := ctx.Query("status")
	search := ctx.Query("search")

	result, err := c.svc.GetEnquiries(page, limit, status, search)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch enquiries"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": result})
}

func (c *EnquiryController) UpdateStatus(ctx *gin.Context) {
	id := ctx.Param("id")

	var req dto.UpdateEnquiryStatusRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	enquiry, err := c.svc.UpdateEnquiryStatus(id, req.Status)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update enquiry"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "enquiry updated",
		"data":    enquiry,
	})
}
