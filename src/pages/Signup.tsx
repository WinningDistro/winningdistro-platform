import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Music,
  User,
  Mail,
  Briefcase,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Globe,
  Award,
  TrendingUp,
  Users,
  Loader2,
  Check,
  X,
  AlertCircle,
  Instagram,
} from 'lucide-react';
import { countries } from '@/lib/countries';
import { checkArtistNameAvailability, createDebouncedArtistCheck } from '@/lib/spotify-api';
import { validateInstagramHandle, generateInstagramSuggestions, formatInstagramHandle, createDebouncedInstagramCheck } from '@/lib/instagram-api';

// Industry roles with icons
const industries = [
  { value: 'artist', label: 'Recording Artist', icon: Music },
  { value: 'songwriter', label: 'Songwriter', icon: Music },
  { value: 'producer', label: 'Music Producer', icon: Users },
  { value: 'composer', label: 'Composer', icon: Music },
  { value: 'band', label: 'Band/Group', icon: Users },
  { value: 'dj', label: 'DJ/Electronic Artist', icon: Music },
  { value: 'rapper', label: 'Rapper/Hip-Hop Artist', icon: Music },
  { value: 'singer', label: 'Singer/Vocalist', icon: Music },
  { value: 'musician', label: 'Instrumentalist', icon: Music },
  { value: 'label_owner', label: 'Record Label Owner', icon: Briefcase },
  { value: 'manager', label: 'Artist Manager', icon: Briefcase },
  { value: 'publisher', label: 'Music Publisher', icon: Briefcase },
  { value: 'distributor', label: 'Music Distributor', icon: TrendingUp },
  { value: 'other', label: 'Other Music Professional', icon: Briefcase },
];

// Features to highlight
const features = [
  { icon: TrendingUp, title: '85% Royalties', desc: 'Keep more of your earnings' },
  { icon: Globe, title: '150+ Platforms', desc: 'Global distribution' },
  { icon: Users, title: 'Artist Support', desc: '24/7 dedicated help' },
  { icon: Award, title: 'Fast Release', desc: '24-48 hour delivery' },
];

// Validation schema
const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  artistName: z.string().min(2, 'Artist name must be at least 2 characters'),
  industry: z.string().min(1, 'Please select your industry role'),
  country: z.string().min(1, 'Please select your country'),
  companyName: z.string().optional(),
  instagramHandle: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  newsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

// Spotify integration state
interface ArtistNameStatus {
  checking: boolean;
  available: boolean | null;
  exactMatch: boolean;
  similarArtists: Array<{
    id: string;
    name: string;
    popularity: number;
    followers: { total: number };
  }>;
  suggestions: string[];
}

// Instagram integration state
interface InstagramStatus {
  checking: boolean;
  valid: boolean | null;
  available: boolean | null;
  profile?: {
    username: string;
    displayName?: string;
    followerCount?: number;
    verified?: boolean;
  };
  suggestions: string[];
  error?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Spotify integration state
  const [artistNameStatus, setArtistNameStatus] = useState<ArtistNameStatus>({
    checking: false,
    available: null,
    exactMatch: false,
    similarArtists: [],
    suggestions: []
  });

  // Instagram integration state
  const [instagramStatus, setInstagramStatus] = useState<InstagramStatus>({
    checking: false,
    valid: null,
    available: null,
    suggestions: []
  });

