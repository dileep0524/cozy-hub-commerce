package controller

import (
	"net/http"
	"strconv"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type ProductController struct {
	svc service.ProductService
}

func NewProductController(svc service.ProductService) *ProductController {
	return &ProductController{svc: svc}
}

func (c *ProductController) Create(ctx *gin.Context) {
	var req dto.CreateProductRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	product, err := c.svc.CreateProduct(req)
	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, product)
}

func (c *ProductController) List(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	category := ctx.Query("category")
	search := ctx.Query("search")
	activeOnly := ctx.Query("active_only") == "true"

	products, total, err := c.svc.ListProducts(page, limit, category, search, activeOnly)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data":  products,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// Seller-facing list: only active products
func (c *ProductController) SellerList(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	category := ctx.Query("category")
	search := ctx.Query("search")

	products, total, err := c.svc.ListProducts(page, limit, category, search, true)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data":  products,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (c *ProductController) GetOne(ctx *gin.Context) {
	product, err := c.svc.GetProduct(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}
	ctx.JSON(http.StatusOK, product)
}

func (c *ProductController) Update(ctx *gin.Context) {
	var req dto.UpdateProductRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	product, err := c.svc.UpdateProduct(ctx.Param("id"), req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, product)
}

func (c *ProductController) Delete(ctx *gin.Context) {
	if err := c.svc.DeleteProduct(ctx.Param("id")); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "product deleted"})
}

func (c *ProductController) UploadImage(ctx *gin.Context) {
	file, header, err := ctx.Request.FormFile("image")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "image file required"})
		return
	}
	defer file.Close()

	img, err := c.svc.UploadImage(ctx.Param("id"), file, header)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, img)
}

func (c *ProductController) DeleteImage(ctx *gin.Context) {
	if err := c.svc.DeleteImage(ctx.Param("imageID")); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "image deleted"})
}

func (c *ProductController) AddVariant(ctx *gin.Context) {
	var req dto.CreateVariantRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	variant, err := c.svc.AddVariant(ctx.Param("id"), req)
	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, variant)
}

func (c *ProductController) UpdateVariant(ctx *gin.Context) {
	var req dto.UpdateVariantRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	variant, err := c.svc.UpdateVariant(ctx.Param("variantID"), req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, variant)
}

func (c *ProductController) DeleteVariant(ctx *gin.Context) {
	if err := c.svc.DeleteVariant(ctx.Param("variantID")); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "variant deleted"})
}
