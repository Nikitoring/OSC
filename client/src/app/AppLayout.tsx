import { Outlet } from 'react-router-dom'

import Sidebar from '@/components/shared/leftAsideModule/Sidebar'
import MainHeader from '@/components/shared/header/Header'

import './AppLayout.css'

export function AppLayout() {
  return (
    <div className="osc-app-layout">
      <Sidebar />

      <main className="osc-app-main">
        <MainHeader />
        <Outlet />
      </main>
    </div>
  )
}
