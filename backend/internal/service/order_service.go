package service

import (
	"errors"
	"time"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderService interface {
	PlaceOrder(sellerID string, req dto.PlaceOrderRequest) (*models.Order, error)
	GetOrder(id string, sellerID string) (*models.Order, error)
	ListSellerOrders(sellerID string, page, limit int, status, search string) ([]models.Order, int64, error)
	CancelOrder(id string, sellerID string) error
	AdminListOrders(page, limit int, status, search string) ([]models.Order, int64, error)
	AdminGetOrder(id string) (*models.Order, error)
	AdminUpdateStatus(id, status string) error
}

type orderService struct {
	orderRepo   repository.OrderRepository
	productRepo repository.ProductRepository
	walletRepo  repository.WalletRepository
	sellerRepo  repository.SellerRepository
	db          *gorm.DB
}

func NewOrderService(
	orderRepo repository.OrderRepository,
	productRepo repository.ProductRepository,
	walletRepo repository.WalletRepository,
	sellerRepo repository.SellerRepository,
	db *gorm.DB,
) OrderService {
	return &orderService{
		orderRepo:   orderRepo,
		productRepo: productRepo,
		walletRepo:  walletRepo,
		sellerRepo:  sellerRepo,
		db:          db,
	}
}

func (s *orderService) PlaceOrder(sellerID string, req dto.PlaceOrderRequest) (*models.Order, error) {
	sUID, err := parseUUID(sellerID)
	if err != nil {
		return nil, err
	}

	// Duplicate marketplace order ID check
	exists, err := s.orderRepo.ExistsBySellerAndMarketplaceID(sUID, req.MarketplaceOrderID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("marketplace order ID already placed")
	}

	// Ship-by date must be today or future
	if req.ShipByDate.Before(time.Now().Truncate(24 * time.Hour)) {
		return nil, errors.New("ship-by date cannot be in the past")
	}

	// Load product
	product, err := s.productRepo.FindByID(req.ProductID)
	if err != nil {
		return nil, errors.New("product not found")
	}
	if !product.IsActive {
		return nil, errors.New("product is not available")
	}

	// Determine price and stock source (variant or base product)
	unitPrice := product.Price
	shippingCharge := product.ShippingCharge
	sku := product.SKU
	productName := product.Name
	availableStock := product.Stock

	if req.VariantID != nil {
		variant, err := s.productRepo.FindVariantByID(*req.VariantID)
		if err != nil {
			return nil, errors.New("variant not found")
		}
		if variant.ProductID != req.ProductID {
			return nil, errors.New("variant does not belong to this product")
		}
		if variant.Status != "active" {
			return nil, errors.New("variant is not available")
		}
		unitPrice = variant.Price
		sku = variant.SKU
		productName = product.Name + " - " + variant.Name
		availableStock = variant.Stock
	}

	// Stock validation
	if availableStock < req.Quantity {
		return nil, errors.New("insufficient stock")
	}

	// Wallet validation
	totalCost := (unitPrice * float64(req.Quantity)) + shippingCharge
	wallet, err := s.walletRepo.FindBySellerID(sUID)
	if err != nil {
		return nil, errors.New("wallet not found")
	}
	if wallet.Balance < totalCost {
		return nil, errors.New("insufficient wallet balance")
	}

	// Atomic transaction: deduct stock + wallet + create order
	var createdOrder *models.Order
	txErr := s.db.Transaction(func(tx *gorm.DB) error {
		// Deduct stock
		if err := s.productRepo.DeductStock(req.ProductID, req.VariantID, req.Quantity); err != nil {
			return errors.New("stock deduction failed")
		}

		// Debit wallet
		balanceAfter, err := s.walletRepo.Debit(tx, wallet.ID, totalCost)
		if err != nil {
			return errors.New("wallet debit failed — insufficient balance")
		}

		// Create order
		orderID := uuid.New()
		order := &models.Order{
			ID:                 orderID,
			SellerID:           sUID,
			MarketplaceOrderID: req.MarketplaceOrderID,
			ShipByDate:         req.ShipByDate,
			Status:             "pending",
			TotalAmount:        totalCost,
			ShippingCharge:     shippingCharge,
			WalletDeducted:     totalCost,
			Notes:              req.Notes,
		}
		if err := s.orderRepo.Create(tx, order); err != nil {
			return err
		}

		// Create order item
		item := &models.OrderItem{
			OrderID:        orderID,
			ProductID:      req.ProductID,
			VariantID:      req.VariantID,
			SKU:            sku,
			ProductName:    productName,
			Quantity:       req.Quantity,
			UnitPrice:      unitPrice,
			ShippingCharge: shippingCharge,
			TotalPrice:     totalCost,
		}
		if err := s.orderRepo.CreateItem(tx, item); err != nil {
			return err
		}

		// Record wallet transaction
		txn := &models.WalletTransaction{
			WalletID:      wallet.ID,
			SellerID:      sUID,
			Type:          "debit",
			Amount:        totalCost,
			BalanceAfter:  balanceAfter,
			ReferenceType: "order",
			ReferenceID:   orderID.String(),
			Description:   "Order placed: " + req.MarketplaceOrderID,
		}
		if err := s.walletRepo.CreateTransaction(tx, txn); err != nil {
			return err
		}

		createdOrder = order
		return nil
	})

	if txErr != nil {
		return nil, txErr
	}

	return s.orderRepo.FindByID(createdOrder.ID)
}

func (s *orderService) GetOrder(id string, sellerID string) (*models.Order, error) {
	uid, err := parseUUID(id)
	if err != nil {
		return nil, err
	}
	order, err := s.orderRepo.FindByID(uid)
	if err != nil {
		return nil, errors.New("order not found")
	}
	sUID, _ := parseUUID(sellerID)
	if order.SellerID != sUID {
		return nil, errors.New("access denied")
	}
	return order, nil
}

func (s *orderService) ListSellerOrders(sellerID string, page, limit int, status, search string) ([]models.Order, int64, error) {
	uid, err := parseUUID(sellerID)
	if err != nil {
		return nil, 0, err
	}
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	return s.orderRepo.FindBySellerID(uid, page, limit, status, search)
}

func (s *orderService) CancelOrder(id string, sellerID string) error {
	order, err := s.GetOrder(id, sellerID)
	if err != nil {
		return err
	}
	if order.Status != "pending" {
		return errors.New("order can only be cancelled when it is pending")
	}

	sUID, _ := parseUUID(sellerID)
	wallet, err := s.walletRepo.FindBySellerID(sUID)
	if err != nil {
		return err
	}

	return s.db.Transaction(func(tx *gorm.DB) error {
		if err := s.orderRepo.UpdateStatus(order.ID, "cancelled"); err != nil {
			return err
		}
		// Restore stock for each item
		for _, item := range order.Items {
			if err := s.productRepo.RestoreStock(tx, item.ProductID, item.VariantID, item.Quantity); err != nil {
				return err
			}
		}
		// Refund wallet
		balanceAfter, err := s.walletRepo.Credit(tx, wallet.ID, order.WalletDeducted)
		if err != nil {
			return err
		}
		txn := &models.WalletTransaction{
			WalletID:      wallet.ID,
			SellerID:      sUID,
			Type:          "refund",
			Amount:        order.WalletDeducted,
			BalanceAfter:  balanceAfter,
			ReferenceType: "order",
			ReferenceID:   order.ID.String(),
			Description:   "Order cancelled: " + order.MarketplaceOrderID,
		}
		return s.walletRepo.CreateTransaction(tx, txn)
	})
}

func (s *orderService) AdminListOrders(page, limit int, status, search string) ([]models.Order, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	return s.orderRepo.FindAll(page, limit, status, search)
}

func (s *orderService) AdminGetOrder(id string) (*models.Order, error) {
	uid, err := parseUUID(id)
	if err != nil {
		return nil, err
	}
	return s.orderRepo.FindByID(uid)
}

func (s *orderService) AdminUpdateStatus(id, status string) error {
	uid, err := parseUUID(id)
	if err != nil {
		return err
	}
	return s.orderRepo.UpdateStatus(uid, status)
}
