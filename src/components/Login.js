import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import image from '../assets/61368356_836317416752486_6159324204471681024_n.jpg';
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaUserFriends, FaMapMarkerAlt, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import friends from '../assets/friends.png';
import nearby from '../assets/nearby.png';
import graph from '../assets/graph.png';
import entries from '../assets/entries.png';
import live_scores from '../assets/live_scores.png';
import { useState, useEffect } from 'react';

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
            navigate('/profile');
          }
        })
        .catch((error) => console.error('Failed to fetch user:', error));
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (

    <>
      <div
        className="relative flex flex-col justify-center items-center h-screen bg-cover bg-center"
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
          className="bg-white text-black px-8 py-4 rounded-lg"
        >
          Sign in with Google
        </button>

        <div className="flex flex-col items-center mt-8 space-y-4">
          <div className="flex justify-center gap-4 mt-2">
            <a
              className="text-white text-lg underline hover:text-gray-300"
              href="https://www.linkedin.com/in/kaushik-iyer-8aa347216/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="text-white text-lg underline hover:text-gray-300"
              href="https://github.com/Kaushik-Iyer"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
        <button
          onClick={scrollToFeatures}
          className="fixed bottom-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-full
             hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 animate-bounce"
          aria-label="Scroll to features"
        >
          <FaArrowDown className="text-white text-2xl" />
          <span className="text-white font-semibold">Explore Features</span>
        </button>
      </div>
      <div id="features" className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <br />
          <p className="text-3xl font-medium text-gray-600 mb-20">
            Track your football journey like never before
          </p>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { img: entries, title: "Match Entries", desc: "Record your match performances with detailed statistics" },
              { img: graph, title: "Performance Analytics", desc: "Visualize your progress with interactive charts and graphs" },
              { img: live_scores, title: "Live Scores", desc: "Stay updated with real-time match scores and updates" },
              { img: friends, title: "Connect with Friends", desc: "Share stats and compete with your football buddies" },
              { img: nearby, title: "Find Nearby Turfs", desc: "Discover and locate football turfs in your area" }
            ].map((feature, index) => (
              <div key={index} className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <div className="p-6 h-52 flex items-center justify-center border-b border-gray-100">
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="h-40 w-40 object-contain rounded-lg border-2 border-gray-50 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-lg text-gray-600">{feature.desc}</p>
                </div>


              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}

export default Login;