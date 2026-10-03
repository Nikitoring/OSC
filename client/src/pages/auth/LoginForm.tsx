import { User, Eye } from 'lucide-react'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import OscButton from '@/components/shared/ui/buttons/Button'
import { useState } from 'react'
import { useLoginUser } from '@/features/auth/queries/auth.queries'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const navigate = useNavigate()
  const loginMutation = useLoginUser()

  const [formData, setFormData] = useState({
    login: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await loginMutation.mutate(
      {
        login: formData.login,
        password: formData.password,
      },
      {
        onSuccess: () => {
          navigate('/')
        },
        onError: (error) => {
          console.error('Login failed:', error)
        },
      },
    )
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
          />
        </div>
        <div className="osc-mb-3">
          <TextInput
            label="Пароль"
            id="password"
            name="password"
            type="password"
            placeholder="Введите пароль"
            prefix={<Eye />}
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <OscButton type="submit" className="osc-mt-3">
          Войти
        </OscButton>
      </form>
    </div>
  )
}

export default LoginForm
