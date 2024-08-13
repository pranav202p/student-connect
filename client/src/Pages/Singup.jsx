import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState({
    Name: '',
    dob: '',
    course: '',
    yearOfjoining: '',
    interests: '',
    hobbies: '',
    currentAddress: '',
    PermanentAddress: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Import and use navigate here

  useEffect(() => {
    // Check for token and update login status
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      navigate('/'); // Redirect to home if already logged in
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: user.email,
        password: user.password,
      });
      toast.success("Login successful!");
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log(token)
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/add', user);
      toast.success("User registered successfully.");
    
      navigate('/signup'); // Redirect to login page or similar
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const switchSection = () => {
    setIsLogin(!isLogin);
    if (!isLogin) {
      setUser({
        Name: '',
        dob: '',
        course: '',
        yearOfjoining: '',
        interests: '',
        hobbies: '',
        currentAddress: '',
        PermanentAddress: '',
        email: '',
        password: '',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center mt-3 justify-center bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        {isLoggedIn ? (
          <div>
            <h2 className="text-2xl text-center font-bold mb-4">Welcome</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="search">Search</label>
              <input
                type="text"
                id="search"
                name="search"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            {isLogin ? (
              <>
                <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
                <form onSubmit={signIn}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700"
                  >
                    Sign In
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-600">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={switchSection}
                    className="text-red-600 hover:underline"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <form onSubmit={register}>
                  {Object.entries(user).map(([key, value]) => (
                    key !== 'password' ? (
                      <div className="mb-4" key={key}>
                        <label className="block text-sm font-medium text-gray-700" htmlFor={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type={key === 'dob' ? 'date' : key === 'email' ? 'email' : 'text'}
                          id={key}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    ) : null
                  ))}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700"
                  >
                    Register
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-600">Already have an account? </span>
                  <button
                    type="button"
                    onClick={switchSection}
                    className="text-red-600 hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
