import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import './App.css'

import Home from './templates/home/Home';
import AdminDashboard from './templates/admin';
import TestDashboard from './templates/examples/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/test" element={<TestDashboard />} />
      </Routes>
    </Router>
  )
}

export default App;