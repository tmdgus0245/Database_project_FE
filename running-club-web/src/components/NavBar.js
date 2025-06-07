import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const navStyle = {
    padding: "1rem",
    backgroundColor: "#333",
    color: "white",
    display: "flex",
    gap: "1rem",
  };

  return (
    <div style={navStyle}>
      <Link to="/" style={{ color: "white" }}>Home</Link>
      <Link to="/explore" style={{ color: "white" }}>탐색</Link>
      <Link to="/board" style={{ color: "white" }}>게시판</Link>
      <Link to="/events" style={{ color: "white" }}>체육행사정보</Link>
      <Link to="/mypage" style={{ color: "white" }}>마이페이지</Link>
    </div>
  );
}
