import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Check, ArrowRight, Star, DollarSign, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Join = () => {
  const benefits = [
    'Distribute to 150+ global platforms',
    'Keep 85% of your earnings',
    'Real-time analytics and reporting',
    'Professional marketing tools',
    'Rights management and publishing',
    'Expert support team',
    'No upfront fees or hidden costs',
    'Unlimited releases',
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Your Account',
      description: 'Sign up with your email and basic information. It takes less than 2 minutes.',
    },
    {
      number: '2',
      title: 'Upload Your Music',
      description: 'Add your tracks, artwork, and metadata. Our system checks everything automatically.',
    },
    {
      number: '3',
      title: 'Choose Your Platforms',
      description: 'Select where you want your music distributed. We recommend starting with all major platforms.',
    },
    {
      number: '4',
      title: 'Go Live',
      description: 'Your music will be live on all platforms within 24-48 hours. Start earning immediately.',
    },
  ];

  const testimonials = [
    {
      name: 'Jamaal Thompson (1Biggs Don)',
      role: 'Singer-Songwriter',
      quote: 'Finally, a distribution service that actually cares about artists. The support team is amazing.',
    },
    {
      name: 'Raheim Jackson (ShawnBad)',
      role: 'Independent Artist',
      quote: 'WinningDistro helped me reach over 1 million streams in my first year. The platform is incredible.',
    },
    {
      name: 'Roshane Richards (Kanvers)',
      role: 'Independent Artist',
      quote: 'For the longest i"ve never experience such efficient services.',
    },
    {
      name: 'Kwesi Rodney(Inteligntz Musiq)',
      role: 'Producer',
      quote: 'The analytics tools help me understand my audience better than ever. Highly recommended.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center bg-green text-black px-4 py-2 rounded-full font-medium mb-6">
            <Star className="h-4 w-4 mr-2" />
            Join 50,000+ Artists Worldwide
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            Start Your Music Journey Today
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Get your music on every major platform, keep 85% of your earnings,
            and access professional tools to grow your career.
          </p>
          <Link to="/signup">
            <Button className="btn-primary text-lg px-8 py-3 mb-4">
              Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-green text-sm">
            No credit card required • Start distributing in minutes
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-white text-lg">
              Join the platform built specifically for independent artists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-black border border-green rounded">
                <Check className="h-5 w-5 text-green flex-shrink-0" />
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6">
              Ready to Win the Music Industry?
            </h2>
            <p className="text-xl text-white mb-8">
              Join thousands of artists who trust WinningDistro to distribute their music worldwide.
              Get started today and keep 85% of your earnings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button className="btn-primary text-lg px-8 py-4">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="text-green border-green hover:bg-green hover:text-black text-lg px-8 py-4">
                  Already a Member? Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              $0 signup fee • No hidden costs • 85% revenue share
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              How It Works
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Getting your music distributed is simple with our streamlined process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-green text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.number}
                  </div>
                  <CardTitle className="text-gold">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              What Client's Say
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Join thousands of artists who trust WinningDistro with their music.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black border-green">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-white mb-4">"{testimonial.quote}"</p>
                  <div>
                    <div className="text-gold font-medium">{testimonial.name}</div>
                    <div className="text-green text-sm">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green">
        <div className="container mx-auto text-center max-w-2xl">
          <h3 className="text-3xl font-bold text-black mb-4">
            Ready to Share Your Music with the World?
          </h3>
          <p className="text-black text-lg mb-6">
            Join WinningDistro today and start your journey to musical success.
          </p>
          <Link to="/signup">
            <Button className="btn-primary text-lg px-8 py-3">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Join;
