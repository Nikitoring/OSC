import { Routes, Route } from 'react-router-dom'
import MainPage from '@/pages/main/MainPage'
import { AppLayout } from './mainLayout/AppLayout'
import { AdditionalLayout } from './additionalLayout/AdditionalLayout'
import AuthPage from '@/pages/auth/AuthPage'
import AuthAside from '@/pages/auth/AuthAside'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<MainPage />} />
      </Route>
      <Route element={<AdditionalLayout aside={<AuthAside />} />}>
        <Route path="/login" element={<AuthPage />} />
      </Route>
      {/* <Route path="/profile" element={<ProfilePage />} />  */}
    </Routes>
  )
}

export default App
