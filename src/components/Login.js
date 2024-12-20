import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import image from '../assets/61368356_836317416752486_6159324204471681024_n.jpg';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      fetch(`${process.env.REACT_APP_SERVER_URL}/auth/google`, {
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
            navigate('/profile')
          }
        })
        .catch((error) => console.error('Failed to fetch user:', error));
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  return (
    <div
      className="flex flex-col justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <h1
        style={{ textShadow: '1px 1px 2px #aaa' }}
        className="text-white mb-8 font-bold leading-none font-sans text-4xl"
      >
        Turf Stats Logger
      </h1>
      <button
        onClick={login}
        // convert to tailwind
        className="bg-white text-black px-8 py-4 rounded-lg"
      >
        Sign in with Google
      </button>
      <h4 className="text-xl font-bold text-white">Kaushik Iyer</h4>

      <div className="flex flex-col items-center mt-8 space-y-4">
        <div className="flex justify-center gap-4 mt-2">
          <a className="text-white text-lg underline hover:text-gray-300"
            href="https://www.linkedin.com/in/kaushik-iyer-8aa347216/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="text-white text-lg underline hover:text-gray-300" href="https://github.com/Kaushik-Iyer"
            target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="text-white text-lg underline hover:text-gray-300"
            href="https://www.instagram.com/iyerkaushik/" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>
    </div>

  );
}

export default Login;
