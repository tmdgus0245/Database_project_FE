import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // ✅ 추가

export default function Board() {
  const navigate = useNavigate();  // ✅ 추가
  const [category, setCategory] = useState('course');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', image_url: '' });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const backend = 'http://192.168.0.75:5000';
  const userId = 1;

  const fetchPosts = (category) => {
    const url = category === 'course' ? '/api/posts/course' : '/api/posts/brag';
    axios.get(`${backend}${url}`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPosts(category);
  }, [category]);

  const handleAddPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const url = category === 'course' ? '/api/posts/course' : '/api/posts/brag';

    axios.post(`${backend}${url}`, {
      user_id: userId,
      title: newPost.title,
      content: newPost.content,
      image_url: newPost.image_url
    })
      .then(() => {
        fetchPosts();
        setNewPost({ title: '', content: '', image_url: '' });
        setShowForm(false);
      })
      .catch(err => console.error(err));
  };

  const filteredPosts = posts.filter(
    post => post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {category === 'course' ? '🗺️ 코스 추천 게시판' : '🏅 런닝 자랑 게시판'}
      </h1>

      <div style={styles.tabContainer}>
        <button style={category === 'course' ? styles.activeTab : styles.tab} onClick={() => setCategory('course')}>🗺️ 코스 추천</button>
        <button style={category === 'brag' ? styles.activeTab : styles.tab} onClick={() => setCategory('brag')}>🏅 런닝 자랑</button>
        <button style={styles.writeButton} onClick={() => setShowForm(true)}>+ 작성</button>
      </div>

      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <input type="text" placeholder="제목 또는 내용 검색" value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />
      </div>

      {showForm && (
        <div style={styles.modal}>
          <div style={styles.form}>
            <h3>게시글 작성</h3>
            <input type="text" placeholder="제목" value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} style={styles.input} />
            <textarea placeholder="내용" value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} style={styles.textarea} />
            <input type="text" placeholder="이미지 URL" value={newPost.image_url}
              onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })} style={styles.input} />

            <div style={styles.buttonRow}>
              <button onClick={handleAddPost} style={styles.submitButton}>작성 완료</button>
              <button onClick={() => setShowForm(false)} style={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.postList}>
        {filteredPosts.map((post) => (
          <div key={post.post_id} style={styles.postItem}>
            <div style={styles.postTitle} onClick={() => navigate(`/posts/${post.post_id}`)}>
              {post.title}
            </div>
            <div style={styles.postContent}>{post.content}</div>
            {post.image_url && <img src={post.image_url} alt="첨부이미지" style={styles.postImage} />}
            <div style={styles.metaInfo}>
              <span>작성자: {post.author_nickname || post.author_id}</span>
              <span>{post.created_at}</span>
              <span>❤️ {post.like_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', fontFamily: "'Segoe UI','Noto Sans KR',sans-serif", backgroundColor: '#f9f9f9', minHeight: '100vh' },
  title: { fontSize: '2rem', marginBottom: '1.5rem', color: '#333' },
  tabContainer: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  tab: { padding: '0.7rem 2rem', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer', fontSize: '1rem' },
  activeTab: { padding: '0.7rem 2rem', borderRadius: '10px', border: '1px solid #007bff', backgroundColor: '#007bff', color: 'white', fontSize: '1rem', cursor: 'pointer' },
  writeButton: { padding: '0.7rem 2rem', borderRadius: '10px', backgroundColor: '#28a745', color: 'white', fontSize: '1rem', cursor: 'pointer', border: 'none' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  form: { backgroundColor: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ccc' },
  textarea: { padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '100px' },
  buttonRow: { display: 'flex', justifyContent: 'space-between' },
  submitButton: { padding: '0.7rem 1rem', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' },
  cancelButton: { padding: '0.7rem 1rem', borderRadius: '8px', backgroundColor: '#ccc', color: '#333', border: 'none', cursor: 'pointer' },
  postList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  postItem: { backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  postTitle: { fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' },
  postContent: { color: '#555', marginBottom: '0.5rem' },
  postImage: { width: '100%', borderRadius: '10px', marginBottom: '0.5rem' },
  likeDeleteBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  likeButton: { backgroundColor: '#ff6b81', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' },
  deleteButton: { backgroundColor: '#aaa', color: 'white', border: 'none', padding: '0.5rem 0.7rem', borderRadius: '20px', cursor: 'pointer' },
  searchInput: { padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', width: '300px' },
};
