package middleware

import (
	"time"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORS(cfg *config.Config) gin.HandlerFunc {
	origins := []string{"http://localhost:3000", "http://localhost:3001"}
	if cfg.FrontendURL != "" && cfg.FrontendURL != "http://localhost:3000" {
		origins = append(origins, cfg.FrontendURL)
	}

	return cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}
