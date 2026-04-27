package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		start := time.Now()
		path := ctx.Request.URL.Path
		query := ctx.Request.URL.RawQuery

		ctx.Next()

		latency := time.Since(start)
		status := ctx.Writer.Status()
		clientIP := ctx.ClientIP()
		method := ctx.Request.Method

		if query != "" {
			path = path + "?" + query
		}

		slog.Info("request",
			"method", method,
			"path", path,
			"status", status,
			"latency", latency,
			"ip", clientIP,
			"errors", ctx.Errors.ByType(gin.ErrorTypePrivate).String(),
		)
	}
}
