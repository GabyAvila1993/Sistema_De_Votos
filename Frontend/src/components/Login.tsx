import { FormEvent, useState } from 'react'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Aquí se puede integrar la llamada al backend
    console.log('login', { username, password })
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="heading">Login</p>
          <p className="paragraph">Login to your account</p>

          <div className="input-group">
            <input
              required
              placeholder="Username"
              name="username"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username"
            />
          </div>

          <div className="input-group">
            <input
              required
              placeholder="Password"
              name="password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
          </div>

          <button type="submit">Login</button>

          <div className="bottom-text">
            <p>
              Don't have an account? <a href="#">Sign Up</a>
            </p>
            <p>
              <a href="#">Forgot password?</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
