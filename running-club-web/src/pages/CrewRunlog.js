import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CrewRunlog() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const crewName = queryParams.get("name");
  const decodedCrewName = decodeURIComponent(crewName);

  const [runLogs, setRunLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newLog, setNewLog] = useState({
    date: '',
    title: '',
    distance_km: '',
    duration_min: '',
    notes: '',
    photo_file: null,
    photo_url: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLog({ ...newLog, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLog({ ...newLog, photo_file: file, photo_url: URL.createObjectURL(file) });
    }
  };

  const handleAddLog = () => {
    if (!newLog.date || !newLog.title || !newLog.distance_km || !newLog.duration_min) {
      alert('모든 항목을 입력하세요!');
      return;
    }
    const avg_pace = (newLog.duration_min / newLog.distance_km).toFixed(2);
    setRunLogs([
      ...runLogs,
      {
        date: newLog.date,
        title: newLog.title,
        distance_km: parseFloat(newLog.distance_km),
        duration_min: parseInt(newLog.duration_min),
        avg_pace: parseFloat(avg_pace),
        photo_url: newLog.photo_url,
        notes: newLog.notes,
        created_by: "홍길동"
      }
    ]);
    setNewLog({
      date: '', title: '', distance_km: '', duration_min: '', notes: '', photo_file: null, photo_url: null
    });
    setShowForm(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏃‍♂️ {decodedCrewName} 크루 러닝 기록</h1>
        <button
          style={styles.backButton}
          onClick={() => navigate(`/crew?name=${encodeURIComponent(decodedCrewName)}`)}
        >
          ← 뒤로가기
        </button>
      </div>

      <button onClick={() => setShowForm(true)} style={styles.writeButton}>+ 기록 작성</button>

      {/* 작성 폼 모달 */}
      {showForm && (
        <div style={styles.modal}>
          <div style={styles.form}>
            <h3>러닝 기록 작성</h3>

            <label>날짜</label>
            <input type="date" name="date" value={newLog.date} onChange={handleInputChange} style={styles.input} />

            <label>제목</label>
            <input type="text" name="title" value={newLog.title} onChange={handleInputChange} style={styles.input} />

            <label>거리 (km)</label>
            <input type="number" name="distance_km" value={newLog.distance_km} onChange={handleInputChange} style={styles.input} />

            <label>시간 (분)</label>
            <input type="number" name="duration_min" value={newLog.duration_min} onChange={handleInputChange} style={styles.input} />

            <label>메모</label>
            <textarea name="notes" value={newLog.notes} onChange={handleInputChange} style={styles.textarea} />

            <label>사진 첨부</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
            {newLog.photo_url && <img src={newLog.photo_url} alt="preview" style={styles.imagePreview} />}

            <div style={styles.buttonRow}>
              <button onClick={handleAddLog} style={styles.submitButton}>작성 완료</button>
              <button onClick={() => setShowForm(false)} style={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 기록 리스트 */}
      <div style={styles.logList}>
        {runLogs.map((log, index) => (
          <div key={index} style={styles.logItem}>
            <h3>{log.title}</h3>
            <p><strong>날짜:</strong> {log.date}</p>
            <p><strong>작성자:</strong> {log.created_by}</p>
            <p><strong>거리:</strong> {log.distance_km} km</p>
            <p><strong>시간:</strong> {log.duration_min} 분</p>
            <p><strong>평균 페이스:</strong> {log.avg_pace} 분/km</p>
            <p><strong>메모:</strong> {log.notes}</p>
            {log.photo_url && <img src={log.photo_url} alt="run" style={styles.photo} />}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: "'Segoe UI','Noto Sans KR',sans-serif", backgroundColor: '#f9f9f9', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },

  title: { fontSize: '2rem', color: '#333' },

  // ✅ 뒤로가기 버튼 스타일 추가
  backButton: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  writeButton: { padding: '0.7rem 1.5rem', borderRadius: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', fontSize: '1rem', cursor: 'pointer', marginBottom: '2rem' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  form: { backgroundColor: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', width: '400px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  input: { padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc' },
  textarea: { padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px' },
  fileInput: { fontSize: '1rem' },
  imagePreview: { marginTop: '0.5rem', width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px' },
  buttonRow: { display: 'flex', justifyContent: 'space-between', marginTop: '1rem' },
  submitButton: { padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' },
  cancelButton: { padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#ccc', color: '#333', border: 'none', cursor: 'pointer' },
  logList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  logItem: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  photo: { marginTop: '1rem', width: '100%', maxWidth: '400px', maxHeight: '300px', objectFit: 'contain', borderRadius: '10px' }
};
