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
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      navigate('/');
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://student-connect-bx1y.onrender.com/api/v1/auth/login', {
        email: user.email,
        password: user.password,
      });
      toast.success("Login successful!");
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error(error);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    const age = new Date().getFullYear() - new Date(user.dob).getFullYear();

    if (age < 15) {
      toast.error("You must be at least 15 years old to register.");
      return;
    }

    if (user.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post('https://student-connect-bx1y.onrender.com/api/v1/auth/add', user);
      toast.success("User registered successfully.");
      navigate('/signup');
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen flex items-center mt-3 justify-center bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
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
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="Name">Name</label>
                    <input
                      type="text"
                      id="Name"
                      name="Name"
                      value={user.Name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="dob">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={user.dob}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="course">Course</label>
                    <input
                      type="text"
                      id="course"
                      name="course"
                      value={user.course}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="yearOfjoining">Year of Joining</label>
                    <input
                      type="number"
                      id="yearOfjoining"
                      name="yearOfjoining"
                      value={user.yearOfjoining}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="interests">Interests</label>
                    <input
                      type="text"
                      id="interests"
                      name="interests"
                      value={user.interests}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="hobbies">Hobbies</label>
                    <input
                      type="text"
                      id="hobbies"
                      name="hobbies"
                      value={user.hobbies}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="currentAddress">Current Address</label>
                    <input
                      type="text"
                      id="currentAddress"
                      name="currentAddress"
                      value={user.currentAddress}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="PermanentAddress">Permanent Address</label>
                    <input
                      type="text"
                      id="PermanentAddress"
                      name="PermanentAddress"
                      value={user.PermanentAddress}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-6">
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
