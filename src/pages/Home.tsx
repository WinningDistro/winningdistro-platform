import { Link } from 'react-router-dom';
import { Music, DollarSign, BarChart3, Globe, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const features = [
    {
      icon: DollarSign,
      title: '85% Artist Payout',
      description: 'Keep more of your earnings with our industry-leading 85% payout rate. No hidden fees, no signup costs.',
    },
    {
      icon: Globe,
      title: 'Global Distribution',
      description: 'Distribute your music to 150+ stores worldwide including Spotify, Apple Music, Amazon, and more.',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track your sales, streams, and royalties with comprehensive analytics and reporting tools.',
    },
    {
      icon: Music,
      title: 'ISRC & UPC Codes',
      description: 'Automatic generation of ISRC and UPC codes for all your releases to ensure proper tracking.',
    },
    {
      icon: Zap,
      title: 'Fast Release',
      description: 'Get your music live on all platforms within 24-48 hours of submission.',
    },
    {
      icon: Award,
      title: 'Professional Support',
      description: 'Dedicated support team to help you succeed in the music industry.',
    },
  ];

  const stores = [
    'Spotify', 'Apple Music', 'Amazon Music', 'YouTube Music', 'Deezer', 'Tidal',
    'Pandora', 'iHeartRadio', 'SoundCloud', 'Bandcamp', 'TikTok', 'Instagram'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            Empowering Artists Globally
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Welcome to WinningDistro — where your music journey takes flight.
            Distribute your music worldwide and keep 85% of your earnings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary text-lg px-8 py-3">
              <Link to="/signup">JOIN NOW</Link>
            </Button>
            <Button asChild variant="outline" className="btn-secondary text-lg px-8 py-3">
              <Link to="/how-it-works">HOW IT WORKS</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Why Choose WinningDistro?
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              We're revolutionizing music distribution with artist-first principles and cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
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

      {/* Pricing Highlight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">Simple, Fair Pricing</h3>
            <div className="text-black text-lg mb-6">
              <p className="mb-2"><strong>85% to Artists</strong> - You keep the majority of your earnings</p>
              <p className="mb-2"><strong>15% Platform Fee</strong> - We take a small cut to keep the service running</p>
              <p><strong>$0 Signup Fee</strong> - Start distributing your music today</p>
            </div>
            <Button asChild className="btn-primary">
              <Link to="/signup">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Distribution Partners */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gold mb-8">
            Distribute to 150+ Stores Worldwide
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {stores.map((store, index) => (
              <div key={index} className="bg-black border border-green p-4 rounded">
                <span className="text-gold font-medium">{store}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline" className="btn-secondary">
              <Link to="/distribution">View All Partners</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-gold mb-6">
            Ready to Take Your Music Global?
          </h2>
          <p className="text-white text-lg mb-8">
            Join thousands of artists who trust WinningDistro to distribute their music worldwide.
            Start your journey today with no upfront costs.
          </p>
          <Button asChild className="btn-primary text-lg px-8 py-3">
            <Link to="/signup">Start Distributing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
