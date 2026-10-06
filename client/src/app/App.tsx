import { Routes, Route } from 'react-router-dom'
import MainPage from '@/pages/main/MainPage'
import { AppLayout } from './mainLayout/AppLayout'
import { AdditionalLayout } from './additionalLayout/AdditionalLayout'
import AuthPage from '@/pages/auth/AuthPage'
import AuthAside from '@/pages/auth/AuthAside'
import userState from '@/stores/userStore/userState'
import { useEffect } from 'react'
import CatSpinner from '@/components/shared/ui/loaders/CatSpinner'
import MapPage from '@/pages/map/MapPage'

function App() {
  useEffect(() => {
    userState.getState().getUser()
  }, [])
  const isLoading = userState((state) => state.isLoading)
  const isInitialized = userState((state) => state.isInitialized)

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
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<MapPage />} />
      </Route>
      <Route element={<AdditionalLayout aside={<AuthAside />} />}>
        <Route path="/login" element={<AuthPage />} />
      </Route>
      {/* <Route path="/profile" element={<ProfilePage />} />  */}
    </Routes>
  )
}

export default App
