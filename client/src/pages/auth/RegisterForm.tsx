import OscButton from '@/components/shared/ui/buttons/Button'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import { Eye, User } from 'lucide-react'
import { useState } from 'react'
import { useRegisterUser } from '@/features/auth/queries/auth.queries'
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
  const navigate = useNavigate()
  const registerMutation = useRegisterUser()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
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
    await registerMutation.mutate(
      {
        login: formData.username,
        password: formData.password,
      },
      {
        onSuccess: () => {
          navigate('/')
        },
      },
    )
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
        <div className="osc-mb-3">
          <TextInput
            label="Повторите пароль"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Введите пароль еще раз"
            prefix={<Eye />}
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        <OscButton type="submit" className="osc-mt-3">
          Зарегистрироваться
        </OscButton>
      </form>
    </div>
  )
}

export default RegisterForm
