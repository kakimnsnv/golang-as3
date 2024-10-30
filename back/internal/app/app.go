package app

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/handlers"
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/handlers/middleware"
	authUsecase "github.com/kakimnsnv/golang-kbtu/assingments/3/internal/usecase/auth"
	authRepo "github.com/kakimnsnv/golang-kbtu/assingments/3/internal/usecase/auth/repo"
	reportUsecase "github.com/kakimnsnv/golang-kbtu/assingments/3/internal/usecase/report"
	reportRepo "github.com/kakimnsnv/golang-kbtu/assingments/3/internal/usecase/report/repo"
	"go.uber.org/fx"
)

func NewRouter(handler *handlers.ReportHandler, authHandler *handlers.AuthHandler) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	r.POST("/signup", authHandler.SignUp)
	r.POST("/login", authHandler.Login)

	r.POST("/reports", middleware.RoleBasedAuth("admin"), handler.CreateReport)
	r.GET("/reports/:id", middleware.RoleBasedAuth("admin", "user"), handler.GetReport)
	r.GET("/reports", middleware.RoleBasedAuth("admin", "user"), handler.GetAllReports)
	r.PUT("/reports/:id", middleware.RoleBasedAuth("admin"), handler.UpdateReport)
	r.DELETE("/reports/:id", middleware.RoleBasedAuth("admin"), handler.DeleteReport)

	return r
}

func RegisterApp() *fx.App {
	return fx.New(
		fx.Provide(
			reportRepo.NewReportRepo,
			authRepo.NewAuthRepo,
			reportUsecase.NewReportUsecase,
			authUsecase.NewAuthUsecase,
			handlers.NewReportHandler,
			handlers.NewAuthHandler,
			NewRouter,
		),
		fx.Invoke(
			func(router *gin.Engine) {
				router.Run(":8080")
			},
		),
	)
}
