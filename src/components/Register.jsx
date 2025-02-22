// src/components/Register.jsx
import React, { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // In a real application, you would send this data to your backend for user creation.
    // For now, we'll just log the data to the console.
    console.log('Registration Form submitted with:', { email, password });
    alert('Registration form submitted (no backend yet, check console for data)'); // Just for demonstration
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="registerEmail">Email:</label>
          <input
            type="email"
            id="registerEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="registerPassword">Password:</label>
          <input
            type="password"
            id="registerPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;