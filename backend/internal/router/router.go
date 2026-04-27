package router

import (
	"net/http"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/config"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/controller"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/middleware"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(db *gorm.DB, cfg *config.Config) *gin.Engine {
	r := gin.New()

	// Global middleware
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS(cfg))

	// Wire up dependencies
	enquiryRepo := repository.NewEnquiryRepository(db)
	visitorRepo := repository.NewVisitorRepository(db)
	adminRepo := repository.NewAdminRepository(db)
	carouselRepo := repository.NewCarouselRepository(db)

	enquirySvc := service.NewEnquiryService(enquiryRepo)
	visitorSvc := service.NewVisitorService(visitorRepo)
	adminSvc := service.NewAdminService(adminRepo, cfg)
	analyticsSvc := service.NewAnalyticsService(visitorRepo, enquiryRepo)
	carouselSvc := service.NewCarouselService(carouselRepo)

	enquiryCtrl := controller.NewEnquiryController(enquirySvc)
	visitorCtrl := controller.NewVisitorController(visitorSvc)
	adminCtrl := controller.NewAdminController(adminSvc)
	analyticsCtrl := controller.NewAnalyticsController(analyticsSvc)
	carouselCtrl := controller.NewCarouselController(carouselSvc)

	// Health check
	r.GET("/api/v1/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "ok", "service": "cozyhub-commerce"})
	})

	// Public routes with rate limiting
	public := r.Group("/api/v1")
	public.Use(middleware.RateLimit(100))
	{
		public.POST("/enquiries", enquiryCtrl.Create)
		public.POST("/visitors", visitorCtrl.Track)
		public.GET("/carousel", carouselCtrl.GetActive)
	}

	// Admin auth (no JWT required — issues the token)
	r.POST("/api/v1/admin/login", adminCtrl.Login)

	// Protected admin routes
	admin := r.Group("/api/v1/admin")
	admin.Use(middleware.RequireAuth(cfg))
	{
		admin.GET("/enquiries", enquiryCtrl.List)
		admin.PATCH("/enquiries/:id", enquiryCtrl.UpdateStatus)
		admin.GET("/analytics", analyticsCtrl.GetAnalytics)

		admin.GET("/carousel", carouselCtrl.GetAll)
		admin.POST("/carousel", carouselCtrl.Create)
		admin.PUT("/carousel/:id", carouselCtrl.Update)
		admin.DELETE("/carousel/:id", carouselCtrl.Delete)
	}

	return r
}
