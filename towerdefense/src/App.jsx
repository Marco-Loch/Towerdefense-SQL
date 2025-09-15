import React, { useState, useEffect } from 'react';
import './App.css'
import Login from './components/login/Login'
import Register from './components/register/Register';

function App() {
  const [userId, setUserId] = useState(null);
  const [mode, setMode] = useState('welcome');

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleLoginSuccess = (id) => {
    setUserId(id);
    setMode('game');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    setUserId(null);
    setMode('welcome');
  };

  const handleGuestLogin = () => {
    setMode('game');
    setUserId(null); 
    localStorage.removeItem('user_id');
  };

  const renderContent = () => {
    if (userId) {
      return (
        <div>
          <h1>Willkommen zurück!</h1>
          <p>Du bist angemeldet mit der User-ID: {userId}</p>
          <button onClick={handleLogout}>Abmelden</button>
          {/* Hier die Haupt-Spielkomponente rendern */}
          {/* <GamePage userId={userId} /> */}
        </div>
      );
    }

    switch (mode) {
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <Register onLoginSuccess={handleLoginSuccess} />;
      case 'game':
        return (
          <div>
            <h1>Spiele als Gast!</h1>
            <button onClick={() => setMode('welcome')}>Zurück</button>
            {/* Hier die Haupt-Spielkomponente für Gäste rendern */}
          </div>
        );
      case 'welcome':
      default:
        return (
          <div>
            <h1>Willkommen!</h1>
            <p>Bitte wähle eine Option:</p>
            <button onClick={() => setMode('login')}>Anmelden</button>
            <button onClick={() => setMode('register')}>Registrieren</button>
            <button onClick={handleGuestLogin}>Als Gast spielen</button>
          </div>
        );
    }
  };

  return <div>{renderContent()}</div>;
}

export default App;
