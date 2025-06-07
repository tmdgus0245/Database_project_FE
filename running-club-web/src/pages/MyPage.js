import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

const MyPage = () => {
    const { id } = useParams();
    const backend = 'http://172.21.81.147:5000';
    const userId = id || 1;

    const selectRef = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [nickname, setNickname] = useState('');
    const [region, setRegion] = useState('');
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [crews, setCrews] = useState([]);
    const [eventLogs, setEventLogs] = useState([]);
    const [runLogs, setRunLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [newDate, setNewDate] = useState('');
    const [newDistance, setNewDistance] = useState('');
    const [newDuration, setNewDuration] = useState('');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [joinedAt, setJoinedAt] = useState('');
    const [events, setEvents] = useState([]);
    const eventOptions = (events || []).map(event => ({
        value: event.event_id,
        label: event.title
    }));

    const navigate = useNavigate();

    const fetchRunLogs = useCallback(async () => {
        try {
            const res = await axios.get(`${backend}/api/users/${userId}/user_run_log`);
            setRunLogs(res.data);
        } catch (err) {
            console.error("Run logs fetch error", err);
        }
    }, [backend, userId]);

    const fetchEventRunLogs = useCallback(async () => {
        try {
            const res = await axios.get(`${backend}/api/users/${userId}/events_run_log`);
            setEventLogs(res.data.event_logs);
        } catch (err) {
            console.error("이벤트 러닝 기록 조회 실패", err);
        }
    }, [backend, userId]);

    const fetchEvents = useCallback(async () => {
        try {
            const res = await axios.get(`${backend}/api/events/all`);
            console.log("이벤트 데이터:", res.data);
            setEvents(res.data.data);
        } catch (err) {
            console.error("이벤트 목록 불러오기 실패", err);
        }
    }, [backend]);

    useEffect(() => {
        if (!userId) return;

        if (activeTab === 'events') {
            fetchEvents();
        }

        if (selectRef.current && selectRef.current.focus) {
            const originalFocus = selectRef.current.focus;
            selectRef.current.focus = (opts) => {
                originalFocus({ ...opts, preventScroll: true });
            };
        }

        const fetchUserData = async () => {
            const res = await axios.get(`${backend}/api/users/${userId}`);
            setNickname(res.data.nickname);
            setRegion(res.data.region);
            setPosts(res.data.posts);
            setLikedPosts(res.data.liked_posts);
            setCrews(res.data.joined_crew);
        };

        fetchUserData();
        fetchEventRunLogs();
        fetchRunLogs();
    }, [userId, fetchRunLogs, fetchEventRunLogs, activeTab, fetchEvents]);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
    };

    const thtdStyle = {
        padding: '12px 15px',
        borderBottom: '1px solid #ddd',
        textAlign: 'center'
    };

    const handleAddRunLog = async () => {
        if (!newDate || !newDistance || !newDuration) {
            alert("날짜, 거리, 시간은 필수입니다.");
            return;
        }

        const distanceNum = parseFloat(newDistance);
        const durationNum = parseFloat(newDuration);

        if (distanceNum <= 0 || durationNum <= 0) {
            alert("거리와 시간은 양수여야 합니다.");
            return;
        }

        const pace = (durationNum / distanceNum).toFixed(2);  // 페이스 계산

        try {
            await axios.post(`${backend}/api/users/${userId}/user_run_log`, {
                date: newDate,
                distance_km: distanceNum,
                duration_min: durationNum,
                pace: pace
            });
            alert("기록이 추가되었습니다.");
            fetchRunLogs();
            setNewDate('');
            setNewDistance('');
            setNewDuration('');
        } catch (err) {
            alert("추가 실패");
        }
    };

    const handleDeleteRunLog = async (log_id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`${backend}/api/users/${userId}/user_run_log/${log_id}`);
            alert("삭제 완료");
            fetchRunLogs();
        } catch (err) {
            alert("삭제 실패");
        }
    };

    const handleAddEventRunLog = async () => {
        if (!selectedEventId || !joinedAt || !newDistance || !newDuration) {
            alert("모든 값을 입력해주세요.");
            return;
        }

        const distanceNum = parseFloat(newDistance);
        const durationNum = parseFloat(newDuration);

        if (distanceNum <= 0 || durationNum <= 0) {
            alert("거리와 시간은 양수여야 합니다.");
            return;
        }

        try {
            await axios.post(`${backend}/api/users/${userId}/events_run_log`, {
                event_id: selectedEventId,
                distance_km: distanceNum,
                duration_min: durationNum,
                joined_at: joinedAt
            });
            alert("행사 러닝 기록 추가 완료");
            fetchEventRunLogs();
            setSelectedEventId('');
            setJoinedAt('');
            setNewDistance('');
            setNewDuration('');
        } catch (err) {
            alert("추가 실패");
        }
    };

    const handleDeleteEventRunLog = async (log_id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`${backend}/api/users/${userId}/events_run_log/${log_id}`);
            alert("삭제 완료");
            fetchEventRunLogs();
        } catch (err) {
            alert("삭제 실패");
            console.error(err);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial' }}>
            {/* 헤더 */}
            <div style={{ background: '#333', color: '#fff', padding: '20px', fontSize: '24px' }}>
                마이페이지
            </div>

            {/* 유저 정보 수정 */}
            <div style={{ background: '#fff', padding: '20px', margin: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h2>내 정보</h2>

                {/* 수정모드 여부에 따라 분기 */}
                {editMode ? (
                    <>
                        <div style={{ marginBottom: '10px' }}>
                            닉네임: <input value={nickname} onChange={e => setNickname(e.target.value)} style={{ padding: '5px' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            지역: <input value={region} onChange={e => setRegion(e.target.value)} style={{ padding: '5px' }} />
                        </div>
                        <button onClick={async () => {
                            try {
                                await axios.patch(`${backend}/api/users/${userId}`, { nickname, region });
                                alert("수정 완료");
                                setEditMode(false);
                            } catch (err) {
                                alert("수정 실패");
                            }
                        }} style={{ padding: '8px 16px', marginRight: '10px' }}>저장</button>
                        <button onClick={() => setEditMode(false)} style={{ padding: '8px 16px' }}>취소</button>
                    </>
                ) : (
                    <>
                        <div style={{ marginBottom: '10px' }}>닉네임: {nickname}</div>
                        <div style={{ marginBottom: '10px' }}>지역: {region}</div>
                        <button onClick={() => setEditMode(true)} style={{ padding: '8px 16px' }}>수정</button>
                    </>
                )}
            </div>
            {/* 탭 */}
            <div style={{ display: 'flex', margin: '20px' }}>
                {['posts', 'liked', 'crews', 'events', 'runs'].map(tab => (
                    <div key={tab}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            background: activeTab === tab ? '#333' : '#fff',
                            color: activeTab === tab ? '#fff' : '#333',
                            marginRight: '10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => setActiveTab(tab)}>
                        {{
                            posts: '작성한 게시글',
                            liked: '좋아요한 게시글',
                            crews: '가입한 크루',
                            events: '행사 러닝 기록',
                            runs: '개인 러닝 기록'
                        }[tab]}
                    </div>
                ))}
            </div>

            {/* 컨텐츠 */}
            <div style={{ background: '#fff', margin: '20px', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                {activeTab === 'posts' && (
                    <>
                        <h3>작성한 게시글</h3>
                        <div style={styles.postList}>
                            {posts.map(post => (
                                <div key={post.post_id} style={styles.postItem}>
                                    <div style={styles.postTitle} onClick={() => navigate(`/posts/${post.post_id}`)}>
                                        {post.title}
                                    </div>
                                    {/* content, image_url 은 본문에 존재하는 경우만 표시 */}
                                    {post.content && <div style={styles.postContent}>{post.content}</div>}
                                    {post.image_url && <img src={post.image_url} alt="첨부이미지" style={styles.postImage} />}
                                    <div style={styles.metaInfo}>
                                        <span>작성일: {post.created_at}</span>
                                        <span>❤️ {post.like_count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'liked' && (
                    <>
                        <h3>좋아요한 게시글</h3>
                        <div style={styles.postList}>
                            {likedPosts.map(post => (
                                <div key={post.post_id} style={styles.postItem}>
                                    <div style={styles.postTitle} onClick={() => navigate(`/posts/${post.post_id}`)}>
                                        {post.title}
                                    </div>
                                    {post.content && <div style={styles.postContent}>{post.content}</div>}
                                    {post.image_url && <img src={post.image_url} alt="첨부이미지" style={styles.postImage} />}
                                    <div style={styles.metaInfo}>
                                        <span>작성일: {post.created_at}</span>
                                        <span>❤️ {post.like_count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'crews' && (
                    <>
                        <h3>가입한 크루</h3>
                        <table style={tableStyle}><thead><tr>
                            <th style={thtdStyle}>크루명</th>
                            <th style={thtdStyle}>지역</th></tr></thead><tbody>
                                {crews.map(crew => (
                                    <tr key={crew.crew_id}>
                                        <td style={{ ...thtdStyle, color: 'black', cursor: 'pointer' }}
                                            onClick={() => navigate(`/crew/${crew.crew_id}`)}>
                                            {crew.name}
                                        </td>
                                        <td style={thtdStyle}>{crew.region}</td>
                                    </tr>
                                ))}
                            </tbody></table>
                    </>
                )}

                {activeTab === 'events' && (
                    <>
                        <h3>행사 러닝 기록</h3>

                        <div style={{
                            marginBottom: '20px',
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <div style={{ flex: '2' }}>
                                <Select
                                    ref={selectRef}
                                    options={eventOptions}
                                    value={eventOptions.find(option => option.value === selectedEventId)}
                                    onChange={option => setSelectedEventId(option.value)}
                                    placeholder="행사 선택"
                                    isSearchable={true}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"   // <-- 추가
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    menuShouldScrollIntoView={false}
                                />
                            </div>
                            <input
                                type="date"
                                value={joinedAt}
                                onChange={e => setJoinedAt(e.target.value)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    flex: '1'
                                }}
                            />
                            <input
                                placeholder="거리(km)"
                                value={newDistance}
                                onChange={e => setNewDistance(e.target.value)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    flex: '1'
                                }}
                            />
                            <input
                                placeholder="시간(min)"
                                value={newDuration}
                                onChange={e => setNewDuration(e.target.value)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    flex: '1'
                                }}
                            />
                            <button onClick={handleAddEventRunLog} style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#007bff',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>
                                추가
                            </button>
                        </div>

                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thtdStyle}>행사명</th>
                                    <th style={thtdStyle}>행사일</th>
                                    <th style={thtdStyle}>거리</th>
                                    <th style={thtdStyle}>시간</th>
                                    <th style={thtdStyle}>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventLogs.map((log, idx) => (
                                    <tr key={idx}>
                                        <td style={thtdStyle}>{log.event_title}</td>
                                        <td style={thtdStyle}>{log.event_date}</td>
                                        <td style={thtdStyle}>{log.distance_km}</td>
                                        <td style={thtdStyle}>{log.duration_min}</td>
                                        <td style={thtdStyle}>
                                            <button onClick={() => handleDeleteEventRunLog(log.event_log_id)}>삭제</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {activeTab === 'runs' && (
                    <>
                        <h3>개인 러닝 기록</h3>

                        <div style={{
                            marginBottom: '20px',
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center'
                        }}>
                            <input
                                type="date"
                                value={newDate}
                                onChange={e => setNewDate(e.target.value)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    flex: '1'
                                }}
                            />
                            <input
                                placeholder="거리(km)"
                                value={newDistance}
                                onChange={e => setNewDistance(e.target.value)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    flex: '1'
                                }}
                            />
                            <input
                                placeholder="시간(min)"
                                value={newDuration}
                                onChange={e => setNewDuration(e.target.value)}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    flex: '1'
                                }}
                            />
                            <button onClick={handleAddRunLog} style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#007bff',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>
                                추가
                            </button>
                        </div>

                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thtdStyle}>날짜</th>
                                    <th style={thtdStyle}>거리</th>
                                    <th style={thtdStyle}>시간</th>
                                    <th style={thtdStyle}>페이스</th>
                                    <th style={thtdStyle}>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {runLogs.map((log) => (
                                    <tr key={log.log_id}>
                                        <td style={thtdStyle}>{log.date}</td>
                                        <td style={thtdStyle}>{log.distance_km}</td>
                                        <td style={thtdStyle}>{log.duration_min}</td>
                                        <td style={thtdStyle}>{log.pace}</td>
                                        <td style={thtdStyle}>
                                            <button onClick={() => handleDeleteRunLog(log.log_id)}>삭제</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    )
}

const styles = {
    postList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '20px'
    },
    postItem: {
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    postTitle: {
        fontWeight: 'bold',
        fontSize: '18px',
        marginBottom: '8px',
        cursor: 'pointer'
    },
    postContent: {
        marginBottom: '8px',
        fontSize: '15px',
        color: '#333'
    },
    postImage: {
        maxWidth: '100%',
        borderRadius: '8px',
        marginBottom: '8px'
    },
    metaInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
        color: '#777'
    }
}

export default MyPage;