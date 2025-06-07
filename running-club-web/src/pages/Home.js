import React from 'react';
import runningImage from '../running.png';  // 경로 맞게 수정하세요!

export default function Home() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      backgroundImage: `url(${runningImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
      fontSize: "3rem",
      fontWeight: "bold"
    }}>
      Find Crew, RUN CREW
    </div>
  );
}
