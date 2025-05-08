import React from 'react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import './App.css'

import Home from './templates/home/Home';
import AdminDashboard from './templates/admin';
import UserDashboard from './templates/user';
import { SessionProvider } from './common/contexts/user/session-context';
import TokenProvider from './common/contexts/token-provider';

function App() {

  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={
              <Home />
          } />
          <Route path="/user-dashboard" element={
            <TokenProvider>
              <UserDashboard />
            </TokenProvider>
          } />
          <Route path="/admin-dashboard" element={
            <TokenProvider>
              <AdminDashboard />
            </TokenProvider>
          } />
        </Routes>
      </Router>
    </SessionProvider>
  )
}

export default App;