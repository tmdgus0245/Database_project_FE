import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Crew() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [crewInfo, setCrewInfo] = useState({
        name: '',
        leader: '',
        region: '',
        description: ''
    });

    const [reviews, setReviews] = useState([]);

    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(5);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
        : 0;

    const [menuOpen, setMenuOpen] = useState(false);

    const StarRating = ({ score }) => {
        const percentage = (score / 5) * 100;

        return (
            <div style={{ position: 'relative', display: 'inline-block', width: '120px', height: '24px' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    {[...Array(5)].map((_, index) => (
                        <svg key={index} width="24" height="24" viewBox="0 0 24 24" fill="#ddd">
                            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.849 1.42 8.287L12 18.896l-7.42 4.99L6 15.599 0 9.75l8.332-1.595z" />
                        </svg>
                    ))}
                </div>

                <div style={{ position: 'absolute', width: `${percentage}%`, height: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {[...Array(5)].map((_, index) => (
                        <svg key={index} width="24" height="24" viewBox="0 0 24 24" fill="#ffc107">
                            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.849 1.42 8.287L12 18.896l-7.42 4.99L6 15.599 0 9.75l8.332-1.595z" />
                        </svg>
                    ))}
                </div>
            </div>
        );
    };

    useEffect(() => {
        axios.get(`http://172.21.81.205:5000/api/crews/${id}`)
            .then(response => {
                setCrewInfo(response.data);
                setReviews(response.data.reviews);
            })
            .catch(error => {
                console.error("Error fetching crew info:", error);
            });
    }, [id]);

    const handleReviewSubmit = () => {
        if (newReview.trim() !== "") {
            setReviews([...reviews, {
                review_id: Date.now(),
                user_id: 1,
                rating: newRating,
                comment: newReview,
                created_at: new Date().toISOString()
            }]);
            setNewReview("");
            setNewRating(5);
        }
    };


    const handleMenuClick = (menu) => {
        navigate(`/crew/${id}/${menu}`);
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
                    <h2>{crewInfo.name}</h2>
                    <p style={styles.leader}>크루장: {crewInfo.leader}</p>
                    <p style={styles.region}>{crewInfo.region}</p>
                </div>

                <button style={styles.joinButton}>가입</button>
            </div>

            <div style={styles.ratingBox}>
                <h3>평균 평점</h3>
                <p style={styles.ratingScore}>
                    <StarRating score={averageRating} /> ({averageRating.toFixed(1)} / 5.0)
                </p>
            </div>


            <div style={styles.description}>
                <h3>크루 소개</h3>
                <p>{crewInfo.description}</p>
            </div>

            <div style={styles.reviewSection}>
                <h3>리뷰</h3>
                <div style={styles.reviewInputBox}>
                    <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        style={styles.ratingSelect}
                    >
                        {[5, 4, 3, 2, 1].map((score) => (
                            <option key={score} value={score}>{score}점</option>
                        ))}
                    </select>

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
                    {reviews.map((review) => (
                        <div key={review.review_id} style={styles.reviewItem}>
                            <strong>{review.rating}점</strong> - {review.comment} ({review.created_at})
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
    starContainer: {
        position: 'relative',
        display: 'inline-block',
        fontSize: '2rem',
        lineHeight: 1,
    },

    starBackground: {
        color: '#ddd',
        position: 'absolute',
        top: 0,
        left: 0,
        whiteSpace: 'nowrap',
        zIndex: 1
    },

    starForeground: {
        color: '#ffc107',
        position: 'absolute',
        top: 0,
        left: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        zIndex: 2
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
    leader: {
        marginTop: '0.2rem',
        fontSize: '0.9rem',
        color: '#333',
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
