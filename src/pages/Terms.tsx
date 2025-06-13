import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: "By accessing and using WinningDistro's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
    },
    {
      title: '2. Service Description',
      content: "WinningDistro provides music distribution services, allowing artists to distribute their music to various digital platforms worldwide. Our services include but are not limited to music distribution, analytics, marketing tools, and rights management.",
    },
    {
      title: '3. User Responsibilities',
      content: "Users are responsible for ensuring they own or have the necessary rights to distribute the music they upload. You must provide accurate information and comply with all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account credentials.",
    },
    {
      title: '4. Revenue Sharing',
      content: "WinningDistro operates on an 85/15 revenue sharing model. Artists retain 85% of net revenue from their music distribution, while WinningDistro retains 15% as a service fee. Payments are processed monthly for earnings above the minimum threshold.",
    },
    {
      title: '5. Intellectual Property',
      content: "You retain full ownership of your music and associated intellectual property rights. By using our service, you grant WinningDistro a non-exclusive license to distribute, market, and promote your music across our partner platforms.",
    },
    {
      title: '6. Content Guidelines',
      content: "All content must comply with our content guidelines and the terms of service of distribution platforms. Content that violates copyright, contains illegal material, or violates platform policies may be removed without notice.",
    },
    {
      title: '7. Account Termination',
      content: "Either party may terminate this agreement at any time with 30 days written notice. Upon termination, WinningDistro will remove your content from distribution platforms and cease promotion activities. Outstanding payments will be processed according to normal schedules.",
    },
    {
      title: '8. Limitation of Liability',
      content: "WinningDistro's liability is limited to the amount of fees paid by the user in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages arising from the use of our services.",
    },
    {
      title: '9. Privacy and Data Protection',
      content: "We are committed to protecting your privacy and personal data. Please review our Privacy Policy for detailed information about how we collect, use, and protect your information.",
    },
    {
      title: '10. Changes to Terms',
      content: "WinningDistro reserves the right to modify these terms at any time. Users will be notified of significant changes via email. Continued use of the service after changes constitutes acceptance of the new terms.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <Shield className="h-16 w-16 text-green mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-white mb-4">
            Please read these terms carefully before using WinningDistro's services.
          </p>
          <div className="flex items-center justify-center text-green text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last updated: March 12, 2024
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-black border-green mb-8">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white leading-relaxed">
                These Terms of Service ("Terms") govern your use of the WinningDistro platform and services.
                By creating an account or using our services, you agree to these terms in full.
                These terms constitute a legally binding agreement between you and WinningDistro.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={index} className="bg-black border-green">
                <CardHeader>
                  <CardTitle className="text-gold text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-black border-green">
            <CardHeader>
              <CardTitle className="text-gold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white space-y-2">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <p><strong className="text-green">Email:</strong> legal@winningdistro.com</p>
                <p><strong className="text-green">Address:</strong> WinningDistro Legal Department</p>
                <p className="ml-16">123 Music Street, Suite 100</p>
                <p className="ml-16">Nashville, TN 37203, United States</p>
                <p><strong className="text-green">Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gold mb-8 text-center">Key Points Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black border-green">
              <CardContent className="p-6">
                <h3 className="text-gold font-semibold mb-3">Revenue Sharing</h3>
                <p className="text-white text-sm">Artists keep 85% of earnings, with 15% going to WinningDistro for service fees.</p>
              </CardContent>
            </Card>
            <Card className="bg-black border-green">
              <CardContent className="p-6">
                <h3 className="text-gold font-semibold mb-3">Rights Ownership</h3>
                <p className="text-white text-sm">You retain full ownership of your music and intellectual property rights.</p>
              </CardContent>
            </Card>
            <Card className="bg-black border-green">
              <CardContent className="p-6">
                <h3 className="text-gold font-semibold mb-3">Account Termination</h3>
                <p className="text-white text-sm">Either party can terminate with 30 days notice. Your content will be removed from platforms.</p>
              </CardContent>
            </Card>
            <Card className="bg-black border-green">
              <CardContent className="p-6">
                <h3 className="text-gold font-semibold mb-3">Content Guidelines</h3>
                <p className="text-white text-sm">All content must comply with platform policies and copyright laws.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agreement Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">Ready to Get Started?</h3>
            <p className="text-black text-lg mb-6">
              By creating an account, you agree to these Terms of Service and our Privacy Policy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-primary">
                <Link to="/join">Create Account</Link>
              </Button>
              <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-green">
                <Link to="/privacy">View Privacy Policy</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
