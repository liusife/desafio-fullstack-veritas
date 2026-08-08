import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../types/task';
import { STATUS_LABELS } from '../types/task';
import { TaskCard } from './TaskCard';
import './KanbanColumn.css';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanColumn({ status, tasks, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const statusColors: Record<TaskStatus, string> = {
    todo: '#3b82f6',
    in_progress: '#f59e0b',
    done: '#10b981',
  };

  const {
    setNodeRef,
    isOver,
  } = useDroppable({ id: `column-${status}` });

  const columnStyle = {
    backgroundColor: isOver ? `${statusColors[status]}15` : '#f9fafb',
    transition: 'background-color 0.2s',
  };

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={{ ...columnStyle, borderTopColor: statusColors[status] }}
    >
      <div className="column-header">
        <h2 className="column-title" style={{ color: statusColors[status] }}>
          {STATUS_LABELS[status]}
        </h2>
        <span className="column-count" style={{ backgroundColor: statusColors[status] }}>
          {tasks.length}
        </span>
      </div>
      <div className="column-content" role="list" aria-label={`${STATUS_LABELS[status]} tasks`}>
        {tasks.length === 0 ? (
          <div className="column-empty">Arraste tarefas aqui</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}