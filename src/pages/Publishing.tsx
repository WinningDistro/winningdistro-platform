import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, DollarSign, Scale, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Publishing = () => {
  const publishingServices = [
    {
      icon: Shield,
      title: 'Rights Protection',
      description: 'Comprehensive copyright protection and monitoring across all platforms and territories.',
    },
    {
      icon: FileText,
      title: 'Publishing Administration',
      description: 'Professional management of your publishing rights, licenses, and royalty collection.',
    },
    {
      icon: DollarSign,
      title: 'Royalty Collection',
      description: 'Maximize your earnings with global royalty collection from all revenue streams.',
    },
    {
      icon: Scale,
      title: 'Legal Support',
      description: 'Expert legal guidance for contracts, licensing deals, and rights disputes.',
    },
    {
      icon: Users,
      title: 'Sync Opportunities',
      description: 'Connect with film, TV, and brand opportunities for licensing your music.',
    },
    {
      icon: Award,
      title: 'Performance Rights',
      description: 'Register and collect performance royalties from radio, streaming, and live venues.',
    },
  ];

  const royaltyTypes = [
    { type: 'Mechanical Royalties', description: 'From physical sales, downloads, and streaming' },
    { type: 'Performance Royalties', description: 'From radio play, streaming, and live performances' },
    { type: 'Synchronization Rights', description: 'From TV, film, commercials, and video games' },
    { type: 'Print Rights', description: 'From sheet music and lyric publications' },
    { type: 'Digital Rights', description: 'From online platforms and digital services' },
    { type: 'International Royalties', description: 'From global territories and foreign markets' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            Music Publishing & Rights
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Protect your creative work and maximize your publishing income. Professional rights management 
            and royalty collection services for independent artists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary text-lg px-8 py-3">
              <Link to="/join">Protect Your Rights</Link>
            </Button>
            <Button asChild variant="outline" className="btn-secondary text-lg px-8 py-3">
              <Link to="/support">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Publishing Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Complete Publishing Services
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              From copyright registration to royalty collection, we handle all aspects of music publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishingServices.map((service, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <service.icon className="h-8 w-8 text-green mb-2" />
                  <CardTitle className="text-gold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Royalty Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Royalty Collection Services
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              We collect all types of music royalties to ensure you receive every penny you're owed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {royaltyTypes.map((royalty, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <CardTitle className="text-gold">{royalty.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white">
                    {royalty.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gold mb-8">
            Why Choose Our Publishing Services?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            <div className="bg-black border border-green p-6 rounded">
              <div className="text-3xl font-bold text-green mb-2">100%</div>
              <div className="text-gold font-medium">Rights Ownership</div>
              <div className="text-white text-sm">You keep full ownership of your work</div>
            </div>
            <div className="bg-black border border-green p-6 rounded">
              <div className="text-3xl font-bold text-green mb-2">200+</div>
              <div className="text-gold font-medium">Global Territories</div>
              <div className="text-white text-sm">Worldwide royalty collection</div>
            </div>
            <div className="bg-black border border-green p-6 rounded">
              <div className="text-3xl font-bold text-green mb-2">95%</div>
              <div className="text-gold font-medium">Collection Rate</div>
              <div className="text-white text-sm">Industry-leading recovery</div>
            </div>
          </div>

          <Button asChild className="btn-primary">
            <Link to="/join">Start Collecting Royalties</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">Protect Your Music Today</h3>
            <div className="text-black text-lg mb-6">
              <p className="mb-2"><strong>Professional Administration</strong> - Expert management of your rights</p>
              <p className="mb-2"><strong>Global Collection</strong> - Royalties from 200+ territories</p>
              <p><strong>Legal Protection</strong> - Comprehensive copyright monitoring</p>
            </div>
            <Button asChild className="btn-primary">
              <Link to="/join">Get Publishing Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Publishing;