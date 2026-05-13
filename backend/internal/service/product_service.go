package service

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/config"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
	"github.com/google/uuid"
)

type ProductService interface {
	CreateProduct(req dto.CreateProductRequest) (*models.Product, error)
	GetProduct(id string) (*models.Product, error)
	ListProducts(page, limit int, category, search string, activeOnly bool) ([]models.Product, int64, error)
	UpdateProduct(id string, req dto.UpdateProductRequest) (*models.Product, error)
	DeleteProduct(id string) error

	UploadImage(productID string, file multipart.File, header *multipart.FileHeader) (*models.ProductImage, error)
	DeleteImage(imageID string) error

	AddVariant(productID string, req dto.CreateVariantRequest) (*models.ProductVariant, error)
	UpdateVariant(variantID string, req dto.UpdateVariantRequest) (*models.ProductVariant, error)
	DeleteVariant(variantID string) error
}

type productService struct {
	repo repository.ProductRepository
	cfg  *config.Config
}

func NewProductService(repo repository.ProductRepository, cfg *config.Config) ProductService {
	return &productService{repo: repo, cfg: cfg}
}

func (s *productService) CreateProduct(req dto.CreateProductRequest) (*models.Product, error) {
	isActive := req.IsActive
	p := &models.Product{
		Name:           req.Name,
		Description:    req.Description,
		SKU:            req.SKU,
		Price:          req.Price,
		Stock:          req.Stock,
		Category:       req.Category,
		IsActive:       isActive,
		WeightGrams:    req.WeightGrams,
		LengthCM:       req.LengthCM,
		WidthCM:        req.WidthCM,
		HeightCM:       req.HeightCM,
		ShippingCharge: req.ShippingCharge,
		Status:         "active",
	}
	if err := s.repo.Create(p); err != nil {
		return nil, errors.New("SKU already exists")
	}
	return p, nil
}

func (s *productService) GetProduct(id string) (*models.Product, error) {
	uid, err := parseUUID(id)
	if err != nil {
		return nil, err
	}
	return s.repo.FindByID(uid)
}

func (s *productService) ListProducts(page, limit int, category, search string, activeOnly bool) ([]models.Product, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	return s.repo.FindAll(page, limit, category, search, activeOnly)
}

func (s *productService) UpdateProduct(id string, req dto.UpdateProductRequest) (*models.Product, error) {
	uid, err := parseUUID(id)
	if err != nil {
		return nil, err
	}
	p, err := s.repo.FindByID(uid)
	if err != nil {
		return nil, errors.New("product not found")
	}
	if req.Name != "" {
		p.Name = req.Name
	}
	if req.Description != "" {
		p.Description = req.Description
	}
	if req.Price > 0 {
		p.Price = req.Price
	}
	if req.Stock >= 0 {
		p.Stock = req.Stock
	}
	if req.Category != "" {
		p.Category = req.Category
	}
	if req.IsActive != nil {
		p.IsActive = *req.IsActive
	}
	if req.WeightGrams > 0 {
		p.WeightGrams = req.WeightGrams
	}
	if req.LengthCM > 0 {
		p.LengthCM = req.LengthCM
	}
	if req.WidthCM > 0 {
		p.WidthCM = req.WidthCM
	}
	if req.HeightCM > 0 {
		p.HeightCM = req.HeightCM
	}
	if req.ShippingCharge >= 0 {
		p.ShippingCharge = req.ShippingCharge
	}
	if err := s.repo.Update(p); err != nil {
		return nil, err
	}
	return s.repo.FindByID(uid)
}

func (s *productService) DeleteProduct(id string) error {
	uid, err := parseUUID(id)
	if err != nil {
		return err
	}
	return s.repo.Delete(uid)
}

func (s *productService) UploadImage(productID string, file multipart.File, header *multipart.FileHeader) (*models.ProductImage, error) {
	uid, err := parseUUID(productID)
	if err != nil {
		return nil, err
	}

	ext := strings.ToLower(filepath.Ext(header.Filename))
	allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".webp": true}
	if !allowed[ext] {
		return nil, errors.New("only jpg, png, webp images are allowed")
	}
	if header.Size > 10*1024*1024 {
		return nil, errors.New("image must be under 10MB")
	}

	dir := filepath.Join(s.cfg.UploadPath, "products", uid.String())
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, err
	}

	imgID := uuid.New()
	filename := fmt.Sprintf("%s%s", imgID.String(), ext)
	destPath := filepath.Join(dir, filename)

	dst, err := os.Create(destPath)
	if err != nil {
		return nil, err
	}
	defer dst.Close()
	if _, err := io.Copy(dst, file); err != nil {
		return nil, err
	}

	urlPath := fmt.Sprintf("/uploads/products/%s/%s", uid.String(), filename)
	img := &models.ProductImage{
		ID:        imgID,
		ProductID: uid,
		URL:       urlPath,
	}
	if err := s.repo.AddImage(img); err != nil {
		return nil, err
	}
	return img, nil
}

func (s *productService) DeleteImage(imageID string) error {
	uid, err := parseUUID(imageID)
	if err != nil {
		return err
	}
	return s.repo.DeleteImage(uid)
}

func (s *productService) AddVariant(productID string, req dto.CreateVariantRequest) (*models.ProductVariant, error) {
	uid, err := parseUUID(productID)
	if err != nil {
		return nil, err
	}
	v := &models.ProductVariant{
		ProductID: uid,
		Name:      req.Name,
		SKU:       req.SKU,
		Price:     req.Price,
		Stock:     req.Stock,
		Status:    "active",
	}
	if err := s.repo.AddVariant(v); err != nil {
		return nil, errors.New("variant SKU already exists")
	}
	return v, nil
}

func (s *productService) UpdateVariant(variantID string, req dto.UpdateVariantRequest) (*models.ProductVariant, error) {
	uid, err := parseUUID(variantID)
	if err != nil {
		return nil, err
	}
	v, err := s.repo.FindVariantByID(uid)
	if err != nil {
		return nil, errors.New("variant not found")
	}
	if req.Name != "" {
		v.Name = req.Name
	}
	if req.Price > 0 {
		v.Price = req.Price
	}
	if req.Stock >= 0 {
		v.Stock = req.Stock
	}
	if req.Status != "" {
		v.Status = req.Status
	}
	if err := s.repo.UpdateVariant(v); err != nil {
		return nil, err
	}
	return v, nil
}

func (s *productService) DeleteVariant(variantID string) error {
	uid, err := parseUUID(variantID)
	if err != nil {
		return err
	}
	return s.repo.DeleteVariant(uid)
}
