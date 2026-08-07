package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type TaskHandler struct {
	store TaskStore
}

func NewTaskHandler(store TaskStore) *TaskHandler {
	return &TaskHandler{store: store}
}

func (h *TaskHandler) RegisterRoutes(r chi.Router) {
	r.Get("/tasks", h.GetTasks)
	r.Post("/tasks", h.CreateTask)
	r.Get("/tasks/{id}", h.GetTask)
	r.Put("/tasks/{id}", h.UpdateTask)
	r.Delete("/tasks/{id}", h.DeleteTask)
}

func (h *TaskHandler) GetTasks(w http.ResponseWriter, r *http.Request) {
	tasks := h.store.GetAll()
	writeJSON(w, http.StatusOK, tasks)
}

func (h *TaskHandler) CreateTask(w http.ResponseWriter, r *http.Request) {
	var req CreateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := ValidateCreateTask(req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	task := Task{
		Title:       req.Title,
		Description: req.Description,
		Status:      StatusTodo,
	}

	created := h.store.Create(task)
	writeJSON(w, http.StatusCreated, created)
}

func (h *TaskHandler) GetTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	task, err := h.store.GetByID(id)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, task)
}

func (h *TaskHandler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var req UpdateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := ValidateUpdateTask(req); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	task, err := h.store.Update(id, req)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, task)
}

func (h *TaskHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.store.Delete(id); err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func parseIntParam(r *http.Request, param string, defaultVal int) int {
	val := r.URL.Query().Get(param)
	if val == "" {
		return defaultVal
	}
	parsed, err := strconv.Atoi(val)
	if err != nil {
		return defaultVal
	}
	return parsed
}