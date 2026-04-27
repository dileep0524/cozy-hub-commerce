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

	// Auto-migrate all models
	if err := db.AutoMigrate(
		&models.Enquiry{},
		&models.Visitor{},
		&models.Admin{},
		&models.Product{},
		&models.CarouselSlide{},
	); err != nil {
		log.Fatalf("failed to auto-migrate: %v", err)
	}

	log.Println("database connected and migrated successfully")
	return db
}
