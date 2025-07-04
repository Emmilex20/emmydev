// packages/frontend/src/components/AdminLogin.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const AdminLogin: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      login(apiKey); // Call the login function from context
      setMessage('Attempting login...');
      // Note: We don't verify against the backend here for simplicity.
      // The backend itself will reject requests if the key is invalid.
      // A more robust solution would involve a dedicated /login API endpoint.
    } else {
      setMessage('API Key cannot be empty.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-96 border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center text-primary-400 mb-6">Admin Login</h2>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-gray-300 text-sm font-bold mb-2">
            Admin API Key:
          </label>
          <input
            type="password" // Use type="password" for security
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 text-white"
            placeholder="Enter your admin API key"
          />
        </div>
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-300"
        >
          Login
        </button>
        {message && <p className="text-center text-sm mt-4 text-gray-400">{message}</p>}
        <p className="text-center text-xs text-gray-500 mt-4">
          This is an admin-only area. Your API key provides access to project management.
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;