import React, { useState } from 'react';

export default function Board() {
  const [category, setCategory] = useState('course');
  const [coursePosts, setCoursePosts] = useState([]);
  const [runningPosts, setRunningPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null });
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {category === 'course' ? '🗺️ 코스 추천 게시판' : '🏅 런닝 자랑 게시판'}
      </h1>

      <div style={styles.tabContainer}>
        <button
          style={category === 'course' ? styles.activeTab : styles.tab}
          onClick={() => setCategory('course')}
        >
          🗺️ 코스 추천
        </button>
        <button
          style={category === 'running' ? styles.activeTab : styles.tab}
          onClick={() => setCategory('running')}
        >
          🏅 런닝 자랑
        </button>
      </div>

      {/* 작성 폼 */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="제목"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="내용"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          style={styles.textarea}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
        {newPost.image && <img src={newPost.image} alt="preview" style={styles.imagePreview} />}
        <button onClick={handleAddPost} style={styles.addButton}>작성</button>
      </div>

      {/* 게시글 리스트 */}
      <div style={styles.postList}>
        {posts.map((post, index) => {
          const key = `${category}-${index}`;
          return (
            <div key={index} style={styles.postItem}>
              <div style={styles.postTitle}>{post.title}</div>
              <div style={styles.postContent}>{post.content}</div>
              {post.image && <img src={post.image} alt="첨부이미지" style={styles.postImage} />}

              <div style={styles.likeContainer}>
                <button onClick={() => handleLike(index)} style={styles.likeButton}>
                  ❤️ 좋아요 {likes[key] || 0}
                </button>
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
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', 'Noto Sans KR', sans-serif",
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#333',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  tab: {
    padding: '0.7rem 2rem',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  activeTab: {
    padding: '0.7rem 2rem',
    borderRadius: '10px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto 3rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    minHeight: '100px',
  },
  fileInput: {
    fontSize: '1rem',
  },
  imagePreview: {
    width: '100%',
    borderRadius: '10px',
  },
  addButton: {
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  postList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  postItem: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  postTitle: {
    fontWeight: '600',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
  },
  postContent: {
    color: '#555',
    marginBottom: '0.5rem',
  },
  postImage: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '0.5rem',
  },
  likeContainer: {
    marginBottom: '1rem',
  },
  likeButton: {
    backgroundColor: '#ff6b81',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  commentSection: {
    marginTop: '1rem',
  },
  commentInput: {
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '80%',
    marginRight: '0.5rem',
  },
  commentButton: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  commentList: {
    marginTop: '0.5rem',
  },
  commentItem: {
    backgroundColor: '#f1f1f1',
    padding: '0.5rem',
    borderRadius: '5px',
    marginBottom: '0.3rem',
  },
};
