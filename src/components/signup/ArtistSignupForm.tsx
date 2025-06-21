import type React from 'react';
import { useState, useRef, useEffect } from 'react';
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
  Check,
  X,
  AlertCircle,
  Instagram,
  Globe,
  Mic,
  Users,
  Guitar,
} from 'lucide-react';
import { artistSignupSchema, type ArtistSignupData } from '@/lib/signup-schemas';
import { countries } from '@/lib/countries';
import { musicGenres, subGenres, instruments, artistLookingFor } from '@/lib/form-options';
import { checkArtistNameAvailability, createDebouncedArtistCheck } from '@/lib/spotify-api';
import { validateInstagramHandle, generateInstagramSuggestions, formatInstagramHandle, createDebouncedInstagramCheck } from '@/lib/instagram-api';

interface ArtistSignupFormProps {
  onBack: () => void;
}

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

const ArtistSignupForm: React.FC<ArtistSignupFormProps> = ({ onBack }) => {
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

  const form = useForm<ArtistSignupData>({
    resolver: zodResolver(artistSignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      artistName: '',
      stageName: '',
      genre: '',
      subGenre: '',
      instruments: [],
      yearsActive: '',
      instagramHandle: '',
      spotifyProfile: '',
      soundcloudProfile: '',
      youtubeChannel: '',
      bandMembers: 1,
      recordingExperience: 'intermediate',
      hasOriginalMusic: true,
      lookingFor: [],
      country: '',
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



  const onSubmit = async (data: ArtistSignupData) => {
    setIsLoading(true);

    try {
      // API call to register artist
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userType: 'artist',
        }),
      });

      if (response.ok) {
        toast.success('Artist account created successfully! Welcome to WinningDistro!');
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
              <span className="text-purple-400">Artist</span> Registration
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of artists who distribute their music globally with WinningDistro
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-zinc-900 border-green shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gold flex items-center justify-center">
                  <Music className="h-8 w-8 mr-3 text-purple-400" />
                  Create Your Artist Account
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tell us about your music and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                  <SelectValue placeholder="Select your country" />
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

                    {/* Artist Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                        <Mic className="h-5 w-5 mr-2" />
                        Artist Information
                      </h3>

                      {/* Artist Name with Spotify Integration */}
                      <FormField
                        control={form.control}
                        name="artistName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Artist Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Music className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  {...field}
                                  placeholder="Your artist name"
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
                              </div>
                            )}

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stageName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Stage Name (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Different from artist name?"
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
                          name="genre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Primary Genre</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-black border-green text-white focus:border-gold">
                                    <SelectValue placeholder="Select genre" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-black border-green max-h-60">
                                  {musicGenres.map((genre) => (
                                    <SelectItem key={genre} value={genre} className="text-white hover:bg-zinc-800">
                                      {genre}
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
                          name="subGenre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Sub-Genre (Optional)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-black border-green text-white focus:border-gold">
                                    <SelectValue placeholder="Select sub-genre" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-black border-green max-h-60">
                                  {subGenres.map((subGenre) => (
                                    <SelectItem key={subGenre} value={subGenre} className="text-white hover:bg-zinc-800">
                                      {subGenre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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



                    {/* Terms and Newsletter */}
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

                      <FormField
                        control={form.control}
                        name="newsletter"
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
                                I want to receive updates about new features, industry insights, and promotional offers
                              </FormLabel>
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
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating Artist Account...
                          </>
                        ) : (
                          <>
                            Join as Artist
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

export default ArtistSignupForm;
