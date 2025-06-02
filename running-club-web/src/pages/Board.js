import React, { useState } from 'react';

export default function Board() {
  const [category, setCategory] = useState('course');
  const [coursePosts, setCoursePosts] = useState([]);
  const [runningPosts, setRunningPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null });
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // 🔥 검색어 상태 추가

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, image: URL.createObjectURL(file) });
    }
  };

  const handleAddPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post = { ...newPost, image: newPost.image || null };

    if (category === 'course') {
      setCoursePosts([...coursePosts, post]);
    } else {
      setRunningPosts([...runningPosts, post]);
    }

    setNewPost({ title: '', content: '', image: null });
    setShowForm(false);
  };

  const handleLike = (index) => {
    const key = `${category}-${index}`;
    setLikes({ ...likes, [key]: (likes[key] || 0) + 1 });
  };

  const handleAddComment = (index) => {
    const key = `${category}-${index}`;
    const currentComments = comments[key] || [];
    const commentText = commentInputs[key] || "";
    if (!commentText.trim()) return;

    setComments({ ...comments, [key]: [...currentComments, commentText] });
    setCommentInputs({ ...commentInputs, [key]: '' });
  };

  const posts = category === 'course' ? coursePosts : runningPosts;

  // 🔥 검색 필터링 적용
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {category === 'course' ? '🗺️ 코스 추천 게시판' : '🏅 런닝 자랑 게시판'}
      </h1>

      <div style={styles.tabContainer}>
        <button style={category === 'course' ? styles.activeTab : styles.tab} onClick={() => setCategory('course')}>🗺️ 코스 추천</button>
        <button style={category === 'running' ? styles.activeTab : styles.tab} onClick={() => setCategory('running')}>🏅 런닝 자랑</button>
        <button style={styles.writeButton} onClick={() => setShowForm(true)}>+ 작성</button>
      </div>

      {/* 🔥 검색창 추가 */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="제목 또는 내용을 검색하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* 작성 모달 */}
      {showForm && (
        <div style={styles.modal}>
          <div style={styles.form}>
            <h3>게시글 작성</h3>
            <input type="text" placeholder="제목" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} style={styles.input} />
            <textarea placeholder="내용" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} style={styles.textarea} />
            <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
            {newPost.image && <img src={newPost.image} alt="preview" style={styles.imagePreview} />}
            <div style={styles.buttonRow}>
              <button onClick={handleAddPost} style={styles.submitButton}>작성 완료</button>
              <button onClick={() => setShowForm(false)} style={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 게시글 리스트 (검색 적용됨) */}
      <div style={styles.postList}>
        {filteredPosts.map((post, index) => {
          const key = `${category}-${index}`;
          return (
            <div key={index} style={styles.postItem}>
              <div style={styles.postTitle}>{post.title}</div>
              <div style={styles.postContent}>{post.content}</div>
              {post.image && <img src={post.image} alt="첨부이미지" style={styles.postImage} />}

              <div style={styles.likeContainer}>
                <button onClick={() => handleLike(index)} style={styles.likeButton}>❤️ 좋아요 {likes[key] || 0}</button>
              </div>

              <div style={styles.commentSection}>
                <input
                  type="text"
                  placeholder="댓글 작성"
                  value={commentInputs[key] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [key]: e.target.value })}
                  style={styles.commentInput}
                />
                <button onClick={() => handleAddComment(index)} style={styles.commentButton}>작성</button>
                <div style={styles.commentList}>
                  {(comments[key] || []).map((cmt, cIdx) => (
                    <div key={cIdx} style={styles.commentItem}>{cmt}</div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
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
  fileInput: { fontSize: '1rem' },
  imagePreview: { width: '100%', borderRadius: '10px' },
  buttonRow: { display: 'flex', justifyContent: 'space-between' },
  submitButton: { padding: '0.7rem 1rem', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' },
  cancelButton: { padding: '0.7rem 1rem', borderRadius: '8px', backgroundColor: '#ccc', color: '#333', border: 'none', cursor: 'pointer' },
  postList: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  postItem: { backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  postTitle: { fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' },
  postContent: { color: '#555', marginBottom: '0.5rem' },
  postImage: { width: '100%', borderRadius: '10px', marginBottom: '0.5rem' },
  likeContainer: { marginBottom: '1rem' },
  likeButton: { backgroundColor: '#ff6b81', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' },
  commentSection: { marginTop: '1rem' },
  commentInput: { padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', width: '80%', marginRight: '0.5rem' },
  commentButton: { padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' },
  commentList: { marginTop: '0.5rem' },
  commentItem: { backgroundColor: '#f1f1f1', padding: '0.5rem', borderRadius: '5px', marginBottom: '0.3rem' },
  searchInput: {
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    width: '300px',
  },
};
