package main

import (
	"errors"
	"time"
)

type TaskStatus string

const (
	StatusTodo       TaskStatus = "todo"
	StatusInProgress TaskStatus = "in_progress"
	StatusDone       TaskStatus = "done"
)

var validStatuses = map[TaskStatus]bool{
	StatusTodo:       true,
	StatusInProgress: true,
	StatusDone:       true,
}

type Task struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	Status      TaskStatus `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateTaskRequest struct {
	Title       string `json:"title"`
	Description string `json:"description,omitempty"`
}

type UpdateTaskRequest struct {
	Title       *string     `json:"title,omitempty"`
	Description *string     `json:"description,omitempty"`
	Status      *TaskStatus `json:"status,omitempty"`
}

func (s TaskStatus) IsValid() bool {
	return validStatuses[s]
}

func ValidateCreateTask(req CreateTaskRequest) error {
	if req.Title == "" {
		return errors.New("title is required")
	}
	return nil
}

func ValidateUpdateTask(req UpdateTaskRequest) error {
	if req.Title != nil && *req.Title == "" {
		return errors.New("title cannot be empty")
	}
	if req.Status != nil && !req.Status.IsValid() {
		return errors.New("invalid status")
	}
	return nil
}