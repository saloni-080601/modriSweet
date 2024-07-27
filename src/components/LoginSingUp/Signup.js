import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      action: 'signup',
      ...formData,
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
    <form onSubmit={handleSubmit} style={{marginTop:"120px"}}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
