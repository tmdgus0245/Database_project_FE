import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CrewList() {
  const navigate = useNavigate();

  const myCrews = [
    "AJOU 러너스",
    "주말러너스",
    "야간런닝크루",
  ];

  const handleCrewClick = (crewName) => {
    navigate(`/crew?name=${encodeURIComponent(crewName)}`);
  };

  return (
    <div style={styles.container}>
      <h1>내가 가입한 크루</h1>
      <div style={styles.crewList}>
        {myCrews.map((crew, index) => (
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
  crewList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
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
