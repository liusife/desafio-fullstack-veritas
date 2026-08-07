import { useState } from 'react';
import type { Task, TaskStatus } from '../types/task';
import { STATUS_LABELS } from '../types/task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit({ ...task, title: editTitle.trim(), description: editDescription.trim() || undefined });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
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
    <div className="task-card" style={{ borderLeftColor: statusColors[task.status] }}>
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="Título da tarefa"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descrição (opcional)"
            rows={3}
          />
          <div className="task-edit-actions">
            <button className="btn-save" onClick={handleSave}>Salvar</button>
            <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
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
            <div className="task-move-buttons">
              {task.status !== 'todo' && (
                <button className="btn-move" onClick={() => onMove(task.id, 'todo')} title="Mover para A Fazer">←</button>
              )}
              {task.status !== 'in_progress' && (
                <button className="btn-move" onClick={() => onMove(task.id, 'in_progress')} title="Mover para Em Progresso">↔</button>
              )}
              {task.status !== 'done' && (
                <button className="btn-move" onClick={() => onMove(task.id, 'done')} title="Mover para Concluídas">→</button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}