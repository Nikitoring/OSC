import { Routes, Route, useLocation } from 'react-router-dom'
import MainPage from '@/pages/main/MainPage'
import { AppLayout } from './mainLayout/AppLayout'
import { AdditionalLayout } from './additionalLayout/AdditionalLayout'
import AuthPage from '@/pages/auth/AuthPage'
import AuthAside from '@/pages/auth/AuthAside'
import userState from '@/stores/userStore/userState'
import { useEffect } from 'react'
import CatSpinner from '@/components/shared/ui/loaders/CatSpinner'
import MapPage from '@/pages/map/MapPage'
import CatPage from '@/pages/cat/CatPage'
import { MobileBottomNavigation } from '@/components/shared/mobileBottomNavigation/MobileBottomNavigation'

function App() {
  useEffect(() => {
    userState.getState().getUser()
  }, [])
  const isLoading = userState((state) => state.isLoading)
  const isInitialized = userState((state) => state.isInitialized)
  const user = userState((state) => state.user)
  const isAuthenticated = Boolean(user)
  const location = useLocation()
  const excludedHeaderRoutes = ['/map'].includes(location.pathname)
  if (isLoading || !isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '24px',
        }}
      >
        <CatSpinner size="large" speed="normal"></CatSpinner>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route element={<AppLayout isHeader={!excludedHeaderRoutes} />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/cats/:id" element={<CatPage />} />
        </Route>
        <Route element={<AdditionalLayout aside={<AuthAside />} />}>
          <Route path="/login" element={<AuthPage />} />
        </Route>
        {/* <Route path="/profile" element={<ProfilePage />} />  */}
      </Routes>
      <MobileBottomNavigation isAuthenticated={isAuthenticated} />
    </>
  )
}

export default App
