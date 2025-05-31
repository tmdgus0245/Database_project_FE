import React, { useState } from 'react';

export default function MyRunning() {
  const [logs, setLogs] = useState([
    { date: '2024-05-01', distance_km: 5.0, duration_min: 30, pace: 6.0 },
    { date: '2024-05-03', distance_km: 10.0, duration_min: 60, pace: 6.0 },
  ]);
  const [newLog, setNewLog] = useState({
    date: '',
    distance_km: '',
    duration_min: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLog({ ...newLog, [name]: value });
  };

  const handleAddLog = () => {
    if (newLog.date && newLog.distance_km && newLog.duration_min) {
      const pace = (newLog.duration_min / newLog.distance_km).toFixed(2);
      setLogs([
        ...logs,
        {
          date: newLog.date,
          distance_km: parseFloat(newLog.distance_km),
          duration_min: parseInt(newLog.duration_min),
          pace: parseFloat(pace),
        },
      ]);
      setNewLog({ date: '', distance_km: '', duration_min: '' });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏃‍♂️ 나의 러닝 기록</h1>

      {/* 입력 폼 */}
      <div style={styles.form}>
        <input
          type="date"
          name="date"
          value={newLog.date}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="distance_km"
          placeholder="거리 (km)"
          value={newLog.distance_km}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="duration_min"
          placeholder="시간 (분)"
          value={newLog.duration_min}
          onChange={handleChange}
          style={styles.input}
        />
        <button onClick={handleAddLog} style={styles.addButton}>
          ➕ 기록 추가
        </button>
      </div>

      {/* 기록 리스트 */}
      <div style={styles.list}>
        {logs.map((log, index) => (
          <div key={index} style={styles.logItem}>
            <div style={styles.logDate}>{log.date}</div>
            <div style={styles.logDetail}>
              <span>거리: <strong>{log.distance_km} km</strong></span>
              <span>시간: <strong>{log.duration_min} 분</strong></span>
              <span>페이스: <strong>{log.pace} 분/km</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', 'Noto Sans KR', sans-serif",
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '2rem',
    color: '#333',
  },
  form: {
    marginBottom: '2.5rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  input: {
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  addButton: {
    padding: '0.7rem 1.5rem',
    borderRadius: '10px',
    backgroundColor: '#00b894',
    color: 'white',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  logItem: {
    padding: '1.2rem 1.5rem',
    borderRadius: '15px',
    backgroundColor: '#ffffff',
    textAlign: 'left',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  logDate: {
    fontSize: '1.1rem',
    marginBottom: '0.7rem',
    color: '#007bff',
    fontWeight: '600',
  },
  logDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '1rem',
    color: '#444',
  },
};
