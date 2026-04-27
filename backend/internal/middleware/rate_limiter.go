package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type ipEntry struct {
	count    int
	resetAt  time.Time
}

type rateLimiter struct {
	mu      sync.Mutex
	entries map[string]*ipEntry
	limit   int
	window  time.Duration
}

func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	rl := &rateLimiter{
		entries: make(map[string]*ipEntry),
		limit:   limit,
		window:  window,
	}
	go rl.cleanup()
	return rl
}

func (rl *rateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	entry, exists := rl.entries[ip]
	if !exists || now.After(entry.resetAt) {
		rl.entries[ip] = &ipEntry{count: 1, resetAt: now.Add(rl.window)}
		return true
	}
	if entry.count >= rl.limit {
		return false
	}
	entry.count++
	return true
}

func (rl *rateLimiter) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	for range ticker.C {
		rl.mu.Lock()
		now := time.Now()
		for ip, entry := range rl.entries {
			if now.After(entry.resetAt) {
				delete(rl.entries, ip)
			}
		}
		rl.mu.Unlock()
	}
}

// RateLimit returns a middleware that limits to `limit` requests per minute per IP.
func RateLimit(limit int) gin.HandlerFunc {
	rl := newRateLimiter(limit, time.Minute)
	return func(ctx *gin.Context) {
		ip := ctx.ClientIP()
		if !rl.allow(ip) {
			ctx.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "too many requests, please try again later",
			})
			return
		}
		ctx.Next()
	}
}
