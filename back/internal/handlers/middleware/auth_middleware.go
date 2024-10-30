package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func RoleBasedAuth(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := jwt.Parse(c.GetHeader("Authorization"), func(t *jwt.Token) (interface{}, error) {
			return []byte("secret"), nil
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Authorization header is incorrect"})
			c.Abort()
			return
		}
		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		userRole := token.Claims.(jwt.MapClaims)["userRole"].(string)
		for _, role := range roles {
			if role == userRole {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		c.Abort()
	}
}
