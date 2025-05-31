import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Board from './pages/Board';
import Events from './pages/Events';
import CrewList from './pages/CrewList';
import Crew from './pages/Crew';
import MyRunning from './pages/MyRunning';
import CrewRunlog from './pages/CrewRunlog'; 
import CrewMembers from './pages/CrewMembers';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/board" element={<Board />} />
        <Route path="/events" element={<Events />} />
        <Route path="/crewlist" element={<CrewList />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/myrunning" element={<MyRunning />} />
        <Route path="/crew/runlog" element={<CrewRunlog />} />
        <Route path="/crew/members" element={<CrewMembers />} />
      </Routes>
    </Router>
  );
}

export default App;
