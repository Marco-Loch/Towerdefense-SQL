import React, { useState, useRef } from 'react';

function Register({ onRegistrationSuccess, onLoginSuccess }) {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    const registrationData = { username, password };

    try {
      const response = await fetch('https://towerdefense.marco-loch.de/api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Registrierung erfolgreich! Du wirst nun angemeldet...');
        const loginResponse = await fetch('https://towerdefense.marco-loch.de/api/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        const loginResult = await loginResponse.json();

        if (loginResult.success) {
          localStorage.setItem('user_id', loginResult.user_id);
          if (onLoginSuccess) {
            onLoginSuccess(loginResult.user_id);
          }
        } else {
          setMessage('Registrierung erfolgreich, aber Login fehlgeschlagen.');
        }

      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Registrierungsfehler:', error);
      setMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }
  };

  return (
    <div>
      <h2>Registrieren</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Benutzername:
            <input type="text" ref={usernameRef} required />
          </label>
        </div>
        <div>
          <label>
            Passwort:
            <input type="password" ref={passwordRef} required />
          </label>
        </div>
        <button type="submit">Registrieren</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;