  // Create debounced functions
  const debouncedArtistCheck = createDebouncedArtistCheck();
  const debouncedInstagramCheck = createDebouncedInstagramCheck();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      artistName: '',
      industry: '',
      country: '',
      companyName: '',
      instagramHandle: '',
      password: '',
      confirmPassword: '',
      terms: false,
      newsletter: false,
    },
  });

  // Watch form values for real-time API checks
  const artistName = form.watch('artistName');
  const instagramHandle = form.watch('instagramHandle');

  // Spotify artist name checking
  useEffect(() => {
    if (artistName && artistName.length >= 2) {
      setArtistNameStatus(prev => ({ ...prev, checking: true }));

      debouncedArtistCheck(artistName, (result) => {
        setArtistNameStatus({
          checking: false,
          available: result.available,
          exactMatch: result.exactMatch,
          similarArtists: result.similarArtists,
          suggestions: result.suggestions
        });
      });
    } else {
      setArtistNameStatus({
        checking: false,
        available: null,
        exactMatch: false,
        similarArtists: [],
        suggestions: []
      });
    }
  }, [artistName]);

  // Instagram handle validation
  useEffect(() => {
    if (instagramHandle && instagramHandle.length >= 1) {
      setInstagramStatus(prev => ({ ...prev, checking: true }));

      debouncedInstagramCheck(instagramHandle, (result) => {
        setInstagramStatus({
          checking: false,
          valid: result.valid,
          available: result.available,
          profile: result.profile,
          suggestions: result.suggestions,
          error: result.error
        });
      });
    } else {
      // Generate suggestions based on artist name when Instagram field is empty
      if (artistName && artistName.length >= 2) {
        const suggestions = generateInstagramSuggestions(artistName);
        setInstagramStatus(prev => ({
          ...prev,
          checking: false,
          valid: null,
          available: null,
          suggestions: suggestions
        }));
      } else {
        setInstagramStatus({
          checking: false,
          valid: null,
          available: null,
          suggestions: []
        });
      }
    }
  }, [instagramHandle, artistName]);



  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      // API call to register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          artistName: data.artistName,
          industry: data.industry,
          country: data.country,
          companyName: data.companyName,
          instagramHandle: data.instagramHandle,
          password: data.password,
          newsletter: data.newsletter
        }),
      });

      if (response.ok) {
        toast.success('Account created successfully! Welcome to WinningDistro!');
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
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-gold hover:text-green transition-colors mb-6">
              <Music className="h-8 w-8" />
              <span className="text-2xl font-bold">WinningDistro</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Join the <span className="text-gold">Winning</span> Team
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Distribute your music to 150+ global platforms and keep 85% of your earnings.
              Join thousands of artists who trust WinningDistro with their musical journey.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-4">
                  <feature.icon className="h-8 w-8 text-green mx-auto mb-2" />
                  <h3 className="text-gold font-semibold text-sm">{feature.title}</h3>
                  <p className="text-gray-400 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-zinc-900 border-green shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gold">Create Your Account</CardTitle>
                <CardDescription className="text-gray-300">
                  Join the music industry professionals who trust WinningDistro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gold flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Personal Information
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
                                  placeholder="artist@example.com"
                                  className="pl-10 bg-black border-green text-white focus:border-gold"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gold flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        Professional Information
                      </h3>

                      {/* Artist Name with Spotify Integration */}
                      <FormField
                        control={form.control}
                        name="artistName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Artist/Professional Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Music className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  placeholder="Your stage/professional name"
                                  className={`pl-10 pr-10 bg-black text-white focus:border-gold ${
                                    artistNameStatus.checking
                                      ? 'border-yellow-500'
                                      : artistNameStatus.available === false
                                      ? 'border-red-500'
                                      : artistNameStatus.available === true
                                      ? 'border-green'
                                      : 'border-green'
                                  }`}
                                />
                                <div className="absolute right-3 top-3">
                                  {artistNameStatus.checking && (
                                    <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                                  )}
                                  {!artistNameStatus.checking && artistNameStatus.available === true && (
                                    <Check className="h-4 w-4 text-green" />
                                  )}
                                  {!artistNameStatus.checking && artistNameStatus.available === false && (
                                    <X className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </FormControl>

                            {/* Spotify Availability Feedback */}
                            {artistName && artistName.length >= 2 && (
                              <div className="mt-2">
                                {artistNameStatus.checking && (
                                  <p className="text-yellow-500 text-sm flex items-center">
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Checking availability on Spotify...
                                  </p>
                                )}

                                {!artistNameStatus.checking && artistNameStatus.available === true && (
                                  <p className="text-green text-sm flex items-center">
                                    <Check className="h-3 w-3 mr-1" />
                                    Great! This artist name appears to be available on Spotify.
                                  </p>
                                )}

                                {!artistNameStatus.checking && artistNameStatus.exactMatch && (
                                  <div className="space-y-2">
                                    <p className="text-red-500 text-sm flex items-center">
                                      <X className="h-3 w-3 mr-1" />
                                      This exact artist name is already taken on Spotify.
                                    </p>
                                    {artistNameStatus.suggestions.length > 0 && (
                                      <div className="bg-zinc-800 p-3 rounded border border-red-500">
                                        <p className="text-white text-xs mb-2">Suggested alternatives:</p>
                                        <div className="flex flex-wrap gap-2">
                                          {artistNameStatus.suggestions.map((suggestion, idx) => (
                                            <button
                                              key={idx}
                                              type="button"
                                              onClick={() => form.setValue('artistName', suggestion)}
                                              className="text-xs bg-green text-black px-2 py-1 rounded hover:bg-gold transition-colors"
                                            >
                                              {suggestion}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {!artistNameStatus.checking && artistNameStatus.similarArtists.length > 0 && !artistNameStatus.exactMatch && (
                                  <div className="bg-zinc-800 p-3 rounded border border-yellow-500">
                                    <p className="text-yellow-500 text-xs mb-2">Similar artists found on Spotify:</p>
                                    <div className="space-y-1">
                                      {artistNameStatus.similarArtists.slice(0, 3).map((artist, idx) => (
                                        <div key={idx} className="text-white text-xs flex items-center justify-between">
                                          <span>{artist.name}</span>
                                          <span className="text-gray-400">{artist.followers?.total?.toLocaleString()} followers</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Industry Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-black border-green text-white focus:border-gold">
                                  <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                                  <SelectValue placeholder="Select your role in the music industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-black border-green">
                                {industries.map((industry) => (
                                  <SelectItem key={industry.value} value={industry.value} className="text-white hover:bg-zinc-800">
                                    <div className="flex items-center">
                                      <industry.icon className="h-4 w-4 mr-2 text-green" />
                                      {industry.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Company/Label Name (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Record label, company, etc."
                                  className="bg-black border-green text-white focus:border-gold"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Instagram Handle with Validation */}
                      <FormField
                        control={form.control}
                        name="instagramHandle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Instagram Handle (Optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Instagram className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  placeholder="@your_instagram_handle"
                                  className={`pl-10 pr-10 bg-black text-white focus:border-gold ${
                                    instagramStatus.checking
                                      ? 'border-yellow-500'
                                      : instagramStatus.valid === false
                                      ? 'border-red-500'
                                      : instagramStatus.available === false
                                      ? 'border-orange-500'
                                      : instagramStatus.available === true
                                      ? 'border-green'
                                      : 'border-green'
                                  }`}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value.startsWith('@') ? value : value ? `@${value}` : '');
                                  }}
                                />
                                <div className="absolute right-3 top-3">
                                  {instagramStatus.checking && (
                                    <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                                  )}
                                  {!instagramStatus.checking && instagramStatus.valid === true && instagramStatus.available === true && (
                                    <Check className="h-4 w-4 text-green" />
                                  )}
                                  {!instagramStatus.checking && (instagramStatus.valid === false || instagramStatus.available === false) && (
                                    <AlertCircle className="h-4 w-4 text-orange-500" />
                                  )}
                                </div>
                              </div>
                            </FormControl>

                            {/* Instagram Validation Feedback */}
                            {instagramHandle && instagramHandle.length >= 1 && (
                              <div className="mt-2">
                                {instagramStatus.checking && (
                                  <p className="text-yellow-500 text-sm flex items-center">
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Checking Instagram availability...
                                  </p>
                                )}

                                {!instagramStatus.checking && instagramStatus.valid === false && (
                                  <div className="space-y-2">
                                    <p className="text-red-500 text-sm flex items-center">
                                      <X className="h-3 w-3 mr-1" />
                                      {instagramStatus.error}
                                    </p>
                                    {instagramStatus.suggestions.length > 0 && (
                                      <div className="bg-zinc-800 p-3 rounded border border-red-500">
                                        <p className="text-white text-xs mb-2">Suggested alternatives:</p>
                                        <div className="flex flex-wrap gap-2">
                                          {instagramStatus.suggestions.map((suggestion, idx) => (
                                            <button
                                              key={idx}
                                              type="button"
                                              onClick={() => form.setValue('instagramHandle', `@${suggestion}`)}
                                              className="text-xs bg-green text-black px-2 py-1 rounded hover:bg-gold transition-colors"
                                            >
                                              @{suggestion}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {!instagramStatus.checking && instagramStatus.valid === true && instagramStatus.available === false && instagramStatus.profile && (
                                  <div className="bg-zinc-800 p-3 rounded border border-orange-500">
                                    <p className="text-orange-500 text-sm mb-2">This Instagram handle is taken:</p>
                                    <div className="text-white text-xs space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">{formatInstagramHandle(instagramStatus.profile.username)}</span>
                                        {instagramStatus.profile.verified && (
                                          <Check className="h-3 w-3 text-blue-500" />
                                        )}
                                      </div>
                                      {instagramStatus.profile.displayName && (
                                        <p className="text-gray-400">{instagramStatus.profile.displayName}</p>
                                      )}
                                      {instagramStatus.profile.followerCount && (
                                        <p className="text-gray-400">{instagramStatus.profile.followerCount.toLocaleString()} followers</p>
                                      )}
                                    </div>
                                    {instagramStatus.suggestions.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-white text-xs mb-1">Suggestions:</p>
                                        <div className="flex flex-wrap gap-2">
                                          {instagramStatus.suggestions.map((suggestion, idx) => (
                                            <button
                                              key={idx}
                                              type="button"
                                              onClick={() => form.setValue('instagramHandle', `@${suggestion}`)}
                                              className="text-xs bg-green text-black px-2 py-1 rounded hover:bg-gold transition-colors"
                                            >
                                              @{suggestion}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {!instagramStatus.checking && instagramStatus.valid === true && instagramStatus.available === true && (
                                  <p className="text-green text-sm flex items-center">
                                    <Check className="h-3 w-3 mr-1" />
                                    Great! This Instagram handle appears to be available.
                                  </p>
                                )}

                                {/* Show suggestions when available but no handle entered */}
                                {!instagramHandle && instagramStatus.suggestions.length > 0 && (
                                  <div className="bg-zinc-800 p-3 rounded border border-green">
                                    <p className="text-green text-xs mb-2">Suggested Instagram handles based on your artist name:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {instagramStatus.suggestions.map((suggestion, idx) => (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() => form.setValue('instagramHandle', `@${suggestion}`)}
                                          className="text-xs bg-green text-black px-2 py-1 rounded hover:bg-gold transition-colors"
                                        >
                                          @{suggestion}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

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
                            <p className="text-xs text-gray-400">
                              Password must contain uppercase, lowercase, and number
                            </p>
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



                    {/* Terms and Newsletter */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mt-1 h-4 w-4 text-green bg-transparent border-green rounded focus:ring-green"
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

                      <FormField
                        control={form.control}
                        name="newsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mt-1 h-4 w-4 text-green bg-transparent border-green rounded focus:ring-green"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white text-sm">
                                I want to receive updates about new features, industry insights, and promotional offers
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-green hover:bg-gold text-black font-semibold py-4 text-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating Your Account...
                        </>
                      ) : (
                        <>
                          Join WinningDistro Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center">
                      <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green hover:text-gold font-medium">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 px-4 bg-zinc-900">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 text-sm mb-4">Trusted by thousands of artists worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs">256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs">GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="text-xs">150+ Global Platforms</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span className="text-xs">Industry Leading 85% Revenue Share</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
