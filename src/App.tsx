import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ScrollToTop from './components/ScrollToTop'
import SiteLayout from './components/SiteLayout'
import AboutPage from './pages/AboutPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ContactPage from './pages/ContactPage'
import ExperiencePage from './pages/ExperiencePage'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
