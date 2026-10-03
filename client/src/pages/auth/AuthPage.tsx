import styles from './authPage.module.css'
import OscTabs from '../../components/shared/ui/tabs/Tabs'
import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const AuthPage = () => {
  const tabs = [
    { label: 'Вход', id: 'login' },
    { label: 'Регистрация', id: 'register' },
  ]
  const [activeTab, setActiveTab] = useState<string | null>(tabs[0].id)

  return (
    <div className={styles.page}>
      <section className={`${styles['content-section']} osc-my-3`}>
        <OscTabs items={tabs} onChange={setActiveTab} style={{ width: '100%' }}></OscTabs>
        <div className="osc-mt-4" style={{ width: '100%' }}>
          {activeTab === 'login' && <LoginForm />}
          {activeTab === 'register' && <RegisterForm />}
        </div>
      </section>
    </div>
  )
}

export default AuthPage
