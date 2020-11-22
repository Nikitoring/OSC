import Input from '../components/base/formElement/textInput.svelte'
import Submit from '../components/base/formElement/submit.svelte'
import { emailValidator, requiredValidator } from '../utils/validators'

export const formData = {
  login: [
    {
      component: Input,
      props: {
        inputId: 'username',
        inputLabel: 'Username',
        rules: [requiredValidator()]
      },
    },
    {
      component: Input,
      props: {
        inputId: 'password',
        inputLabel: 'Password',
        rules: [requiredValidator()]
      },
    },
    {
      component: Submit,
      props: {
        label: 'SIGN IN'
      },
    },
  ],
  register: [
    {
      component: Input,
      props: {
        inputId: 'username',
        inputLabel: 'Username',
      },
    },
    {
      component: Input,
      props: {
        inputId: 'password',
        inputLabel: 'Password',
      },
    },
    {
      component: Input,
      props: {
        inputId: 'confirmPassword',
        inputLabel: 'Confirm password',
      },
    },
    {
      component: Submit,
      props: {
        label: 'REGISTER',
        classes: 'color-primary',
      },
    },
  ],
}
