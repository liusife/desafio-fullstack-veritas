package main

import (
	"encoding/json"
	"errors"
	"os"
	"sync"
	"time"

	"github.com/google/uuid"
)

var (
	ErrTaskNotFound = errors.New("task not found")
)

type TaskStore interface {
	GetAll() []Task
	GetByID(id string) (Task, error)
	Create(task Task) Task
	Update(id string, req UpdateTaskRequest) (Task, error)
	Delete(id string) error
}

type MemoryStore struct {
	tasks    map[string]Task
	mutex    sync.RWMutex
	filePath string
}

func NewMemoryStore(filePath string) *MemoryStore {
	store := &MemoryStore{
		tasks:    make(map[string]Task),
		filePath: filePath,
	}
	if filePath != "" {
		store.loadFromFile()
	}
	return store
}

func (s *MemoryStore) GetAll() []Task {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	tasks := make([]Task, 0, len(s.tasks))
	for _, task := range s.tasks {
		tasks = append(tasks, task)
	}
	return tasks
}

func (s *MemoryStore) GetByID(id string) (Task, error) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	task, exists := s.tasks[id]
	if !exists {
		return Task{}, ErrTaskNotFound
	}
	return task, nil
}

func (s *MemoryStore) Create(task Task) Task {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	now := time.Now()
	task.ID = uuid.New().String()
	task.CreatedAt = now
	task.UpdatedAt = now

	s.tasks[task.ID] = task
	s.persistToFile()
	return task
}

func (s *MemoryStore) Update(id string, req UpdateTaskRequest) (Task, error) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	task, exists := s.tasks[id]
	if !exists {
		return Task{}, ErrTaskNotFound
	}

	if req.Title != nil {
		task.Title = *req.Title
	}
	if req.Description != nil {
		task.Description = *req.Description
	}
	if req.Status != nil {
		task.Status = *req.Status
	}

	task.UpdatedAt = time.Now()
	s.tasks[id] = task
	s.persistToFile()
	return task, nil
}

func (s *MemoryStore) Delete(id string) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if _, exists := s.tasks[id]; !exists {
		return ErrTaskNotFound
	}

	delete(s.tasks, id)
	s.persistToFile()
	return nil
}

func (s *MemoryStore) persistToFile() {
	if s.filePath == "" {
		return
	}

	tasks := make([]Task, 0, len(s.tasks))
	for _, task := range s.tasks {
		tasks = append(tasks, task)
	}

	data, err := json.MarshalIndent(tasks, "", "  ")
	if err != nil {
		return
	}

	os.WriteFile(s.filePath, data, 0644)
}

func (s *MemoryStore) loadFromFile() {
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return
	}

	var tasks []Task
	if err := json.Unmarshal(data, &tasks); err != nil {
		return
	}

	for _, task := range tasks {
		s.tasks[task.ID] = task
	}
}