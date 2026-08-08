import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../types/task';
import { STATUS_LABELS } from '../types/task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editStatus, setEditStatus] = useState<TaskStatus>(task.status);

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({ id: task.id });

  // Only opacity during drag, NO transform on main card
  const dragStyle = {
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit({ ...task, title: editTitle.trim(), description: editDescription.trim() || undefined, status: editStatus });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditStatus(task.status);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const statusColors: Record<TaskStatus, string> = {
    todo: '#3b82f6',
    in_progress: '#f59e0b',
    done: '#10b981',
  };

  return (
    <div
      ref={setNodeRef}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      style={dragStyle}
    >
      {!isEditing && (
        <div
          className="drag-handle"
          aria-label="Arrastar tarefa"
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </div>
      )}
      <div className="task-content">
        {isEditing ? (
          <div className="task-edit-form">
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="Título da tarefa"
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Descrição (opcional)"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Progresso</option>
                <option value="done">Concluídas</option>
              </select>
            </div>
            <div className="task-edit-actions">
              <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
              <button className="btn-save" onClick={handleSave}>Salvar</button>
            </div>
          </div>
        ) : (
          <>
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-actions">
                <button className="btn-icon" onClick={() => setIsEditing(true)} title="Editar">✏️</button>
                <button className="btn-icon btn-danger" onClick={() => onDelete(task.id)} title="Excluir">🗑️</button>
              </div>
            </div>
            {task.description && <p className="task-description">{task.description}</p>}
            <div className="task-footer">
              <span className="task-status" style={{ backgroundColor: statusColors[task.status] }}>
                {STATUS_LABELS[task.status]}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}