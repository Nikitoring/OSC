import OpenStreetCatLogo from '../../../shared/assests/logo/open-street-cat-logo.svg?react'
import Navigation from './Navigation'
import './sidebar.css'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <OpenStreetCatLogo className="osc-ma-4" />
      <Navigation></Navigation>
      <img
        src="/illustrations/sidebar-footer.png"
        alt="sidebar-footer"
        width="120%"
        height="25%"
        style={{ marginTop: 'auto' }}
      />
    </aside>
  )
}

export default Sidebar
