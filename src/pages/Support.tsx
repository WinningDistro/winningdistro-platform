import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Search, 
  BookOpen, 
  Video, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Support = () => {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      action: 'Start Chat',
      recommended: true,
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 4 hours',
      action: 'Send Email',
      recommended: false,
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Talk to our experts directly',
      availability: 'Mon-Fri 9AM-6PM EST',
      action: 'Call Now',
      recommended: false,
    },
    {
      icon: BookOpen,
      title: 'Knowledge Base',
      description: 'Browse our comprehensive guides',
      availability: 'Always available',
      action: 'Browse Articles',
      recommended: false,
    },
  ];

  const commonQuestions = [
    {
      question: 'How long does it take to distribute my music?',
      answer: 'Your music will be live on most platforms within 24-48 hours of submission. Some platforms may take up to 7 days for first-time releases.',
    },
    {
      question: 'When do I get paid?',
      answer: 'Payments are processed monthly for earnings above $25. You\'ll receive 85% of net revenue from your music streams and sales.',
    },
    {
      question: 'Can I distribute cover songs?',
      answer: 'Yes, but you need to obtain proper mechanical licenses. We can help you navigate the licensing process for cover songs.',
    },
    {
      question: 'How do I update my release after it\'s live?',
      answer: 'Minor updates like metadata can be made through your dashboard. Major changes may require resubmission to platforms.',
    },
    {
      question: 'What file formats do you accept?',
      answer: 'We accept WAV, FLAC, and high-quality MP3 files. For best results, upload WAV files at 44.1kHz/16-bit or higher.',
    },
    {
      question: 'How do I claim my artist profiles?',
      answer: 'We provide instructions and support for claiming your artist profiles on Spotify, Apple Music, and other platforms through your dashboard.',
    },
  ];

  const helpCategories = [
    { title: 'Getting Started', icon: CheckCircle, articles: 12 },
    { title: 'Upload & Distribution', icon: HelpCircle, articles: 18 },
    { title: 'Payments & Royalties', icon: HelpCircle, articles: 8 },
    { title: 'Marketing Tools', icon: HelpCircle, articles: 15 },
    { title: 'Analytics & Reports', icon: HelpCircle, articles: 10 },
    { title: 'Account Management', icon: HelpCircle, articles: 14 },
  ];

  const videoTutorials = [
    { title: 'How to Upload Your First Release', duration: '5:30' },
    { title: 'Understanding Your Analytics Dashboard', duration: '8:15' },
    { title: 'Setting Up Marketing Campaigns', duration: '6:45' },
    { title: 'Claiming Your Artist Profiles', duration: '4:20' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <HelpCircle className="h-16 w-16 text-green mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            Help & Support
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            We're here to help you succeed. Find answers, get support, and learn how to make the most of WinningDistro.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-green rounded text-white placeholder-gray-400 focus:border-gold focus:outline-none"
              />
              <Button className="absolute right-1 top-1 btn-primary">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Get Help Your Way
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Choose the support option that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <Card key={index} className={`bg-black hover:border-gold transition-colors ${
                option.recommended ? 'border-gold' : 'border-green'
              }`}>
                <CardHeader>
                  {option.recommended && (
                    <div className="text-xs font-medium text-gold mb-2">RECOMMENDED</div>
                  )}
                  <option.icon className="h-8 w-8 text-green mb-2" />
                  <CardTitle className="text-gold">{option.title}</CardTitle>
                  <CardDescription className="text-white">{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-green text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {option.availability}
                    </div>
                    <Button className="w-full btn-primary">
                      {option.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-white text-lg">
              Quick answers to common questions.
            </p>
          </div>

          <div className="space-y-4">
            {commonQuestions.map((faq, index) => (
              <Card key={index} className="bg-black border-green">
                <CardHeader>
                  <CardTitle className="text-gold text-lg flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="btn-secondary">
              View All FAQs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Browse Help Topics
            </h2>
            <p className="text-white text-lg">
              Explore our comprehensive knowledge base by category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <category.icon className="h-8 w-8 text-green" />
                    <span className="text-green text-sm">{category.articles} articles</span>
                  </div>
                  <CardTitle className="text-gold">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full btn-secondary">
                    Browse Articles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
              Video Tutorials
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto">
              Learn visually with our step-by-step video guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green rounded-lg flex items-center justify-center">
                      <Video className="h-8 w-8 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gold font-medium mb-1">{video.title}</h3>
                      <p className="text-green text-sm">{video.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="btn-secondary">
              View All Tutorials <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">Still Need Help?</h3>
            <p className="text-black text-lg mb-6">
              Our support team is standing by to help you succeed with your music.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-green">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
            <p className="text-black text-sm mt-4">
              Average response time: Under 30 minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;