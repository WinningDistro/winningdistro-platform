import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, Shield, Database, Calendar, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      icon: Database,
      content: `We collect information you provide directly to us, such as when you create an account, upload music, or contact us. This includes your name, email address, payment information, and music metadata. We also collect information automatically through your use of our services, including device information, IP address, and usage patterns.`,
    },
    {
      title: '2. How We Use Your Information',
      icon: Eye,
      content: `We use your information to provide and improve our services, process payments, communicate with you, and ensure platform security. We may also use your information for analytics to understand how our services are used and to develop new features that benefit our users.`,
    },
    {
      title: '3. Information Sharing',
      icon: Shield,
      content: `We do not sell your personal information to third parties. We may share your information with trusted service providers who help us operate our platform, with distribution partners as necessary to distribute your music, and as required by law or to protect our rights and users.`,
    },
    {
      title: '4. Data Security',
      icon: Lock,
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits. However, no internet transmission is completely secure.`,
    },
    {
      title: '5. Your Rights and Choices',
      icon: Shield,
      content: `You have the right to access, update, or delete your personal information. You can manage your account settings, opt out of certain communications, and request data portability. For users in certain jurisdictions, additional rights may apply under local privacy laws.`,
    },
    {
      title: '6. Data Retention',
      icon: Calendar,
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete your personal information, though some information may be retained for legal or legitimate business purposes.`,
    },
    {
      title: '7. International Data Transfers',
      icon: Database,
      content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information when it is transferred internationally, including through standard contractual clauses.`,
    },
    {
      title: '8. Cookies and Tracking',
      icon: Eye,
      content: `We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser, though disabling cookies may affect the functionality of our services.`,
    },
  ];

  const dataTypes = [
    { type: 'Account Information', description: 'Name, email, password, profile details' },
    { type: 'Music Content', description: 'Audio files, metadata, artwork, lyrics' },
    { type: 'Payment Data', description: 'Billing information, payment methods, transaction history' },
    { type: 'Usage Analytics', description: 'Platform interaction, feature usage, performance metrics' },
    { type: 'Communication', description: 'Support tickets, emails, feedback, surveys' },
    { type: 'Device Information', description: 'IP address, browser type, device identifiers' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <Lock className="h-16 w-16 text-green mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-white mb-4">
            We're committed to protecting your privacy and being transparent about how we handle your data.
          </p>
          <div className="flex items-center justify-center text-green text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last updated: March 12, 2024
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-black border-green mb-8">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Our Privacy Commitment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white leading-relaxed mb-4">
                At WinningDistro, we understand that your privacy is fundamental to your trust in our platform. 
                This Privacy Policy explains how we collect, use, share, and protect your personal information 
                when you use our music distribution services.
              </p>
              <p className="text-white leading-relaxed">
                We are committed to transparency, security, and giving you control over your personal information. 
                This policy applies to all users of our platform and services.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Collection Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gold mb-8 text-center">Types of Data We Collect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {dataTypes.map((dataType, index) => (
              <Card key={index} className="bg-black border-green">
                <CardContent className="p-6">
                  <h3 className="text-gold font-semibold mb-2">{dataType.type}</h3>
                  <p className="text-white text-sm">{dataType.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={index} className="bg-black border-green">
                <CardHeader>
                  <CardTitle className="text-gold text-lg flex items-center">
                    <section.icon className="h-5 w-5 mr-2" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gold mb-8 text-center">Your Privacy Rights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black border-green">
              <CardContent className="p-6">
                <h3 className="text-gold font-semibold mb-3">Access & Portability</h3>
                <p className="text-white text-sm">Request a copy of your personal data and download your information in a portable format.</p>
              </CardContent>
            </Card>
            <Card className="bg-black border-green">
              <CardContent className="p-6">
                <h3 className="text-gold font-semibold mb-3">Correction & Update</h3>
                <p className="text-white text-sm">Update or correct your personal information through your account settings or by contacting us.</p>
              </CardContent>
            </Card>
            <Card className="bg-black border-green">
              <CardContent className="p-6">
                <h3 className="text-gold font-semibold mb-3">Deletion</h3>
                <p className="text-white text-sm">Request deletion of your personal data, subject to legal and contractual obligations.</p>
              </CardContent>
            </Card>
            <Card className="bg-black border-green">
              <CardContent className="p-6">
                <h3 className="text-gold font-semibold mb-3">Communication Preferences</h3>
                <p className="text-white text-sm">Opt out of marketing communications while still receiving important service updates.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-black border-green">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <Mail className="h-6 w-6 mr-2" />
                Privacy Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white space-y-2">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <p><strong className="text-green">Privacy Officer:</strong> privacy@winningdistro.com</p>
                <p><strong className="text-green">Data Protection Officer:</strong> dpo@winningdistro.com</p>
                <p><strong className="text-green">Address:</strong> WinningDistro Privacy Team</p>
                <p className="ml-16">123 Music Street, Suite 100</p>
                <p className="ml-16">Nashville, TN 37203, United States</p>
                <p><strong className="text-green">Response Time:</strong> We respond to privacy inquiries within 72 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-gold mb-8">Privacy & Security Commitments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black border border-green p-6 rounded">
              <Shield className="h-12 w-12 text-green mx-auto mb-4" />
              <h3 className="text-gold font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-white text-sm">Full compliance with European data protection regulations</p>
            </div>
            <div className="bg-black border border-green p-6 rounded">
              <Lock className="h-12 w-12 text-green mx-auto mb-4" />
              <h3 className="text-gold font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-white text-sm">Your data is encrypted in transit and at rest</p>
            </div>
            <div className="bg-black border border-green p-6 rounded">
              <Eye className="h-12 w-12 text-green mx-auto mb-4" />
              <h3 className="text-gold font-semibold mb-2">Transparent Practices</h3>
              <p className="text-white text-sm">Clear communication about how we use your data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">Questions About Privacy?</h3>
            <p className="text-black text-lg mb-6">
              We're here to help you understand how we protect and use your data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-primary">
                <Link to="/support">Contact Privacy Team</Link>
              </Button>
              <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-green">
                <Link to="/terms">View Terms of Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;