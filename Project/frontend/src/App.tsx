import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './templates/home/Home'
import Nav from './components/navigation/Nav'
import Footer from './components/footer/Footer'
import Contact from './templates/contact/Contact'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Nav />

        <main className="flex-grow flex justify-center">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App