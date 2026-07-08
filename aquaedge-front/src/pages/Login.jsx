import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Droplets } from 'lucide-react'
import { useAuth } from '../contexts/useAuth'
import { getApiErrorMessage } from '../utils/apiResponse'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@aquaedge.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (loginError) {
      setError(getApiErrorMessage(loginError) || 'Credenciales inválidas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card__brand">
          <span>
            <Droplets size={28} />
          </span>
          <div>
            <strong>AquaEdge</strong>
            <small>Administracion de riego inteligente</small>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="operador@aquaedge.io"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Tu password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error ? <div className="feedback feedback--error">{error}</div> : null}

        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </main>
  )
}

export default Login
