package database

import (
	"log"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/config"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg *config.Config) *gorm.DB {
	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// Enable uuid-ossp extension
	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

	// Auto-migrate all models in dependency order
	if err := db.AutoMigrate(
		// Existing
		&models.Enquiry{},
		&models.Visitor{},
		&models.Admin{},
		&models.CarouselSlide{},
		// OMS — base entities first
		&models.Seller{},
		&models.Product{},
		&models.ProductImage{},
		&models.ProductVariant{},
		// OMS — wallet (referenced by orders)
		&models.Wallet{},
		&models.WalletTransaction{},
		// OMS — orders
		&models.Order{},
		&models.OrderItem{},
	); err != nil {
		log.Fatalf("failed to auto-migrate: %v", err)
	}

	log.Println("database connected and migrated successfully")
	return db
}
