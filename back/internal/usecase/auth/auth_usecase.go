package auth

import (
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/entity"
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/usecase/auth/repo"
)

type AuthUsecase struct {
	repo *repo.AuthRepo
}

func NewAuthUsecase(repo *repo.AuthRepo) *AuthUsecase {
	return &AuthUsecase{
		repo: repo,
	}
}

func (u *AuthUsecase) GetUsers() []string {
	return u.repo.GetUsers()
}

func (u *AuthUsecase) CreateUser(creds entity.User) error {
	return u.repo.CreateUser(creds)
}

func (u *AuthUsecase) DeleteUser(creds entity.User) error {
	return u.repo.DeleteUser(creds)
}

func (u *AuthUsecase) Login(creds entity.User) (string, error) {
	return u.repo.Login(creds)
}

func (u *AuthUsecase) SignUp(creds entity.User) (string, error) {
	return u.repo.SignUp(creds)
}
