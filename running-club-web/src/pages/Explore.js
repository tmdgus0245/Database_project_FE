import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [crews, setCrews] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCrew, setNewCrew] = useState({
    name: '',
    description: '',
    region: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCrews();
  }, []);

  const fetchCrews = () => {
    axios.get('http://192.168.0.75:5000/api/crews_search')
      .then(response => {
        setCrews(response.data);
      })
      .catch(error => {
        console.error("Error fetching crews:", error);
      });
  };

  const filteredCrews = crews.filter(crew =>
    crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crew.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCrewClick = (crewId) => {
    navigate(`/crew/${crewId}`);
  };

  const handleCreateCrew = () => {
    if (!newCrew.name.trim()) {
      alert('크루 이름을 입력하세요.');
      return;
    }

    axios.post('http://192.168.0.75:5000/api/crews_make', {
      name: newCrew.name,
      description: newCrew.description,
      region: newCrew.region,
      created_by: 1  // 👉 현재 로그인 유저 (임시로 1 고정)
    })
    .then(response => {
      alert("크루 생성 완료!");
      setShowCreateForm(false);
      setNewCrew({ name: '', description: '', region: '' });
      fetchCrews();  // 생성 후 목록 새로고침
    })
    .catch(error => {
      console.error("크루 생성 실패:", error);
      alert("생성 중 오류 발생");
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>크루 탐색</h1>

      <input
        type="text"
        placeholder="크루 이름 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBar}
      />

      <button style={styles.createButton} onClick={() => setShowCreateForm(true)}>+ 크루 생성</button>

      <div style={styles.crewList}>
        {filteredCrews.map((crew) => (
          <div
            key={crew.crew_id}
            style={styles.crewItem}
            onClick={() => handleCrewClick(crew.crew_id)}
          >
            {crew.name} / {crew.region}
          </div>
        ))}
      </div>

      {/* 크루 생성 폼 모달 */}
      {showCreateForm && (
        <div style={styles.modal}>
          <div style={styles.form}>
            <h3>크루 생성</h3>
            <input
              type="text"
              placeholder="크루 이름"
              value={newCrew.name}
              onChange={(e) => setNewCrew({ ...newCrew, name: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="지역"
              value={newCrew.region}
              onChange={(e) => setNewCrew({ ...newCrew, region: e.target.value })}
              style={styles.input}
            />
            <textarea
              placeholder="소개"
              value={newCrew.description}
              onChange={(e) => setNewCrew({ ...newCrew, description: e.target.value })}
              style={styles.textarea}
            />

            <div style={styles.buttonRow}>
              <button onClick={handleCreateCrew} style={styles.submitButton}>생성</button>
              <button onClick={() => setShowCreateForm(false)} style={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', textAlign: 'center' },
  title: { fontSize: '2rem', marginBottom: '1rem' },
  searchBar: {
    padding: '0.5rem 1rem', fontSize: '1.1rem', width: '60%', maxWidth: '500px',
    marginBottom: '2rem', borderRadius: '8px', border: '1px solid #ccc',
  },
  createButton: {
    padding: '0.7rem 1.5rem', borderRadius: '8px', backgroundColor: '#28a745',
    color: 'white', fontSize: '1rem', border: 'none', marginBottom: '2rem', cursor: 'pointer'
  },
  crewList: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  crewItem: {
    padding: '1rem 2rem', backgroundColor: '#f0f0f0', borderRadius: '8px', width: '60%',
    maxWidth: '500px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer', transition: '0.2s'
  },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  form: { backgroundColor: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ccc' },
  textarea: { padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '100px' },
  buttonRow: { display: 'flex', justifyContent: 'space-between' },
  submitButton: { padding: '0.7rem 1rem', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' },
  cancelButton: { padding: '0.7rem 1rem', borderRadius: '8px', backgroundColor: '#ccc', color: '#333', border: 'none', cursor: 'pointer' },
};
