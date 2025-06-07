import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function CrewMembers() {
  const { id } = useParams();  // URL에서 id 받아오기
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [crewName, setCrewName] = useState("");

  useEffect(() => {
    if (!id) return;

    // 1. 크루 기본 정보도 가져와서 이름 표시
    axios.get(`http://192.168.0.75:5000/api/crews/${id}`)
      .then(response => {
        setCrewName(response.data.name);
      })
      .catch(error => {
        console.error("크루 정보 불러오기 실패:", error);
      });

    // 2. 멤버 리스트 가져오기
    axios.get(`http://192.168.0.75:5000/api/crews/${id}/crew_member`)
      .then(response => {
        setMembers(response.data);
      })
      .catch(error => {
        console.error("크루 멤버 불러오기 실패:", error);
      });
  }, [id]);

  const sortedMembers = [...members].sort((a, b) => a.nickname.localeCompare(b.nickname));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 {crewName} 크루원 목록</h1>
        <button
          style={styles.backButton}
          onClick={() => navigate(`/crew/${id}`)}
        >
          ← 뒤로가기
        </button>
      </div>

      <div style={styles.memberList}>
        {sortedMembers.map((member, index) => (
          <div key={index} style={styles.memberItem}>
            <h3>{member.nickname} <span style={styles.user_id}>({member.user_id})</span></h3>
            <p><strong>가입일:</strong> {member.join_date}</p>
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
  backButton: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  memberList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  memberItem: { backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  nickname: { fontSize: '0.9rem', color: '#777' }
};
