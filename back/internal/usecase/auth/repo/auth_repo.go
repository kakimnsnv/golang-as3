package repo

import (
	"errors"

	"github.com/golang-jwt/jwt/v4"
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/entity"
)

type AuthRepo struct {
	users map[string]entity.User
}

func NewAuthRepo() *AuthRepo {
	return &AuthRepo{
		users: make(map[string]entity.User),
	}
}

func (r *AuthRepo) SignUp(creds entity.User) (string, error) {
	if _, ok := r.users[creds.Username]; ok {
		return "", errors.New("user already exists")
	}
	r.users[creds.Username] = creds
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"username": creds.Username, "userRole": creds.Role})
	return token.SignedString([]byte("secret"))
}

func (r *AuthRepo) Login(creds entity.User) (string, error) {
	if _, ok := r.users[creds.Username]; !ok {
		return "", errors.New("user not found")
	}
	if r.users[creds.Username].Password != creds.Password {
		return "", errors.New("incorrect password")
	}
	role := r.users[creds.Username].Role
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"username": creds.Username, "userRole": role})
	return token.SignedString([]byte("secret"))
}

func (r *AuthRepo) GetUsers() []string {
	var users []string
	for user, _ := range r.users {
		users = append(users, user)
	}
	return users
}

func (r *AuthRepo) CreateUser(creds entity.User) error {
	if _, ok := r.users[creds.Username]; ok {
		return errors.New("user already exists")
	}
	r.users[creds.Username] = creds
	return nil
}

func (r *AuthRepo) DeleteUser(creds entity.User) error {
	if _, ok := r.users[creds.Username]; !ok {
		return errors.New("user not found")
	}
	if r.users[creds.Username].Password != creds.Password {
		return errors.New("incorrect password")
	}
	delete(r.users, creds.Username)
	return nil
}
