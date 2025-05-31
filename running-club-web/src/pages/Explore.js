import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const crews = [
    "런닝크루 서울",
    "AJOU 러너스",
    "스피드러너",
    "아침조깅팀",
    "한강마라톤",
    "청춘런",
    "주말러너스",
    "야간런닝크루",
  ];

  const filteredCrews = crews.filter(crew =>
    crew.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCrewClick = (crewName) => {
    navigate(`/crew?name=${encodeURIComponent(crewName)}`);
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
      <div style={styles.crewList}>
        {filteredCrews.map((crew, index) => (
          <div 
            key={index} 
            style={styles.crewItem} 
            onClick={() => handleCrewClick(crew)}
          >
            {crew}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  searchBar: {
    padding: '0.5rem 1rem',
    fontSize: '1.1rem',
    width: '60%',
    maxWidth: '500px',
    marginBottom: '2rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  crewList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  crewItem: {
    padding: '1rem 2rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    width: '60%',
    maxWidth: '500px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: '0.2s',
  }
};
