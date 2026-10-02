import { Routes, Route } from 'react-router-dom'
import MainPage from '@/components/mainPage/MainPage'
import { AppLayout } from './AppLayout'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<MainPage />} />
        {/* <Route path="/cats/:catId" element={<CatPage />} /> */}
        {/* <Route path="/cats/:catId/help" element={<HelpPage />} /> */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
      </Route>

      {/* <Route path="/profile" element={<ProfilePage />} />  */}
    </Routes>
  )
}

export default App
