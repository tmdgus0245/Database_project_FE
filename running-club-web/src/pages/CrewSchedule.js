import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CrewSchedule() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const crewName = queryParams.get("name");
  const navigate = useNavigate(); 
  const decodedCrewName = decodeURIComponent(crewName || "크루");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [notices, setNotices] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  const [newEvent, setNewEvent] = useState({ title: '', description: '' });
  const [newNotice, setNewNotice] = useState('');

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    const dateKey = selectedDate.toDateString();
    const updatedEvents = {
      ...events,
      [dateKey]: [...(events[dateKey] || []), { ...newEvent }]
    };
    setEvents(updatedEvents);
    setNewEvent({ title: '', description: '' });
    setShowEventForm(false);
  };

  const handleAddNotice = () => {
    if (!newNotice.trim()) return;
    setNotices([...notices, newNotice]);
    setNewNotice('');
    setShowNoticeForm(false);
  };

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.title}>📅 {decodedCrewName} 크루 일정 및 공지사항</h1>
        <button
          style={styles.backButton}
          onClick={() => navigate(`/crew?name=${encodeURIComponent(decodedCrewName)}`)}
        >
          ← 뒤로가기
        </button>
      </div>

      <div style={styles.calendarSection}>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      <div style={styles.section}>
        <h3>📌 선택 날짜 일정 ({selectedDate.toDateString()})</h3>
        {(events[selectedDate.toDateString()] || []).length === 0 ? (
          <p>등록된 일정이 없습니다.</p>
        ) : (
          events[selectedDate.toDateString()].map((event, idx) => (
            <div key={idx} style={styles.item}>
              <strong>{event.title}</strong>
              <p>{event.description}</p>
            </div>
          ))
        )}
        <button onClick={() => setShowEventForm(true)} style={styles.addButton}>+ 일정 추가</button>
      </div>

      {showEventForm && (
        <div style={styles.modal}>
          <div style={styles.form}>
            <h3>일정 추가</h3>
            <input
              type="text"
              placeholder="제목"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              style={styles.input}
            />
            <textarea
              placeholder="설명"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              style={styles.textarea}
            />
            <div style={styles.buttonRow}>
              <button onClick={handleAddEvent} style={styles.submitButton}>작성 완료</button>
              <button onClick={() => setShowEventForm(false)} style={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h3>📢 공지사항</h3>
        {notices.length === 0 ? (
          <p>등록된 공지사항이 없습니다.</p>
        ) : (
          notices.map((notice, idx) => (
            <div key={idx} style={styles.item}>{notice}</div>
          ))
        )}
        <button onClick={() => setShowNoticeForm(true)} style={styles.addButton}>+ 공지 추가</button>
      </div>

      {showNoticeForm && (
        <div style={styles.modal}>
          <div style={styles.form}>
            <h3>공지사항 작성</h3>
            <textarea
              placeholder="공지사항 입력"
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              style={styles.textarea}
            />
            <div style={styles.buttonRow}>
              <button onClick={handleAddNotice} style={styles.submitButton}>작성 완료</button>
              <button onClick={() => setShowNoticeForm(false)} style={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      )}
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
