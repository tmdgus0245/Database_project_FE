import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Board from './pages/Board';
import Events from './pages/Events';
import Crew from './pages/Crew';
import MyPage from './pages/MyPage';
import CrewRunlog from './pages/CrewRunlog';
import CrewMembers from './pages/CrewMembers';
import CrewSchedule from './pages/CrewSchedule';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/board" element={<Board />} />
        <Route path="/events" element={<Events />} />
        <Route path="/crew/:id" element={<Crew />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/:id" element={<MyPage />} />
        <Route path="/crew/:id/runlog" element={<CrewRunlog />} />
        <Route path="/crew/:id" element={<Crew />} />
        <Route path="/crew/:id/members" element={<CrewMembers />} />
        <Route path="/crew/:id/schedule" element={<CrewSchedule />} />
        <Route path="/posts/:post_id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
