import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Users, Award, Target, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const values = [
    {
      icon: Music,
      title: 'Artist First',
      description: 'Every decision we make prioritizes the success and creative freedom of independent artists.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We believe in building a supportive community where artists can learn, grow, and succeed together.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our platform, from technology to customer service.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly pushing the boundaries of what\'s possible in music distribution and promotion.',
    },
  ];

  const teamMembers = [
    {
      name: 'Andrae Hibbert',
      role: 'CEO & Founder',
      bio: 'Current music industry executive with 15+ years experience helping independent artists succeed.',
    },
    {
      name: 'Garceo Segree',
      role: 'CEO & Founder',
      bio: 'Tech-driven music distribution founder who builds scalable platforms that market artists smarter—turning streams into sustainable careers.',
    },
    {
      name: 'Chelly Ann Jones & Rohan Hibbert',
      role: 'Senior Accountants',
      bio: 'We lead the accounting infrastructure, implementing scalable systems and automation to ensure accurate, audit-ready financial reporting.',
    },
    {
      name: 'Shariel Segree & Shanagayle Hibbert',
      role: 'Head of Artist Relations & Marketing',
      bio: 'Artist strategists who treats marketing as creative partnership—building audiences that last beyond the algorithm.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Artists Served' },
    { number: '2M+', label: 'Songs Distributed' },
    { number: '150+', label: 'Countries Reached' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            About WinningDistro
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            We're on a mission to enfranchise music distribution and empower independent artists
            to reach global audiences while keeping control of their creative work.
          </p>
          <Button asChild className="btn-primary text-lg px-8 py-3">
            <Link to="/signup">Join Our Mission</Link>
          </Button>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-6">Our Story</h2>
          </div>

          <div className="space-y-6 text-white text-lg leading-relaxed">
            <p>
              WinningDistro was born from a simple frustration: independent artists were getting
              shortchanged by traditional distribution platforms. High fees, complex contracts,
              and poor support were the norm, not the exception.
            </p>
            <p>
              Founded in 2020 by a team of music industry veterans and technology experts,
              we set out to create a better way. A platform that puts artists first, offers
              transparent pricing, and provides the tools needed to succeed in today's music landscape.
            </p>
            <p>
              Today, we're proud to serve thousands of artists worldwide, helping them distribute
              their music to every major platform while keeping 85% of their earnings. But we're
              just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Our Values
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              These core principles guide everything we do at WinningDistro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <value.icon className="h-8 w-8 text-green mb-2" />
                  <CardTitle className="text-gold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Meet Our Team
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              The passionate people behind WinningDistro, dedicated to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <div className="w-16 h-16 bg-green rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-black" />
                  </div>
                  <CardTitle className="text-gold text-center">{member.name}</CardTitle>
                  <CardDescription className="text-green text-center font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white text-sm text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gold mb-8">
            Our Impact in Numbers
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-black border border-green p-6 rounded">
                <div className="text-4xl font-bold text-green mb-2">{stat.number}</div>
                <div className="text-gold font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <Heart className="h-12 w-12 text-black mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-black mb-4">Join Our Community</h3>
            <div className="text-black text-lg mb-6">
              <p className="mb-2">Be part of a platform that truly cares about independent artists</p>
              <p>Your success is our success</p>
            </div>
            <Button asChild className="btn-primary">
              <Link to="/signup">Start Your Journey</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
