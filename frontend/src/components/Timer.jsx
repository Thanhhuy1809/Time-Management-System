import React, { useState, useEffect, useRef } from 'react';

function Timer({ tasks, onAddTimeLog }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mode, setMode] = useState('work'); // work, break, longBreak
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes
  const [longBreakTime, setLongBreakTime] = useState(15 * 60); // 15 minutes
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedTask && mode === 'work') {
      alert('Please select a task first');
      return;
    }
    
    if (!isRunning) {
      startTimeRef.current = new Date();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (selectedTask && seconds > 0 && mode === 'work') {
      // Save time log
      const duration = Math.floor(seconds / 60); // Convert to minutes
      onAddTimeLog({
        taskId: selectedTask.id,
        startTime: startTimeRef.current.toISOString(),
        endTime: new Date().toISOString(),
        duration
      });
      alert(`Logged ${duration} minutes for "${selectedTask.title}"`);
    }
    
    setIsRunning(false);
    setSeconds(0);
    startTimeRef.current = null;
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    startTimeRef.current = null;
  };

  const startPomodoro = () => {
    setMode('work');
    setSeconds(0);
    setIsRunning(false);
  };

  const startBreak = () => {
    setMode('break');
    setSeconds(0);
    setIsRunning(false);
  };

  const startLongBreak = () => {
    setMode('longBreak');
    setSeconds(0);
    setIsRunning(false);
  };

  // Check if pomodoro time is reached
  useEffect(() => {
    if (mode === 'work' && seconds >= pomodoroTime) {
      handleStop();
      setPomodoroCount(c => c + 1);
      
      if ((pomodoroCount + 1) % 4 === 0) {
        alert(' Great work! Time for a long break!');
        startLongBreak();
      } else {
        alert(' Pomodoro complete! Time for a short break!');
        startBreak();
      }
    } else if (mode === 'break' && seconds >= breakTime) {
      alert('Break over! Ready for another pomodoro?');
      handleReset();
      setMode('work');
    } else if (mode === 'longBreak' && seconds >= longBreakTime) {
      alert('Long break over! Ready to continue?');
      handleReset();
      setMode('work');
    }
  }, [seconds, mode, pomodoroTime, breakTime, longBreakTime, pomodoroCount]);

  const getProgress = () => {
    let total;
    if (mode === 'work') total = pomodoroTime;
    else if (mode === 'break') total = breakTime;
    else total = longBreakTime;
    
    return (seconds / total) * 100;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
           Work Timer
        </h1>
        <p style={{ color: '#6b7280' }}>Track your focus time and take breaks</p>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem' }}>
        {/* Timer Display */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <button
                className={`btn btn-sm ${mode === 'work' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={startPomodoro}
                disabled={isRunning}
              >
                 Work
              </button>
              <button
                className={`btn btn-sm ${mode === 'break' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={startBreak}
                disabled={isRunning}
              >
                 Break
              </button>
              <button
                className={`btn btn-sm ${mode === 'longBreak' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={startLongBreak}
                disabled={isRunning}
              >
                 Long Break
              </button>
            </div>

            <div style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              margin: '0 auto 2rem',
              borderRadius: '50%',
              background: `conic-gradient(
                ${mode === 'work' ? '#6366f1' : mode === 'break' ? '#10b981' : '#f59e0b'} ${getProgress()}%, 
                #e5e7eb ${getProgress()}%
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '3.5rem', fontWeight: '700', color: '#111827' }}>
                  {formatTime(seconds)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  {mode === 'work' ? ' Focus Time' : 
                   mode === 'break' ? 'Short Break' : ' Long Break'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {!isRunning ? (
                <button className="btn btn-success" onClick={handleStart}>
                   Start
                </button>
              ) : (
                <button className="btn btn-warning" onClick={handlePause}>
                   Pause
                </button>
              )}
              <button className="btn btn-danger" onClick={handleStop}>
                 Stop & Save
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                 Reset
              </button>
            </div>

            {pomodoroCount > 0 && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                   {pomodoroCount}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#059669' }}>
                  Pomodoros Completed Today
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Task Selection */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}> Current Task</h3>
            
            {selectedTask ? (
              <div style={{
                padding: '1rem',
                background: '#f0f9ff',
                borderRadius: '8px',
                border: '2px solid #3b82f6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {selectedTask.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      {selectedTask.description}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setSelectedTask(null)}
                    disabled={isRunning}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                No task selected
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Available Tasks</h3>
            
            {tasks.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></p>
                <p>No active tasks available</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                {tasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '0.75rem',
                      border: `2px solid ${selectedTask?.id === task.id ? '#6366f1' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      background: selectedTask?.id === task.id ? '#f0f9ff' : 'white',
                      opacity: isRunning && selectedTask?.id !== task.id ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                    onClick={() => !isRunning && setSelectedTask(task)}
                  >
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                      {task.title}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {task.status === 'todo' ? ' To Do' : ' In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}> Timer Settings</h3>
        <div className="grid grid-3">
          <div className="form-group">
            <label className="form-label">Work Duration (minutes)</label>
            <input
              type="number"
              className="form-input"
              value={pomodoroTime / 60}
              onChange={(e) => setPomodoroTime(Number(e.target.value) * 60)}
              min="1"
              max="60"
              disabled={isRunning}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Short Break (minutes)</label>
            <input
              type="number"
              className="form-input"
              value={breakTime / 60}
              onChange={(e) => setBreakTime(Number(e.target.value) * 60)}
              min="1"
              max="30"
              disabled={isRunning}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Long Break (minutes)</label>
            <input
              type="number"
              className="form-input"
              value={longBreakTime / 60}
              onChange={(e) => setLongBreakTime(Number(e.target.value) * 60)}
              min="1"
              max="60"
              disabled={isRunning}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timer;