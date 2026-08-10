```tsx
import React, {
  useEffect,
  useState,
} from 'react';
import {
  motion,
  AnimatePresence,
} from 'motion/react';
import {
  X,
  Lock,
  Mail,
  User,
  KeyRound,
  Loader2,
  LogIn,
  UserPlus,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const JoinModal: React.FC<
  JoinModalProps
> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const {
    signIn,
    signInWithGoogle,
    signUp,
    resetPassword,
  } = useApp();

  const [mode, setMode] = useState<
    'signin' | 'signup' | 'forgot'
  >(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [authError, setAuthError] =
    useState<string | null>(null);

  /*
   * Reset the modal whenever it opens.
   *
   * This prevents the modal from remembering
   * "Create Account" or "Forgot Password" from
   * the previous session.
   */
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'signin');
      setAuthError(null);
      setPassword('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialMode]);

  const handleSignInSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setAuthError(null);

    if (
      !email.trim() ||
      !password.trim()
    ) {
      setAuthError(
        'Please enter both email address and password.'
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(
        email.trim(),
        password.trim()
      );

      if (error) {
        setAuthError(
          error.message ||
            'Invalid login credentials.'
        );
      } else {
        handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const { error } =
        await signInWithGoogle();

      if (error) {
        setAuthError(
          error.message ||
            'Google sign in failed.'
        );

        setIsSubmitting(false);
      }
    } catch (err: any) {
      setAuthError(
        err?.message ||
          'Google sign in failed. Please try again.'
      );

      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setAuthError(null);

    if (
      !email.trim() ||
      !password.trim()
    ) {
      setAuthError(
        'Please fill in all required fields.'
      );

      return;
    }

    if (password.length < 6) {
      setAuthError(
        'Password must be at least 6 characters long.'
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const {
        error,
        user: createdUser,
      } = await signUp(
        email.trim(),
        password.trim(),
        name.trim()
      );

      if (error) {
        setAuthError(
          error.message ||
            'Failed to create account.'
        );
      } else {
        if (
          createdUser?.identities &&
          createdUser.identities.length === 0
        ) {
          setAuthError(
            'This email is already registered. Please sign in instead.'
          );
        } else {
          handleClose();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim()) {
      setAuthError(
        'Please enter your email address.'
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const { error } =
        await resetPassword(
          email.trim()
        );

      if (error) {
        setAuthError(
          error.message ||
            'Failed to send password reset email.'
        );
      } else {
        setAuthError(null);
        setMode('signin');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAuthError(null);
    setPassword('');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#060A13]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 15,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 15,
          }}
          className="relative w-full max-w-md glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 z-10 text-slate-100 bg-[#0B1220]/95"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />

              <span>
                SUPABASE AUTHENTICATION
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white">
              {mode === 'signin' &&
                'Sign In to Account'}

              {mode === 'signup' &&
                'Create New Account'}

              {mode === 'forgot' &&
                'Reset Password'}
            </h2>

            <p className="text-xs text-slate-400">
              {mode === 'signin' &&
                'Access your favorites, collections & admin options'}

              {mode === 'signup' &&
                'Join Wallpaper Station for 4K & 8K backgrounds'}

              {mode === 'forgot' &&
                'Enter your email to receive a password reset link'}
            </p>
          </div>

          {/* Mode Switcher */}
          {mode !== 'forgot' && (
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setAuthError(null);
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signin'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />

                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setAuthError(null);
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />

                <span>
                  Create Account
                </span>
              </button>
            </div>
          )}

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium leading-relaxed">
              {authError}
            </div>
          )}

          {/* Sign In */}
          {mode === 'signin' && (
            <form
              onSubmit={handleSignInSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-300">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setAuthError(null);
                    }}
                    className="text-xs text-sky-400 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}

                <span>
                  {isSubmitting
                    ? 'Authenticating...'
                    : 'Sign In'}
                </span>
              </button>

              {/* Google Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>

                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0B1220] px-3 text-slate-500">
                    OR
                  </span>
                </div>
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={
                  handleGoogleSignIn
                }
                className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.5Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.54 13.58A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.08.31-1.58V7.89H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.11l3.25-2.53Z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 6.39c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.44 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.71 5.39l3.25 2.53C7.31 8.11 9.46 6.39 12 6.39Z"
                  />
                </svg>

                Continue with Google
              </button>
            </form>
          )}

          {/* Sign Up */}
          {mode === 'signup' && (
            <form
              onSubmit={handleSignUpSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Full Name
                </label>

                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type="text"
                    placeholder="e.g. Alex Vance"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Password (min 6 characters)
                </label>

                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}

                <span>
                  {isSubmitting
                    ? 'Creating Account...'
                    : 'Create Account'}
                </span>
              </button>
            </form>
          )}

          {/* Forgot Password */}
          {mode === 'forgot' && (
            <form
              onSubmit={handleForgotSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Your Account Email
                </label>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}

                <span>
                  {isSubmitting
                    ? 'Sending...'
                    : 'Send Reset Link'}
                </span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setAuthError(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />

                  <span>
                    Back to Sign In
                  </span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
```
