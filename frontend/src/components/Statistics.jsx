import React, { useState, useMemo } from 'react';

function Statistics({ tasks, timeLogs }) {
  const [period, setPeriod] = useState('week'); // day, week, month

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    let startDate;

    if (period === 'day') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Filter time logs for the period
    const periodLogs = timeLogs.filter(log => 
      new Date(log.startTime) >= startDate
    );

    // Total time
    const totalMinutes = periodLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    // Tasks by status
    const periodTasks = tasks.filter(task => 
      new Date(task.createdAt) >= startDate
    );
    
    const completedTasks = periodTasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = periodTasks.filter(t => t.status === 'inprogress').length;
    const todoTasks = periodTasks.filter(t => t.status === 'todo').length;

    // Time by task
    const timeByTask = {};
    periodLogs.forEach(log => {
      const task = tasks.find(t => t.id === log.taskId);
      if (task) {
        timeByTask[task.id] = (timeByTask[task.id] || 0) + log.duration;
      }
    });

    const topTasks = Object.entries(timeByTask)
      .map(([taskId, minutes]) => ({
        task: tasks.find(t => t.id === taskId),
        minutes
      }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);

    // Daily breakdown
    const dailyData = {};
    periodLogs.forEach(log => {
      const date = new Date(log.startTime).toLocaleDateString();
      dailyData[date] = (dailyData[date] || 0) + log.duration;
    });

    // Productivity score (0-100)
    const completionRate = periodTasks.length > 0 
      ? Math.round((completedTasks / periodTasks.length) * 100) 
      : 0;
    
    const avgTimePerDay = Object.keys(dailyData).length > 0 
      ? totalMinutes / Object.keys(dailyData).length 
      : 0;

    let productivityScore = 0;
    if (completionRate > 0) productivityScore += completionRate * 0.5;
    if (avgTimePerDay >= 120) productivityScore += 50; // 2+ hours/day is good
    else productivityScore += (avgTimePerDay / 120) * 50;

    return {
      totalHours,
      remainingMinutes,
      totalMinutes,
      completedTasks,
      inProgressTasks,
      todoTasks,
      topTasks,
      dailyData,
      productivityScore: Math.min(Math.round(productivityScore), 100)
    };
  }, [tasks, timeLogs, period]);

  const getProductivityColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          📈 Statistics & Reports
        </h1>
        <p style={{ color: '#6b7280' }}>Track your productivity and progress</p>
      </div>

      {/* Period Selector */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${period === 'day' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPeriod('day')}
          >
            Today
          </button>
          <button
            className={`btn btn-sm ${period === 'week' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPeriod('week')}
          >
            Last 7 Days
          </button>
          <button
            className={`btn btn-sm ${period === 'month' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPeriod('month')}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {stats.totalHours}h {stats.remainingMinutes}m
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Total Time Logged</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {stats.completedTasks}
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Tasks Completed</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {stats.inProgressTasks}
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>In Progress</div>
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${getProductivityColor(stats.productivityScore)}, ${getProductivityColor(stats.productivityScore)}dd)`,
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: `0 10px 25px ${getProductivityColor(stats.productivityScore)}40`
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            {stats.productivityScore}%
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>Productivity Score</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '1.5rem' }}>
        {/* Time Distribution Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>⏰ Daily Time Distribution</h3>
          
          {Object.keys(stats.dailyData).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</p>
              <p>No time logged in this period</p>
            </div>
          ) : (
            <div>
              {Object.entries(stats.dailyData)
                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                .map(([date, minutes]) => {
                  const maxMinutes = Math.max(...Object.values(stats.dailyData));
                  const percentage = (minutes / maxMinutes) * 100;
                  const hours = Math.floor(minutes / 60);
                  const mins = minutes % 60;

                  return (
                    <div key={date} style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '0.25rem',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ color: '#6b7280' }}>{date}</span>
                        <span style={{ fontWeight: '600' }}>
                          {hours}h {mins}m
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '24px',
                        background: '#f3f4f6',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
                          borderRadius: '6px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Top Tasks */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>🏆 Top Tasks by Time</h3>
          
          {stats.topTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</p>
              <p>No tasks with logged time</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.topTasks.map(({ task, minutes }, index) => {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                const maxMinutes = stats.topTasks[0].minutes;
                const percentage = (minutes / maxMinutes) * 100;

                return (
                  <div key={task.id}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          #{index + 1} {task.title}
                        </div>
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#6366f1' }}>
                        {hours}h {mins}m
                      </div>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: index === 0 ? '#fbbf24' : 
                                   index === 1 ? '#c0c0c0' :
                                   index === 2 ? '#cd7f32' : '#6366f1',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Task Completion Breakdown */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>📊 Task Status Breakdown</h3>
        
        <div className="grid grid-3">
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 1rem',
              borderRadius: '50%',
              background: `conic-gradient(
                #10b981 0% ${(stats.completedTasks / (stats.completedTasks + stats.inProgressTasks + stats.todoTasks)) * 100 || 0}%,
                #f3f4f6 0%
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#10b981'
              }}>
                {stats.completedTasks}
              </div>
            </div>
            <div style={{ fontWeight: '600' }}>Completed</div>
          </div>

          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 1rem',
              borderRadius: '50%',
              background: `conic-gradient(
                #3b82f6 0% ${(stats.inProgressTasks / (stats.completedTasks + stats.inProgressTasks + stats.todoTasks)) * 100 || 0}%,
                #f3f4f6 0%
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#3b82f6'
              }}>
                {stats.inProgressTasks}
              </div>
            </div>
            <div style={{ fontWeight: '600' }}>In Progress</div>
          </div>

          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 1rem',
              borderRadius: '50%',
              background: `conic-gradient(
                #6b7280 0% ${(stats.todoTasks / (stats.completedTasks + stats.inProgressTasks + stats.todoTasks)) * 100 || 0}%,
                #f3f4f6 0%
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#6b7280'
              }}>
                {stats.todoTasks}
              </div>
            </div>
            <div style={{ fontWeight: '600' }}>To Do</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;