// import { connectUrl } from './connection.js'

// const validators = {
//    hasValue: (value) => value.length > 0 || 'Requied',

//   isChecked: (value) => value === true || 'Need checked',

//   minChar: (v, value) =>
//     v.length >= value || `Minimum symbols: ${value}`,
//   maxChar: (v, value) =>
//     v.length <= value || `Maximum symbols: ${value}`,

//   isNumber: (v) => !isNaN(v) || 'Only number',

//   // emailExist: async (value) => {
//   //   const response = await fetch(`${connectUrl}userdata?email=${value}`)
//   //   var body = await response.json()
//   //   return body.length === 0 || 'This email already taken'
//   // },

//   isEmail: (value) =>
//     /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
//       String(value).toLowerCase()
//     ) ||
//     'Please enter a valid email'
// }

// export default validators

function emailValidator () {
  return function email (value) {
    return (value && !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) || 'Please enter a valid email'
  }
}

function requiredValidator () {
  return function required (value) {
    return (value !== undefined && value !== null && value !== '') || 'This field is required'
  }
}

export {
  emailValidator,
  requiredValidator
}