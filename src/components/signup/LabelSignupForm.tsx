import type React from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Music,
  User,
  Mail,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Building,
  Globe,
} from 'lucide-react';
import { labelSignupSchema, type LabelSignupData } from '@/lib/signup-schemas';
import { countries } from '@/lib/countries';
import { musicGenres } from '@/lib/form-options';

interface LabelSignupFormProps {
  onBack: () => void;
}

const LabelSignupForm: React.FC<LabelSignupFormProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<LabelSignupData>({
    resolver: zodResolver(labelSignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      labelName: '',
      labelType: 'independent',
      foundedYear: '',
      businessRegistration: '',
      taxId: '',
      headquarters: '',
      website: '',
      genres: [],
      artistCount: '1-5',
      annualRevenue: 'under-100k',
      distributionNeeds: [],
      marketingBudget: 'under-10k',
      country: '',
      password: '',
      confirmPassword: '',
      terms: false,
      newsletter: false,
    },
  });



  const onSubmit = async (data: LabelSignupData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userType: 'label',
        }),
      });

      if (response.ok) {
        toast.success('Record Label account created successfully!');
        navigate('/login?message=Account created successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-gold hover:text-green transition-colors mb-6">
              <Music className="h-8 w-8" />
              <span className="text-2xl font-bold">WinningDistro</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-blue-400">Record Label</span> Registration
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Partner with WinningDistro to distribute your artists' music worldwide
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-zinc-900 border-green shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gold flex items-center justify-center">
                  <Building className="h-8 w-8 mr-3 text-blue-400" />
                  Create Your Label Account
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tell us about your record label and business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gold flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="John"
                                  className="bg-black border-green text-white focus:border-gold"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Doe"
                                  className="bg-black border-green text-white focus:border-gold"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="contact@recordlabel.com"
                                  className="pl-10 bg-black border-green text-white focus:border-gold"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Business Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                        <Building className="h-5 w-5 mr-2" />
                        Business Information
                      </h3>

                      <FormField
                        control={form.control}
                        name="labelName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Label Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your Record Label Name"
                                className="bg-black border-green text-white focus:border-gold"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="labelType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Label Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-black border-green text-white focus:border-gold">
                                    <SelectValue placeholder="Select label type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-black border-green">
                                  <SelectItem value="independent" className="text-white hover:bg-zinc-800">Independent</SelectItem>
                                  <SelectItem value="major" className="text-white hover:bg-zinc-800">Major</SelectItem>
                                  <SelectItem value="subsidiary" className="text-white hover:bg-zinc-800">Subsidiary</SelectItem>
                                  <SelectItem value="boutique" className="text-white hover:bg-zinc-800">Boutique</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Country</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-black border-green text-white focus:border-gold">
                                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-black border-green max-h-60">
                                  {countries.map((country) => (
                                    <SelectItem key={country.code} value={country.code} className="text-white hover:bg-zinc-800">
                                      {country.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Website (Optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  placeholder="https://www.yourlabel.com"
                                  className="pl-10 bg-black border-green text-white focus:border-gold"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Security Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gold flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Security Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a strong password"
                                    className="pr-10 bg-black border-green text-white focus:border-gold"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    className="pr-10 bg-black border-green text-white focus:border-gold"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                  >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>



                    {/* Terms */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-green data-[state=checked]:bg-green data-[state=checked]:text-black"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white text-sm">
                                I agree to the{' '}
                                <Link to="/terms" className="text-green hover:text-gold underline">
                                  Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-green hover:text-gold underline">
                                  Privacy Policy
                                </Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Selection
                      </Button>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating Label Account...
                          </>
                        ) : (
                          <>
                            Join as Record Label
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LabelSignupForm;
