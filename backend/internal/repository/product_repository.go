package repository

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProductRepository interface {
	Create(p *models.Product) error
	FindAll(page, limit int, category, search string, activeOnly bool) ([]models.Product, int64, error)
	FindByID(id uuid.UUID) (*models.Product, error)
	FindBySKU(sku string) (*models.Product, error)
	Update(p *models.Product) error
	Delete(id uuid.UUID) error

	AddImage(img *models.ProductImage) error
	DeleteImage(id uuid.UUID) error

	AddVariant(v *models.ProductVariant) error
	FindVariantByID(id uuid.UUID) (*models.ProductVariant, error)
	UpdateVariant(v *models.ProductVariant) error
	DeleteVariant(id uuid.UUID) error

	DeductStock(productID uuid.UUID, variantID *uuid.UUID, qty int) error
	RestoreStock(tx *gorm.DB, productID uuid.UUID, variantID *uuid.UUID, qty int) error
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) Create(p *models.Product) error {
	return r.db.Create(p).Error
}

func (r *productRepository) FindAll(page, limit int, category, search string, activeOnly bool) ([]models.Product, int64, error) {
	var products []models.Product
	var total int64

	query := r.db.Model(&models.Product{})
	if activeOnly {
		query = query.Where("is_active = true")
	}
	if category != "" {
		query = query.Where("category = ?", category)
	}
	if search != "" {
		like := "%" + search + "%"
		query = query.Where("name ILIKE ? OR sku ILIKE ?", like, like)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := query.Preload("Images").Preload("Variants").Order("created_at DESC").Offset(offset).Limit(limit).Find(&products).Error; err != nil {
		return nil, 0, err
	}

	return products, total, nil
}

func (r *productRepository) FindByID(id uuid.UUID) (*models.Product, error) {
	var product models.Product
	if err := r.db.Preload("Images").Preload("Variants").First(&product, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) FindBySKU(sku string) (*models.Product, error) {
	var product models.Product
	if err := r.db.Where("sku = ?", sku).First(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) Update(p *models.Product) error {
	return r.db.Save(p).Error
}

func (r *productRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Product{}, "id = ?", id).Error
}

func (r *productRepository) AddImage(img *models.ProductImage) error {
	return r.db.Create(img).Error
}

func (r *productRepository) DeleteImage(id uuid.UUID) error {
	return r.db.Delete(&models.ProductImage{}, "id = ?", id).Error
}

func (r *productRepository) AddVariant(v *models.ProductVariant) error {
	return r.db.Create(v).Error
}

func (r *productRepository) FindVariantByID(id uuid.UUID) (*models.ProductVariant, error) {
	var v models.ProductVariant
	if err := r.db.First(&v, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *productRepository) UpdateVariant(v *models.ProductVariant) error {
	return r.db.Save(v).Error
}

func (r *productRepository) DeleteVariant(id uuid.UUID) error {
	return r.db.Delete(&models.ProductVariant{}, "id = ?", id).Error
}

func (r *productRepository) DeductStock(productID uuid.UUID, variantID *uuid.UUID, qty int) error {
	if variantID != nil {
		return r.db.Model(&models.ProductVariant{}).
			Where("id = ? AND stock >= ?", variantID, qty).
			UpdateColumn("stock", gorm.Expr("stock - ?", qty)).Error
	}
	return r.db.Model(&models.Product{}).
		Where("id = ? AND stock >= ?", productID, qty).
		UpdateColumn("stock", gorm.Expr("stock - ?", qty)).Error
}

func (r *productRepository) RestoreStock(tx *gorm.DB, productID uuid.UUID, variantID *uuid.UUID, qty int) error {
	if variantID != nil {
		return tx.Model(&models.ProductVariant{}).
			Where("id = ?", variantID).
			UpdateColumn("stock", gorm.Expr("stock + ?", qty)).Error
	}
	return tx.Model(&models.Product{}).
		Where("id = ?", productID).
		UpdateColumn("stock", gorm.Expr("stock + ?", qty)).Error
}
