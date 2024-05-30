import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import image from '../assets/61368356_836317416752486_6159324204471681024_n.jpg';

function Login({ setRedirectTo }) {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      fetch('https://turf-logger-backend-4ea39f4ebb11.herokuapp.com/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: codeResponse.access_token }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            setRedirectTo('/players');
          }
        })
        .catch((error) => console.error('Failed to fetch user:', error));
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
    <h1 style={{ 
        fontSize: '2.5rem', 
        color: '#fff', // Changed to white
        marginBottom: '2rem', 
        fontFamily: "'Helvetica Neue', Arial, sans-serif", 
        fontWeight: 'bold', 
        textShadow: '1px 1px 2px #aaa' 
    }}>
        Turf Stats Logger
    </h1>
      <button
        onClick={login}
        style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          color: '#000', // Changed to black
          backgroundColor: '#fff', // Changed to white
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Sign in with Google 
      </button>
      <p style={{ 
          marginTop: '1rem', 
          fontSize: '0.9rem', 
          color: '#fff' // Changed to white
      }}>
        Note: It might take up to 30 seconds to log in.
      </p>
      <div style={{ 
    marginBottom: '1rem', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    marginTop: '2rem' 
}}>
    <h4 style={{ 
        marginBottom: '0.5rem', 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        fontFamily: "'Helvetica Neue', Arial, sans-serif", 
        color: '#fff' // Changed to white
    }}>
        Kaushik Iyer
    </h4>
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem' 
    }}>
        <a style={{ 
            color: '#fff', // Changed to white
            textDecoration: 'underline', 
            fontSize: '1.2rem' 
        }} href="https://www.linkedin.com/in/kaushik-iyer-8aa347216/" target="_blank" rel="noreferrer">
            LinkedIn
        </a>
        <a style={{ 
            color: '#fff', // Changed to white
            textDecoration: 'underline', 
            fontSize: '1.2rem' 
        }} href="https://github.com/Kaushik-Iyer" target="_blank" rel="noreferrer">
            GitHub
        </a>
        <a style={{ 
            color: '#fff', // Changed to white
            textDecoration: 'underline', 
            fontSize: '1.2rem' 
        }} href="https://www.instagram.com/iyerkaushik/" target="_blank" rel="noreferrer">
            Instagram
        </a>
    </div>
</div>
    </div>
    
  );
}

export default Login;
