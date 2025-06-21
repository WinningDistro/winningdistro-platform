import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Music, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Music className="h-12 w-12 text-green mr-3" />
            <span className="text-2xl font-bold text-gold">WinningDistro</span>
          </div>
          <h1 className="text-3xl font-bold text-gold mb-2">Welcome Back</h1>
          <p className="text-white text-lg">Sign in to your artist dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="bg-black border-green">
          <CardHeader className="text-center">
            <CardTitle className="text-gold text-xl">Sign In</CardTitle>
            <CardDescription className="text-white">
              Access your music distribution dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-green rounded text-black text-sm">
              <strong>Demo Credentials:</strong> Email: demo@artist.com | Password: demo123
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="demo@artist.com"
                          className="bg-zinc-900 border-green text-white placeholder-gray-400 focus:border-gold"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="demo123"
                            className="bg-zinc-900 border-green text-white placeholder-gray-400 focus:border-gold pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-green"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-green bg-transparent border-green rounded focus:ring-green"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-white text-sm">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-green hover:text-gold text-sm">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary text-lg py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-white">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full btn-secondary">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            <p className="text-center text-white text-sm">
              Don't have an account?{' '}
              <Link to="/join" className="text-green hover:text-gold font-medium">
                Sign up for free
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="bg-zinc-900 p-6 rounded-lg text-center">
          <h3 className="text-gold font-semibold mb-3">Access Your Dashboard</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-white">
              <div className="text-green font-medium">Track Performance</div>
              <div>Real-time analytics</div>
            </div>
            <div className="text-white">
              <div className="text-green font-medium">Manage Releases</div>
              <div>Upload new music</div>
            </div>
            <div className="text-white">
              <div className="text-green font-medium">View Earnings</div>
              <div>Monitor royalties</div>
            </div>
            <div className="text-white">
              <div className="text-green font-medium">Marketing Tools</div>
              <div>Promote your music</div>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center">
          <p className="text-white text-sm">
            Need help signing in?{' '}
            <Link to="/support" className="text-green hover:text-gold">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
