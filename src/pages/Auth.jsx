import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setFirebaseError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!isLogin && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!isLogin && !agreedToTerms) {
      newErrors.terms = 'You must agree to the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please login instead.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please register first.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setFirebaseError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.phone, formData.password);
      }
      navigate('/dashboard');
    } catch (error) {
      setFirebaseError(getFirebaseErrorMessage(error.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 px-4 py-12">
      <div className="max-w-md w-full bg-navy-800 rounded-2xl border border-navy-600 shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="font-heading font-bold text-3xl text-white">
            Yadnesh <span className="text-accent">AI</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Trading Bot Platform</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-navy-900 rounded-full p-1 mb-8">
          <button
            onClick={() => { setIsLogin(true); setFirebaseError(''); setErrors({}); }}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
              isLogin ? 'bg-accent text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setFirebaseError(''); setErrors({}); }}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
              !isLogin ? 'bg-accent text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            New Client
          </button>
        </div>

        {/* Firebase Error */}
        {firebaseError && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-sm text-center">
            ⚠️ {firebaseError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-navy-700 border border-r-0 border-navy-600 rounded-l-lg text-gray-400 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 bg-navy-900 border border-navy-600 rounded-r-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="9876543210"
                  maxLength="10"
                />
              </div>
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-400">Password</label>
              {isLogin && (
                <button type="button" className="text-xs text-accent hover:underline">Forgot Password?</button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => { setAgreedToTerms(e.target.checked); setErrors({ ...errors, terms: '' }); }}
                  className="mt-1 w-4 h-4 rounded border-navy-600 bg-navy-900 text-accent focus:ring-accent"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the <span className="text-accent cursor-pointer hover:underline">Terms of Service</span> and <span className="text-accent cursor-pointer hover:underline">Privacy Policy</span>
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-xs">{errors.terms}</p>}
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20 mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setFirebaseError(''); setErrors({}); }}
            className="text-accent hover:underline font-medium"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
