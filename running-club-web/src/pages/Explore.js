import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [crews, setCrews] = useState([]);
  const navigate = useNavigate();

  // 서버에서 데이터 불러오기
  useEffect(() => {
    axios.get('http://172.21.81.205:5000/api/crews_search')
      .then(response => {
        setCrews(response.data);
      })
      .catch(error => {
        console.error("Error fetching crews:", error);
      });
  }, []);

  const filteredCrews = crews.filter(crew =>
    crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crew.region.toLowerCase().includes(searchTerm.toLowerCase())
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
            onClick={() => handleCrewClick(crew.name)}
          >
            {crew.name} / {crew.region}
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
