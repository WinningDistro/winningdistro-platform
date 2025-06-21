import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, ArrowRight, User, Building, Headphones, Briefcase, Globe, Mic, GraduationCap, PenTool, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type UserType, userTypes } from '@/lib/signup-schemas';
import ArtistSignupForm from '@/components/signup/ArtistSignupForm';
import LabelSignupForm from '@/components/signup/LabelSignupForm';
import ProducerSignupForm from '@/components/signup/ProducerSignupForm';
import ManagerSignupForm from '@/components/signup/ManagerSignupForm';
import PublisherSignupForm from '@/components/signup/PublisherSignupForm';
import VenueSignupForm from '@/components/signup/VenueSignupForm';
import EducatorSignupForm from '@/components/signup/EducatorSignupForm';
import JournalistSignupForm from '@/components/signup/JournalistSignupForm';
import FanSignupForm from '@/components/signup/FanSignupForm';

// Icon mapping for user types
const userTypeIcons = {
  artist: Music,
  label: Building,
  producer: Headphones,
  manager: Briefcase,
  publisher: Globe,
  venue: Mic,
  educator: GraduationCap,
  journalist: PenTool,
  fan: Heart,
};

// Color scheme for user types
const userTypeColors = {
  artist: 'from-purple-500 to-pink-500',
  label: 'from-blue-500 to-cyan-500',
  producer: 'from-green-500 to-emerald-500',
  manager: 'from-orange-500 to-red-500',
  publisher: 'from-indigo-500 to-purple-500',
  venue: 'from-yellow-500 to-orange-500',
  educator: 'from-teal-500 to-blue-500',
  journalist: 'from-rose-500 to-pink-500',
  fan: 'from-emerald-500 to-teal-500',
};

const DynamicSignup: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType);
  };

  const handleBackToSelection = () => {
    setSelectedUserType(null);
  };

  // Render appropriate form based on selected user type
  const renderSignupForm = () => {
    switch (selectedUserType) {
      case 'artist':
        return <ArtistSignupForm onBack={handleBackToSelection} />;
      case 'label':
        return <LabelSignupForm onBack={handleBackToSelection} />;
      case 'producer':
        return <ProducerSignupForm onBack={handleBackToSelection} />;
      case 'manager':
        return <ManagerSignupForm onBack={handleBackToSelection} />;
      case 'publisher':
        return <PublisherSignupForm onBack={handleBackToSelection} />;
      case 'venue':
        return <VenueSignupForm onBack={handleBackToSelection} />;
      case 'educator':
        return <EducatorSignupForm onBack={handleBackToSelection} />;
      case 'journalist':
        return <JournalistSignupForm onBack={handleBackToSelection} />;
      case 'fan':
        return <FanSignupForm onBack={handleBackToSelection} />;
      default:
        return null;
    }
  };

  // If user type is selected, show the form
  if (selectedUserType) {
    return renderSignupForm();
  }

  // Show user type selection
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center space-x-2 text-gold hover:text-green transition-colors mb-6">
              <Music className="h-8 w-8" />
              <span className="text-2xl font-bold">WinningDistro</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Join the <span className="text-gold">Music</span> Community
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose your role in the music industry to get a personalized signup experience
              tailored to your specific needs and goals.
            </p>
          </div>

          {/* User Type Selection Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {userTypes.map((userType) => {
                const IconComponent = userTypeIcons[userType.value];
                const gradientClass = userTypeColors[userType.value];

                return (
                  <Card
                    key={userType.value}
                    className="bg-zinc-900 border-green hover:border-gold transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    onClick={() => handleUserTypeSelect(userType.value)}
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                    <CardHeader className="text-center relative z-10">
                      <div className="mx-auto mb-4 p-3 bg-zinc-800 rounded-full group-hover:bg-zinc-700 transition-colors">
                        <IconComponent className="h-8 w-8 text-green group-hover:text-gold transition-colors" />
                      </div>
                      <CardTitle className="text-xl text-gold group-hover:text-white transition-colors">
                        {userType.label}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-sm">
                        {userType.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center relative z-10">
                      <Button
                        variant="outline"
                        className="border-green text-green hover:bg-green hover:text-black transition-colors group-hover:border-gold group-hover:text-gold"
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Additional Information */}
            <Card className="bg-zinc-900 border-green">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gold">Why Choose Specialized Signup?</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  We customize your experience based on your role in the music industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <User className="h-8 w-8 text-green mx-auto" />
                    <h3 className="text-white font-semibold">Personalized Fields</h3>
                    <p className="text-gray-400 text-sm">
                      Only see form fields relevant to your specific role and needs
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Globe className="h-8 w-8 text-green mx-auto" />
                    <h3 className="text-white font-semibold">Tailored Services</h3>
                    <p className="text-gray-400 text-sm">
                      Get access to tools and features designed for your industry position
                    </p>
                  </div>
                  <div className="space-y-2">
                    <ArrowRight className="h-8 w-8 text-green mx-auto" />
                    <h3 className="text-white font-semibold">Faster Setup</h3>
                    <p className="text-gray-400 text-sm">
                      Skip irrelevant questions and get to your dashboard quicker
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-green hover:text-gold font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 px-4 bg-zinc-900">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 text-sm mb-4">Trusted by music professionals worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4" />
              <span className="text-xs">10,000+ Artists</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span className="text-xs">500+ Labels</span>
            </div>
            <div className="flex items-center space-x-2">
              <Headphones className="h-4 w-4" />
              <span className="text-xs">1,000+ Producers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="text-xs">150+ Countries</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DynamicSignup;
