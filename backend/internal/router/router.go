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

	// Serve uploaded files
	r.Static("/uploads", cfg.UploadPath)

	// ─── Wire existing dependencies ──────────────────────────────────────────
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

	// ─── Wire OMS dependencies ────────────────────────────────────────────────
	sellerRepo := repository.NewSellerRepository(db)
	productRepo := repository.NewProductRepository(db)
	orderRepo := repository.NewOrderRepository(db)
	walletRepo := repository.NewWalletRepository(db)

	sellerSvc := service.NewSellerService(sellerRepo, walletRepo, cfg)
	productSvc := service.NewProductService(productRepo, cfg)
	orderSvc := service.NewOrderService(orderRepo, productRepo, walletRepo, sellerRepo, db)
	walletSvc := service.NewWalletService(walletRepo, cfg)

	sellerCtrl := controller.NewSellerController(sellerSvc)
	productCtrl := controller.NewProductController(productSvc)
	orderCtrl := controller.NewOrderController(orderSvc)
	walletCtrl := controller.NewWalletController(walletSvc)

	// ─── Health check ─────────────────────────────────────────────────────────
	r.GET("/api/v1/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "ok", "service": "cozyhub-commerce"})
	})

	// ─── Public routes ────────────────────────────────────────────────────────
	public := r.Group("/api/v1")
	public.Use(middleware.RateLimit(100))
	{
		public.POST("/enquiries", enquiryCtrl.Create)
		public.POST("/visitors", visitorCtrl.Track)
		public.GET("/carousel", carouselCtrl.GetActive)
	}

	// ─── Seller auth (public) ─────────────────────────────────────────────────
	r.POST("/api/v1/seller/login", sellerCtrl.Login)

	// ─── Razorpay webhook (public, HMAC-verified inside handler) ─────────────
	r.POST("/api/v1/webhooks/razorpay", walletCtrl.RazorpayWebhook)

	// ─── Protected seller routes ──────────────────────────────────────────────
	seller := r.Group("/api/v1/seller")
	seller.Use(middleware.RequireSellerAuth(cfg))
	{
		seller.GET("/me", sellerCtrl.Me)

		// Products (read-only)
		seller.GET("/products", productCtrl.SellerList)
		seller.GET("/products/:id", productCtrl.GetOne)

		// Orders
		seller.GET("/orders", orderCtrl.List)
		seller.POST("/orders", orderCtrl.Place)
		seller.GET("/orders/:id", orderCtrl.GetOne)
		seller.PATCH("/orders/:id/cancel", orderCtrl.Cancel)

		// Wallet
		seller.GET("/wallet", walletCtrl.GetWallet)
		seller.GET("/wallet/transactions", walletCtrl.GetTransactions)
		seller.POST("/wallet/topup/initiate", walletCtrl.InitiateTopup)
		seller.POST("/wallet/topup/verify", walletCtrl.VerifyTopup)
	}

	// ─── Admin auth ────────────────────────────────────────────────────────────
	r.POST("/api/v1/admin/login", adminCtrl.Login)

	// ─── Protected admin routes ───────────────────────────────────────────────
	admin := r.Group("/api/v1/admin")
	admin.Use(middleware.RequireAuth(cfg))
	{
		// Existing admin routes
		admin.GET("/enquiries", enquiryCtrl.List)
		admin.PATCH("/enquiries/:id", enquiryCtrl.UpdateStatus)
		admin.GET("/analytics", analyticsCtrl.GetAnalytics)
		admin.GET("/carousel", carouselCtrl.GetAll)
		admin.POST("/carousel", carouselCtrl.Create)
		admin.PUT("/carousel/:id", carouselCtrl.Update)
		admin.DELETE("/carousel/:id", carouselCtrl.Delete)

		// Product management
		admin.GET("/products", productCtrl.List)
		admin.POST("/products", productCtrl.Create)
		admin.GET("/products/:id", productCtrl.GetOne)
		admin.PUT("/products/:id", productCtrl.Update)
		admin.DELETE("/products/:id", productCtrl.Delete)
		admin.POST("/products/:id/images", productCtrl.UploadImage)
		admin.DELETE("/products/:id/images/:imageID", productCtrl.DeleteImage)
		admin.POST("/products/:id/variants", productCtrl.AddVariant)
		admin.PUT("/products/:id/variants/:variantID", productCtrl.UpdateVariant)
		admin.DELETE("/products/:id/variants/:variantID", productCtrl.DeleteVariant)

		// Seller management
		admin.GET("/sellers", sellerCtrl.AdminList)
		admin.POST("/sellers", sellerCtrl.AdminCreate)
		admin.GET("/sellers/:id", sellerCtrl.AdminGetOne)
		admin.PATCH("/sellers/:id/status", sellerCtrl.AdminUpdateStatus)

		// Order management
		admin.GET("/orders", orderCtrl.AdminList)
		admin.GET("/orders/:id", orderCtrl.AdminGetOne)
		admin.PATCH("/orders/:id/status", orderCtrl.AdminUpdateStatus)
	}

	return r
}
