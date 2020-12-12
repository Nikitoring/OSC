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
        type: 'password',
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
  registration: [
    {
      component: Input,
      props: {
        inputId: 'email',
        inputLabel: 'Email',
        rules: [emailValidator(), requiredValidator()]
      },
    },
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
        type: 'password',
        rules: [requiredValidator()]
      },
    },
    {
      component: Input,
      props: {
        inputId: 'confirmPassword',
        inputLabel: 'Confirm password',
        type: 'password',
        rules: [requiredValidator()]
      },
    },
    {
      component: Submit,
      props: {
        label: 'REGISTRATION'
      },
    },
  ],
}
