import { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { Modal } from './Modal';
import { TaskForm } from './TaskForm';
import { useTasks } from '../hooks/useTasks';
import type { Task, TaskStatus } from '../types/task';
import { STATUS_ORDER } from '../types/task';
import './KanbanBoard.css';

export function KanbanBoard() {
  const {
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitForm = async (data: { title: string; description?: string; status: TaskStatus }) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(data);
      }
      handleCloseModal();
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTask(id);
    }
  };

  const handleMoveTask = async (id: string, status: TaskStatus) => {
    await moveTask(id, status);
  };

  if (loading) {
    return (
      <div className="kanban-loading">
        <div className="spinner"></div>
        <p>Carregando tarefas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kanban-error">
        <p>Erro ao carregar tarefas: {error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="kanban-board">
      <header className="kanban-header">
        <h1>Mini Kanban</h1>
        <button className="btn-add-task" onClick={handleOpenCreateModal}>
          + Nova Tarefa
        </button>
      </header>

      <div className="kanban-columns" role="region" aria-label="Quadro Kanban">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        size="md"
      >
        <TaskForm
          initialData={editingTask ? { title: editingTask.title, description: editingTask.description, status: editingTask.status } : undefined}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseModal}
          submitLabel={editingTask ? 'Atualizar' : 'Criar'}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}