import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Crew() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = 1;  //  현재 로그인한 유저 (임시로 user_id 1)
    const [crewInfo, setCrewInfo] = useState({
        name: '',
        leader: '',
        region: '',
        description: ''
    });

    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [isMember, setIsMember] = useState(false);

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

    const StarRatingInput = ({ rating, setRating }) => {
        const [hover, setHover] = useState(0);

        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill={(hover ? (hover >= star) : (rating >= star)) ? "#ffc107" : "#ddd"}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                        style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                    >
                        <path d="M12 .587l3.668 7.568L24 9.75l-6 5.849 1.42 8.287L12 18.896l-7.42 4.99L6 15.599 0 9.75l8.332-1.595z" />
                    </svg>
                ))}
            </div>
        );
    };

    useEffect(() => {
        axios.get(`http://192.168.0.75:5000/api/crews/${id}`)
            .then(response => {
                setCrewInfo(response.data);
            })
            .catch(error => {
                console.error("Error fetching crew info:", error);
            });

        axios.get(`http://192.168.0.75:5000/api/crews/${id}/reviews`)
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
            });
    }, [id]);


    const handleReviewSubmit = () => {
        if (newReview.trim() === "") {
            alert("리뷰를 작성해주세요!");
            return;
        }

        const payload = {
            user_id: userId,
            rating: newRating,
            comment: newReview
        };

        axios.post(`http://192.168.0.75:5000/api/crews/${id}/reviews`, payload)
            .then(res => {
                alert("리뷰 등록 완료");
                setNewReview("");
                setNewRating(5);
                // 등록 후 리뷰 다시 불러오기
                return axios.get(`http://192.168.0.75:5000/api/crews/${id}/reviews`);
            })
            .then(res => setReviews(res.data))
            .catch(err => {
                console.error("리뷰 등록 실패:", err);
                alert("리뷰 등록 중 오류 발생");
            });
    };

    // 리뷰 삭제 핸들러 (본인 리뷰만 삭제 가능)
    const handleDeleteReview = (review_id) => {
        axios.delete(`http://192.168.0.75:5000/api/reviews/${review_id}`, {
            data: { user_id: userId }
        })
            .then(res => {
                alert("리뷰 삭제 완료");
                setReviews(reviews.filter(review => review.review_id !== review_id));
            })
            .catch(err => {
                console.error("리뷰 삭제 실패:", err);
                alert("리뷰 삭제 중 오류 발생");
            });
    };

    const handleJoin = () => {
        axios.post(`http://192.168.0.75:5000/api/crews/${id}/join`, { user_id: userId })
            .then(res => {
                alert("가입 완료!");
                setIsMember(true);
            })
            .catch(err => {
                console.error(err);
                alert("가입 중 오류 발생");
            });
    };

    const handleLeave = () => {
        axios.post(`http://192.168.0.75:5000/api/crews/${id}/leave`, { user_id: userId })
            .then(res => {
                alert("탈퇴 완료!");
                setIsMember(false);
            })
            .catch(err => {
                console.error(err);
                alert("탈퇴 중 오류 발생");
            });
    };

    const renderJoinLeaveButton = () => {
        return isMember ? (
            <button style={styles.leaveButton} onClick={handleLeave}>탈퇴</button>
        ) : (
            <button style={styles.joinButton} onClick={handleJoin}>가입</button>
        );
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
                            <button style={styles.menuItem} onClick={() => handleMenuClick('schedule')}>📅 크루 일정</button>
                        </div>
                    )}
                </div>

                <div style={styles.titleBox}>
                    <h2>{crewInfo.name}</h2>
                    <p style={styles.leader}>크루장: {crewInfo.leader}</p>
                    <p style={styles.region}>{crewInfo.region}</p>
                </div>

                {renderJoinLeaveButton()}
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
                    <StarRatingInput rating={newRating} setRating={setNewRating} />
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
                            <div style={styles.reviewContent}>
                                <div>
                                    <strong>{review.rating}점</strong> - {review.comment} ({review.nickname} / {review.created_at})
                                </div>
                                {review.user_id === userId && (
                                    <button onClick={() => handleDeleteReview(review.review_id)} style={styles.deleteButton}>
                                        🗑️
                                    </button>
                                )}
                            </div>
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
    leaveButton: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#dc3545',
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

    reviewContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    deleteButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '1.3rem',
        color: '#dc3545',
        cursor: 'pointer'
    },
};
