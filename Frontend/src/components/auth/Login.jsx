import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; // Add this import

function Login() {
  const { signInWithGoogle, currentUser, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 p-8 mb-6">
            {/* Logo Section */}
            <div className="flex justify-center mb-6">
              <FcGoogle className="w-16 h-16" />
            </div>

            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-emerald-600 mb-4">
              Welcome to TaskBoard Pro
            </h2>
            <p className="text-slate-600 text-center mb-8">
              Collaborative project management platform
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <button 
              onClick={handleGoogleSignIn}
              className="w-full group relative flex items-center justify-center gap-3 p-4 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 bg-purple-50/50 hover:bg-white"
            >
              <FcGoogle className="w-6 h-6" />
              <span className="text-lg font-medium text-purple-800 group-hover:text-emerald-600 transition-colors duration-200">
                Sign in with Google
              </span>
            </button>

            <p className="mt-6 text-sm text-center text-slate-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Features Preview Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 bg-purple-50/50 hover:bg-white">
              <h3 className="text-sm font-medium text-purple-800">Project Management</h3>
              <p className="text-xs text-slate-600 mt-1">Manage projects efficiently</p>
            </div>
            <div className="p-4 rounded-xl border border-purple-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 bg-purple-50/50 hover:bg-white">
              <h3 className="text-sm font-medium text-purple-800">Team Collaboration</h3>
              <p className="text-xs text-slate-600 mt-1">Work together seamlessly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
