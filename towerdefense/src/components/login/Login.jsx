import React, { useState, useRef } from 'react';

function Login({ onLoginSuccess }) {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    const loginData = { username, password };

    try {
      const response = await fetch('https://towerdefense.marco-loch.de/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Anmeldung erfolgreich! Weiterleitung...');
        // Speichert die user_id im localStorage, um den Nutzer angemeldet zu halten
        localStorage.setItem('user_id', result.user_id);
        
        // Ruft die übergebene Funktion auf, um den Zustand in der Hauptkomponente zu aktualisieren
        if (onLoginSuccess) {
          onLoginSuccess(result.user_id);
        }
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Anmeldefehler:', error);
      setMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }
  };

  return (
    <div>
      <h2>Anmelden</h2>
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
        <button type="submit">Anmelden</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;