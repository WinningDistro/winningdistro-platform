import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Music, CheckCircle, Star, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Distribution = () => {
  const majorStores = [
    { name: 'Spotify', description: 'World\'s largest music streaming platform', users: '500M+' },
    { name: 'Apple Music', description: 'Premium streaming service by Apple', users: '100M+' },
    { name: 'Amazon Music', description: 'Amazon\'s streaming and download service', users: '100M+' },
    { name: 'Boomplay', description: 'African streaming giant', users: '100M+' },
    { name: 'YouTube Music', description: 'Google\'s music streaming platform', users: '80M+' },
    { name: 'Deezer', description: 'European streaming giant', users: '16M+' },
    { name: 'Tidal', description: 'High-fidelity music streaming', users: '5M+' },
  ];

  const socialPlatforms = [
    'TikTok', 'Instagram', 'Facebook', 'Snapchat', 'Twitter', 'Triller'
  ];

  const distributionFeatures = [
    {
      icon: Globe,
      title: '150+ Global Stores',
      description: 'Reach audiences worldwide with comprehensive distribution to all major platforms.',
    },
    {
      icon: Clock,
      title: '24-48 Hour Release',
      description: 'Fast-track your releases to go live across all platforms within 1-2 business days.',
    },
    {
      icon: CheckCircle,
      title: 'Quality Control',
      description: 'Automated quality checks ensure your music meets platform requirements.',
    },
    {
      icon: Star,
      title: 'Priority Support',
      description: 'Get prioritized placement and dedicated support for your releases.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            Global Music Distribution
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Get your music on every major platform worldwide. From streaming giants to social media,
            we connect your music to audiences everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary text-lg px-8 py-3">
              <Link to="/signup">Start Distributing</Link>
            </Button>
            <Button asChild variant="outline" className="btn-secondary text-lg px-8 py-3">
              <Link to="/analytics">View Analytics</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Distribution Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Powerful Distribution Features
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Everything you need to get your music heard by the right audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {distributionFeatures.map((feature, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-green mb-2" />
                  <CardTitle className="text-gold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Major Streaming Platforms */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Major Streaming Platforms
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Your music will be available on all the platforms that matter most to your fans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorStores.map((store, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <CardTitle className="text-gold">{store.name}</CardTitle>
                  <CardDescription className="text-green font-semibold">
                    {store.users} active users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{store.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Integration */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gold mb-8">
            Social Media Integration
          </h3>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Expand your reach with automatic distribution to social media platforms where music discovery happens.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto mb-8">
            {socialPlatforms.map((platform, index) => (
              <div key={index} className="bg-black border border-green p-4 rounded">
                <span className="text-gold font-medium">{platform}</span>
              </div>
            ))}
          </div>

          <Button asChild className="btn-primary">
            <Link to="/signup">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">Ready to Distribute?</h3>
            <div className="text-black text-lg mb-6">
              <p className="mb-2"><strong>85% Revenue Share</strong> - Keep most of your earnings</p>
              <p className="mb-2"><strong>No Upfront Costs</strong> - Pay nothing to get started</p>
              <p><strong>Unlimited Releases</strong> - Distribute as much as you want</p>
            </div>
            <Button asChild className="btn-primary">
              <Link to="/signup">Start Distributing Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Distribution;
