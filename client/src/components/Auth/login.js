import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true); 

    if (!captchaValue) {
      setError('Please complete the CAPTCHA.');
      setLoading(false); 
      return;
    }

    try {

      const captchaResponse = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ captchaToken: captchaValue }),
      });
      const captchaResult = await captchaResponse.json();

      if (captchaResponse.ok && captchaResult.success) {
      
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          setSuccess(true);
        } else {
          setError('Invalid username or password.');
        }
      } else {
        setError('CAPTCHA verification failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during login.');
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-slate-600 via-black to-gray-500 text-white"><div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-8">
    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
      Welcome Back
    </h2>

    {success && (
      <div
        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-md"
        role="alert"
      >
        <span className="block sm:inline">Login successful!</span>
      </div>
    )}


    {error && (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-md"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    )}

 
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

    
      <div className="mb-6 flex justify-center">
        <HCaptcha
          sitekey="458a23e0-c63a-45a0-baa6-dc4abe4ef920"
          onVerify={handleCaptchaChange}
        />
      </div>

      <button
        type="submit"
        className={`w-full bg-indigo-500 text-white py-3 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 shadow-lg ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  </div></div>
  
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300">
      
   
  );
};


export default Login;
