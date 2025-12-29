// Viết giao diện chính 
// Viết logic chính 
// quản lí trạng thaí 
// gọi các component khác
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import Timer from './components/Timer';
import Statistics from './components/Statistics';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [tasks, setTasks] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);

  useEffect(() => {
    // Kiểm tra token khi load app
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setCurrentView('dashboard');
      loadUserData(JSON.parse(user).id);
    }
  }, []);

  const loadUserData = (userId) => {
    // Load tasks
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const userTasks = allTasks.filter(t => t.userId === userId);
    setTasks(userTasks);

    // Load time logs
    const allLogs = JSON.parse(localStorage.getItem('timeLogs') || '[]');
    const userLogs = allLogs.filter(l => {
      const task = userTasks.find(t => t.id === l.taskId);
      return task !== undefined;
    });
    setTimeLogs(userLogs);
  };

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentView('dashboard');
    loadUserData(user.id);
  };

  const handleRegister = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setCurrentView('login');
    setTasks([]);
    setTimeLogs([]);
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    allTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId, updates) => {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const index = allTasks.findIndex(t => t.id === taskId);
    
    if (index !== -1) {
      allTasks[index] = { ...allTasks[index], ...updates };
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      setTasks(tasks.map(t => t.id === taskId ? allTasks[index] : t));
    }
  };

  const deleteTask = (taskId) => {
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const filtered = allTasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(filtered));
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const addTimeLog = (log) => {
    const newLog = {
      ...log,
      id: Date.now().toString()
    };
    
    const allLogs = JSON.parse(localStorage.getItem('timeLogs') || '[]');
    allLogs.push(newLog);
    localStorage.setItem('timeLogs', JSON.stringify(allLogs));
    setTimeLogs([...timeLogs, newLog]);
  };

  if (!currentUser) {
    return (
      <div className="app">
        {currentView === 'login' ? (
          <Login 
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        ) : (
          <Register 
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <h2> TaskFlow</h2>
        </div>
        <div className="nav-menu">
          <button 
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
             Dashboard
          </button>
          <button 
            className={currentView === 'tasks' ? 'active' : ''}
            onClick={() => setCurrentView('tasks')}
          >
             Tasks
          </button>
          <button 
            className={currentView === 'timer' ? 'active' : ''}
            onClick={() => setCurrentView('timer')}
          >
             Timer
          </button>
          <button 
            className={currentView === 'statistics' ? 'active' : ''}
            onClick={() => setCurrentView('statistics')}
          >
             Statistics
          </button>
        </div>
        <div className="nav-user">
          <span> {currentUser.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard 
            tasks={tasks}
            timeLogs={timeLogs}
            onNavigate={setCurrentView}
          />
        )}
        {currentView === 'tasks' && (
          <TaskList 
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        )}
        {currentView === 'timer' && (
          <Timer 
            tasks={tasks.filter(t => t.status !== 'completed')}
            onAddTimeLog={addTimeLog}
          />
        )}
        {currentView === 'statistics' && (
          <Statistics 
            tasks={tasks}
            timeLogs={timeLogs}
          />
        )}
      </main>
    </div>
  );
}

export default App;