package controller

import (
	"net/http"
	"strings"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type VisitorController struct {
	svc service.VisitorService
}

func NewVisitorController(svc service.VisitorService) *VisitorController {
	return &VisitorController{svc: svc}
}

func (c *VisitorController) Track(ctx *gin.Context) {
	var req dto.CreateVisitorRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ip := realIP(ctx)
	ua := ctx.Request.UserAgent()

	if err := c.svc.TrackVisitor(req, ip, ua); err != nil {
		// Silently fail — don't block visitor for tracking errors
		ctx.JSON(http.StatusCreated, gin.H{"tracked": false})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"tracked": true})
}

func realIP(ctx *gin.Context) string {
	if xff := ctx.GetHeader("X-Forwarded-For"); xff != "" {
		parts := strings.Split(xff, ",")
		return strings.TrimSpace(parts[0])
	}
	if xri := ctx.GetHeader("X-Real-IP"); xri != "" {
		return xri
	}
	return ctx.ClientIP()
}
