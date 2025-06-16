import React from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Share2, Users, Megaphone, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Marketing = () => {
  const marketingTools = [
    {
      icon: Target,
      title: 'Targeted Campaigns',
      description: 'Create precision marketing campaigns that reach your ideal audience across multiple platforms.',
    },
    {
      icon: Share2,
      title: 'Social Media Tools',
      description: 'Automated posting, content creation tools, and cross-platform promotion management.',
    },
    {
      icon: Users,
      title: 'Fan Engagement',
      description: 'Build deeper connections with your audience through interactive content and direct messaging.',
    },
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      description: 'Track campaign performance and audience growth with detailed marketing analytics.',
    },
    {
      icon: Megaphone,
      title: 'Press & Media',
      description: 'Access to music blogs, playlist curators, and media contacts for maximum exposure.',
    },
  ];

  const campaigns = [
    { name: 'Pre-Release Buzz', description: 'Build anticipation before your release drops' },
    { name: 'Launch Week Push', description: 'Maximize impact during your release week' },
    { name: 'Playlist Pitching', description: 'Get your music on popular playlists' },
    { name: 'Social Media Blitz', description: 'Coordinated social media campaigns' },
    { name: 'Influencer Outreach', description: 'Connect with music influencers and creators' },
    { name: 'Radio Promotion', description: 'Traditional and online radio promotion' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            Music Marketing Made Simple
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Amplify your reach with powerful marketing tools designed for independent artists. 
            From social media campaigns to playlist pitching, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary text-lg px-8 py-3">
              <Link to="/join">Start Marketing</Link>
            </Button>
            <Button asChild variant="outline" className="btn-secondary text-lg px-8 py-3">
              <Link to="/analytics">View Campaign Analytics</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Marketing Tools */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Professional Marketing Tools
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Everything you need to promote your music and grow your fanbase effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketingTools.map((tool, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <tool.icon className="h-8 w-8 text-green mb-2" />
                  <CardTitle className="text-gold">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Campaign Types
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Choose from proven campaign strategies or create custom marketing plans that fit your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <CardTitle className="text-gold">{campaign.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white">
                    {campaign.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gold mb-8">
            Marketing Success Stories
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            <div className="bg-black border border-green p-6 rounded">
              <div className="text-3xl font-bold text-green mb-2">300%</div>
              <div className="text-gold font-medium">Average Stream Increase</div>
              <div className="text-white text-sm">with targeted campaigns</div>
            </div>
            <div className="bg-black border border-green p-6 rounded">
              <div className="text-3xl font-bold text-green mb-2">50K+</div>
              <div className="text-gold font-medium">New Fans Generated</div>
              <div className="text-white text-sm">through our marketing tools</div>
            </div>
            <div className="bg-black border border-green p-6 rounded">
              <div className="text-3xl font-bold text-green mb-2">85%</div>
              <div className="text-gold font-medium">Campaign Success Rate</div>
              <div className="text-white text-sm">meet or exceed goals</div>
            </div>
          </div>

          <Button asChild className="btn-primary">
            <Link to="/join">Start Your Campaign</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">Ready to Grow Your Audience?</h3>
            <div className="text-black text-lg mb-6">
              <p className="mb-2"><strong>Professional Tools</strong> - Access industry-standard marketing features</p>
              <p className="mb-2"><strong>Expert Guidance</strong> - Get support from marketing professionals</p>
              <p><strong>Proven Results</strong> - Join artists seeing real growth</p>
            </div>
            <Button asChild className="btn-primary">
              <Link to="/join">Launch Your Marketing Campaign</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Marketing;
