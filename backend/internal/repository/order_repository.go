package repository

import (
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderRepository interface {
	Create(tx *gorm.DB, o *models.Order) error
	CreateItem(tx *gorm.DB, item *models.OrderItem) error
	FindByID(id uuid.UUID) (*models.Order, error)
	FindBySellerID(sellerID uuid.UUID, page, limit int, status, search string) ([]models.Order, int64, error)
	FindAll(page, limit int, status, search string) ([]models.Order, int64, error)
	ExistsBySellerAndMarketplaceID(sellerID uuid.UUID, mktOrderID string) (bool, error)
	UpdateStatus(id uuid.UUID, status string) error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(tx *gorm.DB, o *models.Order) error {
	return tx.Create(o).Error
}

func (r *orderRepository) CreateItem(tx *gorm.DB, item *models.OrderItem) error {
	return tx.Create(item).Error
}

func (r *orderRepository) FindByID(id uuid.UUID) (*models.Order, error) {
	var order models.Order
	if err := r.db.Preload("Items").Preload("Seller").First(&order, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) FindBySellerID(sellerID uuid.UUID, page, limit int, status, search string) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	query := r.db.Model(&models.Order{}).Where("seller_id = ?", sellerID)
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if search != "" {
		like := "%" + search + "%"
		query = query.Where("marketplace_order_id ILIKE ?", like)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := query.Preload("Items").Order("created_at DESC").Offset(offset).Limit(limit).Find(&orders).Error; err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (r *orderRepository) FindAll(page, limit int, status, search string) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	query := r.db.Model(&models.Order{})
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if search != "" {
		like := "%" + search + "%"
		query = query.Where("marketplace_order_id ILIKE ?", like)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := query.Preload("Items").Preload("Seller").Order("created_at DESC").Offset(offset).Limit(limit).Find(&orders).Error; err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (r *orderRepository) ExistsBySellerAndMarketplaceID(sellerID uuid.UUID, mktOrderID string) (bool, error) {
	var count int64
	err := r.db.Model(&models.Order{}).
		Where("seller_id = ? AND marketplace_order_id = ?", sellerID, mktOrderID).
		Count(&count).Error
	return count > 0, err
}

func (r *orderRepository) UpdateStatus(id uuid.UUID, status string) error {
	return r.db.Model(&models.Order{}).Where("id = ?", id).Update("status", status).Error
}
