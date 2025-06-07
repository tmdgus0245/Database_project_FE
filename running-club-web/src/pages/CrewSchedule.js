import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

export default function CrewSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notices, setNotices] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });

  useEffect(() => {
    // 공지사항 불러오기
    axios.get(`http://192.168.0.75:5000/api/crews/${id}/crew_notice`)
      .then(response => {
        setNotices(response.data);
      })
      .catch(error => {
        console.error("공지사항 불러오기 실패:", error);
      });
  }, [id]);

  const handleAddNotice = () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      alert('제목과 내용을 모두 입력하세요!');
      return;
    }

    // 공지사항 POST 요청
    axios.post(`http://172.21.81.147:5000/api/crews/${id}/crew_notice`, {
      user_id: 1,  // 💡 현재 로그인 사용자 (임시로 1로 작성)
      title: newNotice.title,
      content: newNotice.content
    })
      .then(response => {
        alert("공지사항 등록 완료!");
        // 새로고침 없이 즉시 목록 갱신
        setNotices([
          {
            notice_id: response.data.notice_id,
            title: newNotice.title,
            content: newNotice.content,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
          },
          ...notices
        ]);
        setNewNotice({ title: '', content: '' });
        setShowEventForm(false);
      })
      .catch(error => {
        console.error("공지사항 등록 실패:", error);
        alert("크루장만 작성 가능합니다");
      });
  };

  const handleDeleteNotice = (notice_id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    axios.delete(`http://172.21.81.147:5000/api/crews/${id}/notices/${notice_id}`, {
      data: { user_id: 1 }  // ✅ user_id 포함시킴 (크루장만 삭제 가능)
    })
      .then(() => {
        alert("삭제 완료!");
        // 삭제 성공 시 notices를 갱신
        setNotices(prev => prev.filter(notice => notice.notice_id !== notice_id));
      })
      .catch(err => {
        console.error("삭제 실패:", err);
        alert("크루장만 삭제 가능합니다");
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📅 크루 공지사항</h1>
        <button style={styles.backButton} onClick={() => navigate(`/crew/${id}`)}>← 뒤로가기</button>
      </div>

      <div style={styles.calendarSection}>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      <div style={styles.section}>
        <h3>📌 전체 공지사항</h3>
        {notices.length === 0 ? (
          <p>등록된 공지사항이 없습니다.</p>
        ) : (
          notices.map((notice) => (
            <div key={notice.notice_id} style={styles.item}>
              <div style={styles.itemHeader}>
                <strong>{notice.title}</strong>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteNotice(notice.notice_id)}
                >
                  삭제
                </button>
              </div>
              <p>{notice.content}</p>
              <small>{notice.created_at}</small>
            </div>
          ))
        )}
        <button onClick={() => setShowEventForm(true)} style={styles.addButton}>+ 공지사항 작성</button>
      </div>

      {showEventForm && (
        <div style={styles.modal}>
          <div style={styles.form}>
            <h3>공지사항 작성</h3>
            <input
              type="text"
              placeholder="제목"
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              style={styles.input}
            />
            <textarea
              placeholder="내용"
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              style={styles.textarea}
            />
            <div style={styles.buttonRow}>
              <button onClick={handleAddNotice} style={styles.submitButton}>작성 완료</button>
              <button onClick={() => setShowEventForm(false)} style={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  deleteButton: {
    padding: '0.3rem 0.7rem',
    borderRadius: '6px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  container: { padding: '2rem', fontFamily: "'Segoe UI','Noto Sans KR',sans-serif", backgroundColor: '#f9f9f9', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '2rem', color: '#333' },
  backButton: {
    padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
    backgroundColor: '#007bff', color: 'white', fontSize: '1rem', cursor: 'pointer'
  },
  calendarSection: { marginBottom: '2rem', display: 'flex', justifyContent: 'center' },
  section: { backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  item: { backgroundColor: '#f1f1f1', padding: '0.7rem', borderRadius: '8px', marginBottom: '0.5rem' },
  addButton: { padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  form: { backgroundColor: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ccc' },
  textarea: { padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '100px' },
  buttonRow: { display: 'flex', justifyContent: 'space-between' },
  submitButton: { padding: '0.7rem 1rem', borderRadius: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' },
  cancelButton: { padding: '0.7rem 1rem', borderRadius: '8px', backgroundColor: '#ccc', color: '#333', border: 'none', cursor: 'pointer' },
};
