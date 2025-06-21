import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Globe, Users, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Analytics = () => {
  const analyticsFeatures = [
    {
      icon: BarChart3,
      title: 'Real-Time Data',
      description: 'Monitor streams, downloads, and revenue in real-time across all platforms.',
    },
    {
      icon: Globe,
      title: 'Geographic Insights',
      description: 'See where your music is popular with detailed geographic breakdowns.',
    },
    {
      icon: Users,
      title: 'Audience Demographics',
      description: 'Understand your fanbase with age, gender, and listening behavior data.',
    },
    {
      icon: TrendingUp,
      title: 'Growth Tracking',
      description: 'Track your growth over time with detailed trend analysis and projections.',
    },
    {
      icon: DollarSign,
      title: 'Revenue Analytics',
      description: 'Detailed breakdown of earnings by platform, territory, and time period.',
    },
    {
      icon: Calendar,
      title: 'Custom Reports',
      description: 'Generate custom reports for any date range or specific releases.',
    },
  ];

  const metrics = [
    { name: 'Total Streams', value: '2.4M+', change: '+23%' },
    { name: 'Revenue Generated', value: '$18,750', change: '+31%' },
    { name: 'Countries Reached', value: '89', change: '+12%' },
    { name: 'Playlist Additions', value: '1,247', change: '+45%' },
  ];

  const platforms = [
    { name: 'Spotify', percentage: '45%', color: 'text-green' },
    { name: 'Apple Music', percentage: '28%', color: 'text-gold' },
    { name: 'YouTube Music', percentage: '15%', color: 'text-white' },
    { name: 'Amazon Music', percentage: '12%', color: 'text-green' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            Advanced Music Analytics
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Make data-driven decisions with comprehensive analytics. Track performance,
            understand your audience, and optimize your music strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary text-lg px-8 py-3">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="btn-secondary text-lg px-8 py-3">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Analytics Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Powerful Analytics Tools
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Get deep insights into your music performance with industry-leading analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsFeatures.map((feature, index) => (
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

      {/* Sample Metrics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Track What Matters Most
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Monitor your key performance indicators with real-time updates and trend analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors text-center">
                <CardHeader>
                  <CardTitle className="text-gold text-sm">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-green text-sm font-medium">{metric.change} this month</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Platform Breakdown */}
          <div className="bg-zinc-900 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gold mb-6 text-center">Platform Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platforms.map((platform, index) => (
                <div key={index} className="bg-black border border-green p-4 rounded text-center">
                  <div className="text-gold font-medium mb-2">{platform.name}</div>
                  <div className={`text-2xl font-bold ${platform.color}`}>{platform.percentage}</div>
                  <div className="text-white text-sm">of total streams</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reporting Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gold mb-8">
            Advanced Reporting
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            <div className="bg-black border border-green p-6 rounded">
              <div className="text-2xl font-bold text-green mb-2">Daily Updates</div>
              <div className="text-gold font-medium">Real-Time Data</div>
              <div className="text-white text-sm">Fresh data every 24 hours</div>
            </div>
            <div className="bg-black border border-green p-6 rounded">
              <div className="text-2xl font-bold text-green mb-2">Export Options</div>
              <div className="text-gold font-medium">Multiple Formats</div>
              <div className="text-white text-sm">CSV, PDF, Excel exports</div>
            </div>
            <div className="bg-black border border-green p-6 rounded">
              <div className="text-2xl font-bold text-green mb-2">API Access</div>
              <div className="text-gold font-medium">Developer Tools</div>
              <div className="text-white text-sm">Integrate with your tools</div>
            </div>
          </div>

          <Button asChild className="btn-primary">
            <Link to="/dashboard">Access Analytics</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">Start Tracking Your Success</h3>
            <div className="text-black text-lg mb-6">
              <p className="mb-2"><strong>Real-Time Insights</strong> - Never miss important trends</p>
              <p className="mb-2"><strong>Actionable Data</strong> - Make informed decisions</p>
              <p><strong>Growth Optimization</strong> - Maximize your music's potential</p>
            </div>
            <Button asChild className="btn-primary">
              <Link to="/signup">Get Analytics Access</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
