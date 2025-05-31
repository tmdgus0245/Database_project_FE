import React from 'react';
import { useLocation } from 'react-router-dom';

export default function CrewMembers() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const crewName = queryParams.get("name");
  const decodedCrewName = decodeURIComponent(crewName);

  // 더미 크루원 데이터 (DB 기반으로 설계)
  const members = [
    { name: '홍길동', nickname: '길동러너', join_date: '2024-01-15' },
    { name: '김철수', nickname: '철수스프린터', join_date: '2023-11-20' },
    { name: '이영희', nickname: '영희조깅', join_date: '2024-03-05' },
    { name: '박민준', nickname: '민준마라톤', join_date: '2023-09-12' },
  ];

  // 이름순 정렬
  const sortedMembers = members.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 {decodedCrewName} 크루원 목록</h1>

      <div style={styles.memberList}>
        {sortedMembers.map((member, index) => (
          <div key={index} style={styles.memberItem}>
            <h3>{member.name} <span style={styles.nickname}>({member.nickname})</span></h3>
            <p><strong>가입일:</strong> {member.join_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: "'Segoe UI','Noto Sans KR',sans-serif", backgroundColor: '#f9f9f9', minHeight: '100vh' },
  title: { fontSize: '2rem', marginBottom: '2rem', color: '#333' },
  memberList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  memberItem: { backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  nickname: { fontSize: '0.9rem', color: '#777' }
};
