import { useState } from 'react';
import axios from 'axios';

function Register({ onRegister, onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('/api/register', { name, email, password });
            setSuccess(true);
            setError('');
            onRegister();
        } catch (err) {
            setError('Registration failed. Try a different email.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <form onSubmit={handleSubmit}>
                    <h3>Register</h3>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">Register</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>Registered successfully!</p>}
                    <p>Already have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onSwitchToLogin}>Login here</span></p>
                </form>
            </div>
        </div>
    );
}

export default Register;
