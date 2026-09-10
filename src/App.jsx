import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import CraverHomePage from './pages/CraverHomePage.jsx'
import CraverProfilePage from './pages/CraverProfilePage.jsx'
import CookProfilePage from './pages/CookProfilePage.jsx'
import ChatDrawer from './components/chat/ChatDrawer.jsx'
import DemoRoleSwitcher from './components/layout/DemoRoleSwitcher.jsx'
import { useBeity } from './store/BeityContext.jsx'

/** No auth in this build — routes just check which demo role is active. */
function Require({ role, children }) {
  const { session } = useBeity()
  if (!session.role) return <Navigate to="/" replace />
  if (role && session.role !== role) return <Navigate to={session.role === 'cook' ? '/cook' : '/craver'} replace />
  return children
}

export default function App() {
  const { lang } = useBeity()

  return (
    <div className={lang === 'ar' ? 'font-arabic text-right' : ''}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/craver"
          element={
            <Require role="craver">
              <CraverHomePage />
            </Require>
          }
        />
        <Route
          path="/craver/profile"
          element={
            <Require role="craver">
              <CraverProfilePage />
            </Require>
          }
        />

        <Route
          path="/cook"
          element={
            <Require role="cook">
              <CookProfilePage mode="owner" />
            </Require>
          }
        />

        {/* Public kitchen page — centre column only, no dashboard controls. */}
        <Route
          path="/cooks/:cookId"
          element={
            <Require>
              <CookProfilePage mode="public" />
            </Require>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ChatDrawer />
      <DemoRoleSwitcher />
    </div>
  )
}
