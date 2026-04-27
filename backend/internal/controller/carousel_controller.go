package controller

import (
	"net/http"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type CarouselController struct {
	svc service.CarouselService
}

func NewCarouselController(svc service.CarouselService) *CarouselController {
	return &CarouselController{svc: svc}
}

// Public — returns only active slides
func (c *CarouselController) GetActive(ctx *gin.Context) {
	slides, err := c.svc.GetActiveSlides()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch slides"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"data": slides})
}

// Admin — returns all slides (active + inactive)
func (c *CarouselController) GetAll(ctx *gin.Context) {
	slides, err := c.svc.GetAllSlides()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch slides"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"data": slides})
}

func (c *CarouselController) Create(ctx *gin.Context) {
	var req dto.CreateCarouselSlideRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	slide, err := c.svc.CreateSlide(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create slide"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"message": "slide created", "data": slide})
}

func (c *CarouselController) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	var req dto.UpdateCarouselSlideRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	slide, err := c.svc.UpdateSlide(id, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update slide"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "slide updated", "data": slide})
}

func (c *CarouselController) Delete(ctx *gin.Context) {
	id := ctx.Param("id")
	if err := c.svc.DeleteSlide(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete slide"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "slide deleted"})
}
