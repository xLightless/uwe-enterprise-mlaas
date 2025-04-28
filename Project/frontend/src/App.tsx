import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'
import './App.css'

import Home from './templates/home/Home';
import AdminDashboard from './templates/admin';
import UserDashboard from './templates/user';
import TestDashboard from './templates/examples/dashboard';
import { JSX } from 'react';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/test" element={<TestDashboard />} />
      </Routes>
    </Router>
  )
}

export default App;