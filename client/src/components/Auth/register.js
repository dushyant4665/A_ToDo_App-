import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha'; 
import { register } from '../../api';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!captchaValue) {
      alert('Please complete the CAPTCHA.');
      return;
    }
    try {
      const captchaResponse = await fetch('http://localhost:5000/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ captchaToken: captchaValue }),
      });

      const captchaResult = await captchaResponse.json();

      if (captchaResponse.ok) {
        const { data } = await register(formData);
        localStorage.setItem('token', data.token);
        setSuccess(true);
      } else {
        throw new Error(captchaResult.message);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Error during registration', error);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  console.log('HCAPTCHA_SITE_KEY:', process.env.HCAPTCHA_SITE_KEY);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Register
        </h2>
        
        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6 group">
            <label className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-6 group">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
              placeholder="Enter your email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-6 group">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* HCaptcha */}
          <div className="mb-8 flex justify-center">
            <HCaptcha
              sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 shadow-lg"
          >
            Submit
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          
          {/* Success Message */}
          {success && (
            <p className="text-green-500 text-center mt-4">
              Registration successful!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
