import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function CrewRunlog() {
  const { id } = useParams(); // id 가져오기
  const navigate = useNavigate();

  const [runLogs, setRunLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [crewName, setCrewName] = useState(""); // 크루 이름 받아오기 (옵션)
  const [newLog, setNewLog] = useState({
    date: '',
    title: '',
    distance_km: '',
    duration_min: '',
    notes: '',
    photo_url: ''  // 서버에는 url 전송이므로 file업로드는 제외
  });

  // 크루 런로그 불러오기
  useEffect(() => {
    if (!id) return;

    axios.get(`http://192.168.0.75:5000/api/crews/${id}/crew_run_log`)
      .then(response => {
        setRunLogs(response.data);
      })
      .catch(error => {
        console.error("런 기록 불러오기 실패:", error);
      });

    // 크루 이름도 간단히 가져오자 (선택사항)
    axios.get(`http://192.168.0.75:5000/api/crews/${id}`)
      .then(response => {
        setCrewName(response.data.name);
      })
      .catch(error => {
        console.error("크루 정보 불러오기 실패:", error);
      });

  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLog({ ...newLog, [name]: value });
  };

  const handleAddLog = () => {
    if (!newLog.date || !newLog.title || !newLog.distance_km || !newLog.duration_min) {
      alert('모든 항목을 입력하세요!');
      return;
    }

    const avg_pace = (newLog.duration_min / newLog.distance_km).toFixed(2);

    // POST 요청 (user_id는 예시로 1번 크루장이라고 가정)
    axios.post(`http://192.168.0.75:5000/api/crews/${id}/crew_run_log`, {
      user_id: 31,
      title: newLog.title,
      date: newLog.date,
      distance_km: parseFloat(newLog.distance_km),
      duration_min: parseInt(newLog.duration_min),
      avg_pace: parseFloat(avg_pace),
      notes: newLog.notes,
      photo_url: newLog.photo_url  // 실제 프로젝트에서는 파일 업로드 구현 필요
    }).then(res => {
      alert('기록 등록 성공!');
      setShowForm(false);
      setNewLog({ date: '', title: '', distance_km: '', duration_min: '', notes: '', photo_url: '' });

      // 다시 불러오기
      return axios.get(`http://192.168.0.75:5000/api/crews/${id}/crew_run_log`);
    }).catch(err => {
      console.error("등록 실패:", err);
      alert("크루장만 작성 가능합니다");
    }).then(response => {
      setRunLogs(response.data);
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏃‍♂️ {crewName} 크루 러닝 기록</h1>
        <button
          style={styles.backButton}
          onClick={() => navigate(-1)}
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
            <input type="date" name="date" value={newLog.date} onChange={handleInputChange} style={styles.input} placeholder="날짜" />
            <input type="text" name="title" value={newLog.title} onChange={handleInputChange} style={styles.input} placeholder="제목" />
            <input type="number" name="distance_km" value={newLog.distance_km} onChange={handleInputChange} style={styles.input} placeholder="거리 (km)" />
            <input type="number" name="duration_min" value={newLog.duration_min} onChange={handleInputChange} style={styles.input} placeholder="시간 (분)" />
            <textarea name="notes" value={newLog.notes} onChange={handleInputChange} style={styles.textarea} placeholder="메모" />

            {/* photo_url만 입력하도록 처리 */}
            <input type="text" name="photo_url" value={newLog.photo_url} onChange={handleInputChange} style={styles.input} placeholder="이미지 URL (선택)" />

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