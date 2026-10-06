import { Outlet } from 'react-router-dom'

import Sidebar from '@/components/shared/leftAsideModule/Sidebar'
import MainHeader from '@/components/shared/header/Header'

export function AppLayout({ isHeader = true }) {
  return (
    <div className="osc-app-layout">
      <Sidebar />

      <main className="osc-app-main">
        {isHeader && <MainHeader />}
        <Outlet />
      </main>
    </div>
  )
}
