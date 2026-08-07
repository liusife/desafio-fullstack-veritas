import type { Task, TaskStatus } from '../types/task';
import { STATUS_LABELS } from '../types/task';
import { TaskCard } from './TaskCard';
import './KanbanColumn.css';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, status: TaskStatus) => void;
}

export function KanbanColumn({ status, tasks, onEditTask, onDeleteTask, onMoveTask }: KanbanColumnProps) {
  const statusColors: Record<TaskStatus, string> = {
    todo: '#3b82f6',
    in_progress: '#f59e0b',
    done: '#10b981',
  };

  return (
    <div className="kanban-column" style={{ borderTopColor: statusColors[status] }}>
      <div className="column-header">
        <h2 className="column-title" style={{ color: statusColors[status] }}>
          {STATUS_LABELS[status]}
        </h2>
        <span className="column-count" style={{ backgroundColor: statusColors[status] }}>{tasks.length}</span>
      </div>
      <div className="column-content" role="list" aria-label={`${STATUS_LABELS[status]} tasks`}>
        {tasks.length === 0 ? (
          <div className="column-empty">Nenhuma tarefa</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))
        )}
      </div>
    </div>
  );
}