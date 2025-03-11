import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
// import Home from './templates/home/Home'
// import Nav from './components/navigation/Nav'
// import Footer from './components/footer/Footer'
// import Contact from './templates/contact/Contact'
import AdminDashboard from './templates/admin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App;