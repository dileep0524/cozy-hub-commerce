package main

import (
	"log"
	"log/slog"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/config"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/database"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/models"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/router"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	// Load .env — ignored in production where env vars are injected directly
	_ = godotenv.Load()

	cfg := config.Load()
	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET is required")
	}

	db := database.Connect(cfg)
	seedDefaultAdmin(db)

	r := router.Setup(db, cfg)
	slog.Info("CozyHub Commerce API started", "port", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func seedDefaultAdmin(db *gorm.DB) {
	adminRepo := repository.NewAdminRepository(db)
	exists, err := adminRepo.ExistsAny()
	if err != nil || exists {
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte("Admin@123"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("warning: failed to hash default admin password: %v", err)
		return
	}

	admin := &models.Admin{
		Username: "admin",
		Email:    "admin@cozyhub.com",
		Password: string(hash),
		Role:     "admin",
	}
	if err := adminRepo.Create(admin); err != nil {
		log.Printf("warning: failed to seed default admin: %v", err)
		return
	}
	slog.Info("default admin seeded", "email", admin.Email)
}
