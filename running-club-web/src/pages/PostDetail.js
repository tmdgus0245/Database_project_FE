import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PostDetail() {
    const { post_id } = useParams();
    const navigate = useNavigate();
    const backend = 'http://172.21.81.147:5000';
    const userId = 1;  // 로그인 유저 가정

    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);

    // 게시글 상세 + 좋아요 상태 불러오기
    const fetchPostDetail = useCallback(() => {
        axios.get(`${backend}/api/posts/${post_id}`, {
            params: { user_id: userId }   // ✅ 쿼리파라미터로 user_id 전달
        })
        .then(res => {
            setPost(res.data);
            setLiked(res.data.liked);  // ✅ 초기 liked 상태 받기
        })
        .catch(err => console.error(err));
    }, [post_id]);

    useEffect(() => {
        fetchPostDetail();
    }, [fetchPostDetail]);


    const handleLikeToggle = () => {
        if (liked) {
            axios.delete(`${backend}/api/posts/${post_id}/like`, { data: { user_id: userId } })
                .then(() => {
                    setLiked(false);
                    fetchPostDetail();
                })
                .catch(err => console.error(err));
        } else {
            axios.post(`${backend}/api/posts/${post_id}/like`, { user_id: userId })
                .then(() => {
                    setLiked(true);
                    fetchPostDetail();
                })
                .catch(err => console.error(err));
        }
    };

    const handleDelete = () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        axios.delete(`${backend}/api/posts/${post_id}`, { data: { user_id: userId } })
            .then(() => {
                alert("삭제 완료");
                navigate('/board');
            })
            .catch(err => {
                // 권한 없을 때
                if (err.response && err.response.status === 403) {
                    alert("게시물 작성자가 아닙니다.");
                } else {
                    console.error(err);
                    alert("삭제 중 오류 발생");
                }
            });
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.image_url && <img src={post.image_url} alt="이미지" style={styles.image} />}
            <p>작성일: {post.created_at}</p>
            <p>좋아요 수: ❤️ {post.like_count}</p>

            <div style={styles.buttonRow}>
                <button onClick={handleLikeToggle} style={styles.likeBtn}>
                    {liked ? "❤️ 취소" : "🤍 좋아요"}
                </button>

                <button onClick={handleDelete} style={styles.deleteBtn}>🗑 삭제</button>

                <button onClick={() => navigate('/board')} style={styles.backBtn}>← 목록으로</button>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem', fontFamily: "'Segoe UI','Noto Sans KR',sans-serif" },
    image: { width: '100%', maxWidth: '600px', borderRadius: '10px', marginBottom: '1rem' },
    buttonRow: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    likeBtn: { padding: '0.7rem 1.5rem', borderRadius: '10px', backgroundColor: '#ff6b81', color: 'white', border: 'none', cursor: 'pointer' },
    deleteBtn: { padding: '0.7rem 1.5rem', borderRadius: '10px', backgroundColor: '#555', color: 'white', border: 'none', cursor: 'pointer' },
    backBtn: { padding: '0.7rem 1.5rem', borderRadius: '10px', backgroundColor: '#aaa', color: 'white', border: 'none', cursor: 'pointer' }
};