import { useState } from 'react';
import axios from 'axios';
import './auth.css';

function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/login', { email, password });
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
            onLogin();
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
            <form onSubmit={handleSubmit}>
                <h3>Login</h3>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p>Don't have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onSwitchToRegister}>Register here</span></p>
            </form>
        </div>
    </div >
  );
}

export default Login;

