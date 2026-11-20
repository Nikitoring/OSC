import OscButton from '@/components/shared/ui/buttons/Button'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import { Eye, EyeOff, User } from 'lucide-react'
import { useState } from 'react'
import { useCheckLoginAvailability, useRegisterUser } from '@/features/auth/queries/auth.queries'
import { useLocation, useNavigate } from 'react-router-dom'
import userState from '@/stores/userStore/userState'

const RegisterForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setUser = userState((state) => state.setUser)
  const registerMutation = useRegisterUser()
  const availabilityMutation = useCheckLoginAvailability()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' })
  const [loginAvailability, setLoginAvailability] = useState<'unknown' | 'available' | 'taken'>(
    'unknown',
  )
  const [passwordError, setPasswordError] = useState('')
  const returnTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'username') setLoginAvailability('unknown')
    if (name === 'password' || name === 'confirmPassword') setPasswordError('')
  }

  const checkLogin = async (): Promise<boolean | null> => {
    const login = formData.username.trim()
    if (login.length < 3) {
      setLoginAvailability('unknown')
      return null
    }
    try {
      const result = await availabilityMutation.mutateAsync(login)
      setLoginAvailability(result.available ? 'available' : 'taken')
      return result.available
    } catch {
      setLoginAvailability('unknown')
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.password.length < 8) {
      setPasswordError('Пароль должен содержать минимум 8 символов')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Пароли не совпадают')
      return
    }
    if (loginAvailability === 'taken') return
    if (loginAvailability !== 'available' && !(await checkLogin())) return
    try {
      const result = await registerMutation.mutateAsync({
        login: formData.username.trim(),
        password: formData.password,
      })
      setUser({ userId: result.user.id, username: result.user.username })
      navigate(returnTo, { replace: true })
    } catch {
      // В том числе показываем конфликт, если логин заняли после проверки.
    }
  }

  return (
    <div className="login-form">
      <h2>Зарегистрироваться</h2>
      <form onSubmit={handleSubmit}>
        <div className="osc-mb-3">
          <TextInput
            label="Имя пользователя"
            id="username"
            name="username"
            placeholder="Введите имя пользователя"
            prefix={<User />}
            value={formData.username}
            onChange={handleInputChange}
            onBlur={checkLogin}
            autoComplete="username"
            minLength={3}
            maxLength={100}
            required
          />
          {loginAvailability === 'taken' && (
            <p role="alert" className="osc-my-0 osc-text-orange osc-text-sm">
              Этот логин уже занят
            </p>
          )}
        </div>
        <div className="osc-mb-3">
          <TextInput
            label="Пароль"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Введите пароль (минимум 8 символов)"

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
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <div className="osc-mb-3">
          <TextInput
            label="Повторите пароль"
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Введите пароль еще раз"

            suffix={
              <OscButton
                variant="transparent"
                size="small"
                className="osc-button-icon-only password-toggle"
                type="button"
                aria-label={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}
                aria-pressed={showConfirmPassword}
                onClick={() => setShowConfirmPassword((shown) => !shown)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </OscButton>
            }
            value={formData.confirmPassword}
            onChange={handleInputChange}
            autoComplete="new-password"
            required
          />
        </div>
        {passwordError && (
          <p role="alert" className="osc-my-0 osc-text-orange osc-text-sm">
            {passwordError}
          </p>
        )}
        {registerMutation.error && (
          <p role="alert" className="osc-my-0 osc-text-orange osc-text-sm">
            {registerMutation.error.message}
          </p>
        )}
        <OscButton
          type="submit"
          className="osc-mt-3"
          disabled={registerMutation.isPending || availabilityMutation.isPending}
        >
          {registerMutation.isPending ? 'Регистрируем…' : 'Зарегистрироваться'}
        </OscButton>
      </form>
    </div>
  )
}

export default RegisterForm
