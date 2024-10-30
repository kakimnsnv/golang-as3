package entity

import "github.com/google/uuid"

type Report struct {
	ID        uuid.UUID `json:"id"`
	Title     string    `json:"title"`
	Grade     string    `json:"grade"`
	StudentID string    `json:"student_id"`
}
