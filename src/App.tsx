import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// Providers
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { queryClient } from '@/lib/queryClient';

// Layout Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Pages
import Home from '@/pages/Home';
import HowItWorks from '@/pages/HowItWorks';
import Distribution from '@/pages/Distribution';
import Marketing from '@/pages/Marketing';
import Analytics from '@/pages/Analytics';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import Join from '@/pages/Join';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Signup from '@/pages/Signup';
import DynamicSignup from '@/pages/DynamicSignup';
import Dashboard from '@/pages/Dashboard';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Support from '@/pages/Support';
import AdminDashboard from '@/pages/AdminDashboard';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-black text-gold">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/distribution" element={<Distribution />} />
                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/join" element={<Join />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/signup-new" element={<DynamicSignup />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  {/* Catch-all route for 404s - redirect to home */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
