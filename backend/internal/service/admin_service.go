package service

import (
	"errors"
	"time"

	"github.com/dileep0524/cozy-hub-commerce/backend/internal/config"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/dto"
	"github.com/dileep0524/cozy-hub-commerce/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AdminService interface {
	Login(req dto.LoginRequest) (*dto.LoginResponse, error)
}

type adminService struct {
	repo repository.AdminRepository
	cfg  *config.Config
}

func NewAdminService(repo repository.AdminRepository, cfg *config.Config) AdminService {
	return &adminService{repo: repo, cfg: cfg}
}

func (s *adminService) Login(req dto.LoginRequest) (*dto.LoginResponse, error) {
	admin, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	claims := jwt.MapClaims{
		"sub":  admin.ID.String(),
		"role": admin.Role,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
		"iat":  time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return nil, err
	}

	return &dto.LoginResponse{
		Token: signed,
		Admin: dto.AdminInfo{
			ID:       admin.ID,
			Username: admin.Username,
			Email:    admin.Email,
			Role:     admin.Role,
		},
	}, nil
}
