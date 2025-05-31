import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Crew() {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const crewName = queryParams.get("name");
    const decodedCrewName = decodeURIComponent(crewName);

    const crewInfo = {
        region: "서울",
        description: `${decodedCrewName} 크루에 오신 것을 환영합니다! 함께 건강하게 달려요.`,
    };

    const [reviews, setReviews] = useState([
        "좋은 크루에요!",
        "첫 참가했는데 너무 재밌었어요!",
    ]);
    const [newReview, setNewReview] = useState("");
    const [menuOpen, setMenuOpen] = useState(false); // 메뉴 토글 상태

    const handleReviewSubmit = () => {
        if (newReview.trim() !== "") {
            setReviews([...reviews, newReview]);
            setNewReview("");
        }
    };

    const handleMenuClick = (menu) => {
        navigate(`/crew/${menu}?name=${encodeURIComponent(decodedCrewName)}`);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={{ position: 'relative' }}>
                    <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                    {menuOpen && (
                        <div style={styles.dropdownMenu}>
                            <button style={styles.menuItem} onClick={() => handleMenuClick('members')}>👥 크루원</button>
                            <button style={styles.menuItem} onClick={() => handleMenuClick('runlog')}>🏃‍♂️ 크루 러닝 기록</button>
                            <button style={styles.menuItem} onClick={() => handleMenuClick('schedule')}>📅 크루 일정 및 공지사항</button>
                        </div>
                    )}
                </div>

                <div style={styles.titleBox}>
                    <h2>{decodedCrewName}</h2>
                    <p style={styles.region}>{crewInfo.region}</p>
                </div>

                <button style={styles.joinButton}>가입</button>
            </div>

            <div style={styles.description}>
                <h3>크루 소개</h3>
                <p>{crewInfo.description}</p>
            </div>

            <div style={styles.reviewSection}>
                <h3>리뷰</h3>
                <div style={styles.reviewInputBox}>
                    <input
                        type="text"
                        placeholder="리뷰 작성..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        style={styles.reviewInput}
                    />
                    <button onClick={handleReviewSubmit} style={styles.submitButton}>작성</button>
                </div>

                <div style={styles.reviewList}>
                    {reviews.map((review, index) => (
                        <div key={index} style={styles.reviewItem}>
                            {review}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '1rem',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        position: 'relative',
    },
    hamburger: {
        fontSize: '1.5rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '2.5rem',
        left: '0',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        minWidth: '200px'
    },
    menuItem: {
        padding: '0.7rem 1rem',
        border: 'none',
        backgroundColor: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1rem',
        whiteSpace: 'nowrap',
    },
    titleBox: {
        textAlign: 'center',
    },
    region: {
        marginTop: '0.2rem',
        fontSize: '0.9rem',
        color: '#666',
    },
    joinButton: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
    },
    description: {
        marginBottom: '2rem',
    },
    reviewSection: {
        marginTop: '2rem',
    },
    reviewInputBox: {
        display: 'flex',
        marginBottom: '1rem',
    },
    reviewInput: {
        flex: 1,
        padding: '0.5rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        marginRight: '0.5rem',
    },
    submitButton: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#28a745',
        color: 'white',
        cursor: 'pointer',
    },
    reviewList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    reviewItem: {
        padding: '0.7rem 1rem',
        borderRadius: '8px',
        backgroundColor: '#f0f0f0',
    },
};
