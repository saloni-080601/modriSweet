import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      action: 'login',
      email: email,
      password: password,
    };

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwCP2ecX2e2ApAi9ARrnHxMGGUYXCNQjJ-OF_rINILjn-pxK2PAxtgtlbYL7YTDjsLZXw/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{marginTop:"32px"}}>
    <form onSubmit={handleLogin}>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Login</button>
    </form>
    </div>
  );
};

export default Login;
