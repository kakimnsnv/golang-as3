package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/entity"
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/usecase/auth"
)

type AuthHandler struct {
	usecase *auth.AuthUsecase
}

func NewAuthHandler(usecase *auth.AuthUsecase) *AuthHandler {
	return &AuthHandler{usecase: usecase}
}

func (h *AuthHandler) SignUp(c *gin.Context) {
	var user entity.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := h.usecase.SignUp(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, token)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var user entity.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := h.usecase.Login(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, token)
}
