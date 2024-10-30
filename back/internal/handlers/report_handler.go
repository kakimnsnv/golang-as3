package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/entity"
	usecase "github.com/kakimnsnv/golang-kbtu/assingments/3/internal/usecase/report"
)

type ReportHandler struct {
	usecase *usecase.ReportUsecase
}

func NewReportHandler(usecase *usecase.ReportUsecase) *ReportHandler {
	return &ReportHandler{usecase: usecase}
}

func (h *ReportHandler) CreateReport(c *gin.Context) {
	var report entity.Report
	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdReport, err := h.usecase.CreateReport(report)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdReport)
}

func (h *ReportHandler) GetReport(c *gin.Context) {
	id := c.Param("id")

	report, found := h.usecase.GetReport(id)
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "report not found"})
		return
	}

	c.JSON(http.StatusOK, report)
}

func (h *ReportHandler) GetAllReports(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) { return []byte("secret"), nil })
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	role := token.Claims.(jwt.MapClaims)["userRole"].(string)
	username := token.Claims.(jwt.MapClaims)["username"].(string)
	if role == "admin" {
		reports := h.usecase.GetAllReports()
		c.JSON(http.StatusOK, reports)
		return
	}
	reports := h.usecase.GetReportsByUsername(username)
	c.JSON(http.StatusOK, reports)
}

func (h *ReportHandler) UpdateReport(c *gin.Context) {
	var report entity.Report
	if err := c.ShouldBindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedReport, err := h.usecase.UpdateReport(report)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedReport)
}

func (h *ReportHandler) DeleteReport(c *gin.Context) {
	id := c.Param("id")
	deleted := h.usecase.DeleteReport(id)
	if !deleted {
		c.JSON(http.StatusNotFound, gin.H{"error": "report not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "report deleted"})
}
