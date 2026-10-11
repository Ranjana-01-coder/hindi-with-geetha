import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import { AuthProvider, Protected } from './auth'
import Login from '../src/Login'
import App from '../src/App'
import StudentPortal from '../src/studentportal'
import TeacherDashboard from '../src/TeacherDashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/app" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/portal"
          element={
            <Protected role="student">
              <StudentPortal />
            </Protected>
          }
        />
        <Route
          path="/teacher"
          element={
            <Protected role="teacher">
              <TeacherDashboard />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
