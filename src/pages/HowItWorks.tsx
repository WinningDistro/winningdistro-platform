import { Link } from 'react-router-dom';
import { Upload, Settings, Globe, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      icon: Upload,
      title: 'Upload Your Music',
      description: 'Upload your tracks, artwork, and metadata through our simple interface. We support all major audio formats.',
      details: ['High-quality audio files (WAV, FLAC, M4A)', 'Album artwork (3000x3000px minimum)', 'Complete metadata and credits']
    },
    {
      step: 2,
      icon: Settings,
      title: 'We Generate Codes',
      description: 'Our system automatically generates ISRC and UPC codes for proper tracking and identification.',
      details: ['ISRC codes for each track', 'UPC codes for albums/EPs', 'Automatic registration with databases']
    },
    {
      step: 3,
      icon: Globe,
      title: 'Global Distribution',
      description: 'Your music goes live on 150+ platforms worldwide within 24-48 hours.',
      details: ['Spotify, Apple Music, Amazon', 'YouTube Music, Boomplay, Deezer, Tidal', 'Social platforms like TikTok, Instagram']
    },
    {
      step: 4,
      icon: DollarSign,
      title: 'Collect Royalties',
      description: 'Track your earnings in real-time and receive 85% of all royalties generated.',
      details: ['Monthly payout cycles', '85% artist retention rate', 'Detailed analytics and reporting']
    }
  ];

  const features = [
    'No upfront costs or hidden fees',
    'Keep 85% of your royalties',
    'Real-time analytics dashboard',
    'ISRC & UPC code generation',
    'Global distribution network',
    '24/7 customer support',
    'Monthly payout cycles',
    'Professional metadata management'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            How It Works
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            From upload to payout, we've simplified music distribution into four easy steps.
          </p>
        </div>
      </section>

      {/* Steps Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-green text-black rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <step.icon className="h-8 w-8 text-gold" />
                  </div>
                  <CardTitle className="text-gold text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white mb-4">
                    {step.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-white">
                        <CheckCircle2 className="h-4 w-4 text-green mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Everything You Need
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              WinningDistro provides all the tools and services you need to succeed in the music industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-zinc-900 border border-green p-4 rounded-lg text-center">
                <CheckCircle2 className="h-6 w-6 text-green mx-auto mb-2" />
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Your Music Journey Timeline
            </h2>
          </div>

          <div className="space-y-8">
            <div className="flex items-center">
              <div className="bg-green text-black rounded-full w-12 h-12 flex items-center justify-center font-bold mr-6">
                0h
              </div>
              <div>
                <h3 className="text-gold font-bold text-lg">Upload Complete</h3>
                <p className="text-white">Your music is uploaded and processing begins</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-green text-black rounded-full w-12 h-12 flex items-center justify-center font-bold mr-6">
                2h
              </div>
              <div>
                <h3 className="text-gold font-bold text-lg">Quality Check</h3>
                <p className="text-white">Our team reviews your submission for quality and compliance</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-green text-black rounded-full w-12 h-12 flex items-center justify-center font-bold mr-6">
                24h
              </div>
              <div>
                <h3 className="text-gold font-bold text-lg">Distribution Begins</h3>
                <p className="text-white">Your music starts appearing on major platforms</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-green text-black rounded-full w-12 h-12 flex items-center justify-center font-bold mr-6">
                30d
              </div>
              <div>
                <h3 className="text-gold font-bold text-lg">First Payout</h3>
                <p className="text-white">Receive your first royalty payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-gold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-white text-lg mb-8">
            Join WinningDistro today and start distributing your music to the world.
            No upfront costs, just fair pricing and professional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary text-lg px-8 py-3">
              <Link to="/join">Start Now</Link>
            </Button>
            <Button asChild variant="outline" className="btn-secondary text-lg px-8 py-3">
              <Link to="/distribution">View Partners</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
