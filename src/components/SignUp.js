// src/components/SignUp.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../index';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const auth = getAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User signed up:', userCredential.user);
      })
      .catch((error) => {
        console.error('Error signing up:', error);
      });
  };

return (
  <form style={styles.form} onSubmit={handleSignUp}>
    <div style={styles.inputGroup}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        placeholder="Email"
      />
    </div>
    <div style={styles.inputGroup}>
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        placeholder="Password (6 Digits)"
      />
    </div>
    <button type="submit" style={styles.submitButton}>Sign Up</button>
  </form>
);
};

const styles = {
form: {
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
},
inputGroup: {
  marginBottom: '15px',
},
input: {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
},
submitButton: {
  width: '100%',
  padding: '12px',
  backgroundColor: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem',
},
};

export default SignUp;
