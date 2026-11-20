import { Eye, EyeOff, User } from 'lucide-react'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import OscButton from '@/components/shared/ui/buttons/Button'
import { useState } from 'react'
import { useLoginUser } from '@/features/auth/queries/auth.queries'
import { useLocation, useNavigate } from 'react-router-dom'
import userState from '@/stores/userStore/userState'

const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setUser = userState((state) => state.setUser)
  const loginMutation = useLoginUser()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ login: '', password: '' })
  const returnTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const result = await loginMutation.mutateAsync(formData)
      setUser({ userId: result.user.id, username: result.user.username })
      navigate(returnTo, { replace: true })
    } catch {
      // Ошибка показана рядом с формой.
    }
  }

  return (
    <div className="login-form">
      <h2>Войти в аккаунт</h2>
      <form onSubmit={handleSubmit}>
        <div className="osc-mb-3">
          <TextInput
            label="Имя пользователя"
            id="login"
            name="login"
            placeholder="Введите имя пользователя"
            prefix={<User />}
            value={formData.login}
            onChange={handleInputChange}
            autoComplete="username"
            required
          />
        </div>
        <div className="osc-mb-3">
          <TextInput
            label="Пароль"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Введите пароль"
            suffix={
              <OscButton
                variant="transparent"
                size="small"
                className="osc-button-icon-only password-toggle"
                type="button"
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((shown) => !shown)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </OscButton>
            }
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="current-password"
            required
          />
        </div>
        {loginMutation.error && (
          <p role="alert" className="osc-my-0 osc-text-orange osc-text-sm">
            {loginMutation.error.message || 'Неверный логин или пароль'}
          </p>
        )}
        <OscButton type="submit" className="osc-mt-3" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Входим…' : 'Войти'}
        </OscButton>
      </form>
    </div>
  )
}

export default LoginForm
