export interface UserRegistration {
  name: string
  surname: string
  last_name: string
  email: string
  number: string
  password: string
  repeat_password: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface User {
  Name: string
  Surname: string
  LastName: string
  Email: string
  Password: string
  Number: string
}
