package controller

import (
	"net/http"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AnalyticsController struct {
	svc service.AnalyticsService
}

func NewAnalyticsController(svc service.AnalyticsService) *AnalyticsController {
	return &AnalyticsController{svc: svc}
}

func (c *AnalyticsController) GetAnalytics(ctx *gin.Context) {
	resp, err := c.svc.GetAnalytics()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch analytics"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": resp})
}
