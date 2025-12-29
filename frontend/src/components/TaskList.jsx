import React, { useState } from 'react';

function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask }) {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [deadline, setDeadline] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setDeadline('');
    setEditingTask(null);
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      setDeadline(task.deadline || '');
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      deadline: deadline || null
    };

    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
    }

    handleCloseModal();
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(taskId);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    onUpdateTask(taskId, { status: newStatus });
  };

  // Filter tasks
  let filteredTasks = tasks;
  if (filterStatus !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.status === filterStatus);
  }
  if (filterPriority !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.priority === filterPriority);
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
           Task Management
        </h1>
        <p style={{ color: '#6b7280' }}>Manage and organize your tasks</p>
      </div>

      {/* Filters and Add Button */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#6b7280', marginRight: '0.5rem' }}>
                Status:
              </label>
              <select 
                className="form-select" 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: 'auto', display: 'inline-block' }}
              >
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: '#6b7280', marginRight: '0.5rem' }}>
                Priority:
              </label>
              <select 
                className="form-select" 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                style={{ width: 'auto', display: 'inline-block' }}
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
          <p style={{ color: '#6b7280' }}>
            {tasks.length === 0 ? 'No tasks yet. Create your first task!' : 'No tasks match your filters.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTasks.map(task => (
            <div key={task.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    marginBottom: '0.5rem',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? '#6b7280' : '#111827'
                  }}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority === 'low' ? ' Low' : 
                       task.priority === 'medium' ? ' Medium' : ' High'}
                    </span>
                    <span className={`status-badge status-${task.status}`}>
                      {task.status === 'todo' ? ' To Do' : 
                       task.status === 'inprogress' ? '⚙️ In Progress' : ' Completed'}
                    </span>
                    {task.deadline && (
                      <span style={{
                        fontSize: '0.85rem',
                        color: new Date(task.deadline) < new Date() && task.status !== 'completed' 
                          ? '#ef4444' : '#6b7280'
                      }}>
                         {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleOpenModal(task)}
                    title="Edit"
                  >
                    
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(task.id)}
                    title="Delete"
                  >
                    
                  </button>
                </div>
              </div>

              {/* Quick Status Update */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`btn btn-sm ${task.status === 'todo' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleStatusChange(task.id, 'todo')}
                  disabled={task.status === 'todo'}
                >
                  To Do
                </button>
                <button
                  className={`btn btn-sm ${task.status === 'inprogress' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleStatusChange(task.id, 'inprogress')}
                  disabled={task.status === 'inprogress'}
                >
                  In Progress
                </button>
                <button
                  className={`btn btn-sm ${task.status === 'completed' ? 'btn-success' : 'btn-secondary'}`}
                  onClick={() => handleStatusChange(task.id, 'completed')}
                  disabled={task.status === 'completed'}
                >
                  Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>
              {editingTask ? ' Edit Task' : ' Add New Task'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description (optional)"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;