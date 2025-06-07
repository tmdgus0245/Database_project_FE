import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Events = () => {
  const backend = 'http://172.21.81.147:5000';
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${backend}/api/events?page=${page}&per_page=${perPage}`);
        setEvents(res.data.data);
        setTotalPages(res.data.pages);
      } catch (err) {
        console.error('행사 데이터 호출 실패', err);
      }
    };

    fetchEvents();
  }, [backend, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1 style={{ marginBottom: '20px' }}>🏃‍♀️ 러닝 대회 목록</h1>

      <div style={styles.listContainer}>
        {events.map((event, index) => (
          <div key={index} style={styles.listItem}>
            <div style={styles.infoSection}>
              <div style={styles.title}>{event.title}</div>
              <div>주최: {event.host}</div>
              <div>장소: {event.location}</div>
              <div>날짜: {event.date || '미정'}</div>
            </div>
            <div>
              {event.apply_url ? (
                <a href={event.apply_url} target="_blank" rel="noopener noreferrer" style={styles.button}>
                  신청하기
                </a>
              ) : (
                <div style={styles.noApply}>신청 링크 없음</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.pagination}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>이전</button>
        <span>{page} / {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>다음</button>
      </div>
    </div>
  );
}

const styles = {
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    fontSize: '16px'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '5px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    textDecoration: 'none'
  },
  noApply: {
    padding: '10px 20px',
    backgroundColor: '#ccc',
    borderRadius: '5px',
    textAlign: 'center'
  },
  pagination: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'
  }
};

export default Events;