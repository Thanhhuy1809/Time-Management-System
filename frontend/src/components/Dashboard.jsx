import React from 'react';

function Dashboard({ tasks, timeLogs, onNavigate }) {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  // Calculate total time (in minutes)
  const totalMinutes = timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Today's tasks
  const today = new Date().toDateString();
  const todayTasks = tasks.filter(t => {
    if (!t.deadline) return false;
    return new Date(t.deadline).toDateString() === today;
  });

  // Overdue tasks
  const overdueTasks = tasks.filter(t => {
    if (!t.deadline || t.status === 'completed') return false;
    return new Date(t.deadline) < new Date();
  });

  // High priority tasks
  const highPriorityTasks = tasks.filter(t => 
    t.priority === 'high' && t.status !== 'completed'
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Welcome back! 
        </h1>
        <p style={{ color: '#6b7280' }}>Here's your productivity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {totalTasks}
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Total Tasks</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {completedTasks}
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Completed</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {inProgressTasks}
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>In Progress</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {totalHours}h {remainingMinutes}m
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Total Time</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#6366f1' }}>📝 Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('tasks')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Create New Task
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onNavigate('timer')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Start Timer
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#f59e0b' }}> Due Today</h3>
          {todayTasks.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No tasks due today</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {todayTasks.slice(0, 3).map(task => (
                <div key={task.id} style={{
                  padding: '0.5rem',
                  background: '#fef3c7',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}>
                  {task.title}
                </div>
              ))}
              {todayTasks.length > 3 && (
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => onNavigate('tasks')}
                >
                  +{todayTasks.length - 3} more
                </button>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}> High Priority</h3>
          {highPriorityTasks.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No high priority tasks</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {highPriorityTasks.slice(0, 3).map(task => (
                <div key={task.id} style={{
                  padding: '0.5rem',
                  background: '#fee2e2',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}>
                  {task.title}
                </div>
              ))}
              {highPriorityTasks.length > 3 && (
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => onNavigate('tasks')}
                >
                  +{highPriorityTasks.length - 3} more
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {overdueTasks.length > 0 && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}></span>
            <strong style={{ color: '#991b1b' }}>
              You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
            </strong>
          </div>
          <p style={{ color: '#7f1d1d', fontSize: '0.9rem' }}>
            Please review and update your tasks
          </p>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Tasks</h3>
          <button 
            className="btn btn-sm btn-secondary"
            onClick={() => onNavigate('tasks')}
          >
            View All
          </button>
        </div>
        
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}></p>
            <p>No tasks yet. Create your first task to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    {task.description && task.description.substring(0, 50)}
                    {task.description && task.description.length > 50 && '...'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`priority-badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                  <span className={`status-badge status-${task.status}`}>
                    {task.status === 'todo' ? 'To Do' : 
                     task.status === 'inprogress' ? 'In Progress' : 'Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;