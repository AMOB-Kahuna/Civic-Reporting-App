import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Destination path after successful login
  const from = location.state?.from?.pathname || '/admin';

  // If user is already logged in, redirect to admin page
  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#266907]/10 text-[#266907] mb-3">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-[#2d3047]">Admin Portal Login</h2>
        <p className="text-[#2d3047]/70 text-sm mt-1">
          Access the NaijaReport administrative management dashboard
        </p>
      </div>

      <section>
        <form
          className="border-3 border-[#266907] rounded-2xl p-6 bg-[#2d3047]/80 shadow-2xl shadow-black text-[#e8f1fa]"
          onSubmit={handleSubmit}
        >
          <fieldset className="border-t border-[#e8f1fa]/20 pt-4 pb-4 flex flex-col gap-4">
            <legend className="pr-3 italic font-bold text-[#e8f1fa]">Authentication</legend>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-bold text-sm">
                Email Address:
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="admin@naijareport.gov.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-slate-300 rounded-2xl px-5 py-2.5 bg-white text-slate-900 focus:border-[#acaf1d] outline-none text-base"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-bold text-sm">
                Password:
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-slate-300 rounded-2xl px-5 py-2.5 bg-white text-slate-900 focus:border-[#acaf1d] outline-none text-base"
              />
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3 px-7 bg-[#266907] hover:bg-[#acaf1d] text-white font-bold rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In to Admin
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
