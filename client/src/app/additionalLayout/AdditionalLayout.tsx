import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

type Props = {
  children: ReactNode
}

export function AdditionalLayout({ aside }: Props) {
  return (
    <div className="osc-app-layout">
      <aside>{aside}</aside>

      <main className="osc-app-main">
        <Outlet />
      </main>
    </div>
  )
}
