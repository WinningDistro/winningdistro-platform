import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, TrendingUp, Music, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Blog = () => {
  const featuredPost = {
    title: 'The Complete Guide to Music Distribution in 2024',
    excerpt: 'Everything independent artists need to know about getting their music on streaming platforms and maximizing their reach.',
    author: 'Sarah Chen',
    date: 'March 15, 2024',
    readTime: '8 min read',
    category: 'Distribution',
  };

  const blogPosts = [
    {
      title: '5 Marketing Strategies That Actually Work for Independent Artists',
      excerpt: 'Proven tactics to grow your fanbase and increase streams without breaking the bank.',
      author: 'David Kim',
      date: 'March 10, 2024',
      readTime: '6 min read',
      category: 'Marketing',
      icon: TrendingUp,
    },
    {
      title: 'Understanding Music Publishing: A Beginner\'s Guide',
      excerpt: 'Learn how publishing works and how to maximize your royalty earnings.',
      author: 'Elena Rodriguez',
      date: 'March 5, 2024',
      readTime: '10 min read',
      category: 'Publishing',
      icon: DollarSign,
    },
    {
      title: 'How to Prepare Your Music for Distribution',
      excerpt: 'Essential steps to ensure your releases meet professional standards.',
      author: 'Marcus Johnson',
      date: 'March 1, 2024',
      readTime: '5 min read',
      category: 'Production',
      icon: Music,
    },
    {
      title: 'Playlist Pitching: Getting Your Music Heard',
      excerpt: 'Strategies for getting your songs on popular playlists and increasing discovery.',
      author: 'Sarah Chen',
      date: 'February 28, 2024',
      readTime: '7 min read',
      category: 'Promotion',
      icon: TrendingUp,
    },
    {
      title: 'Analytics Deep Dive: Reading Your Music Data',
      excerpt: 'How to interpret your streaming data and use it to make better decisions.',
      author: 'David Kim',
      date: 'February 25, 2024',
      readTime: '9 min read',
      category: 'Analytics',
      icon: TrendingUp,
    },
    {
      title: 'Building Your Brand as an Independent Artist',
      excerpt: 'Create a compelling artist brand that resonates with your target audience.',
      author: 'Elena Rodriguez',
      date: 'February 20, 2024',
      readTime: '8 min read',
      category: 'Branding',
      icon: Music,
    },
  ];

  const categories = ['All Posts', 'Distribution', 'Marketing', 'Publishing', 'Production', 'Analytics', 'Branding'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6">
            WinningDistro Blog
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Learn, grow, and succeed with expert insights, industry tips, and
            the latest news in music distribution and promotion.
          </p>
          <Button asChild className="btn-primary text-lg px-8 py-3">
            <Link to="/signup">Join Our Community</Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 ? "btn-primary" : "btn-secondary"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gold mb-8">Featured Article</h2>

          <Card className="bg-black border-green hover:border-gold transition-colors mb-12">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-4 text-sm text-green mb-2">
                <span className="bg-green text-black px-2 py-1 rounded font-medium">
                  {featuredPost.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {featuredPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {featuredPost.author}
                </span>
                <span>{featuredPost.readTime}</span>
              </div>
              <CardTitle className="text-gold text-2xl md:text-3xl mb-2">
                {featuredPost.title}
              </CardTitle>
              <CardDescription className="text-white text-lg">
                {featuredPost.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="btn-primary">
                Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gold mb-8">Latest Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index} className="bg-black border-green hover:border-gold transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-green text-black px-2 py-1 rounded text-sm font-medium">
                      {post.category}
                    </span>
                    <post.icon className="h-5 w-5 text-green" />
                  </div>
                  <CardTitle className="text-gold text-lg mb-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-white text-sm mb-4">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-green mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">{post.readTime}</span>
                    <Button variant="outline" size="sm" className="btn-secondary">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="bg-green p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">Stay Updated</h3>
            <p className="text-black text-lg mb-6">
              Get the latest music industry insights, tips, and WinningDistro updates
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded bg-white text-black border-0"
              />
              <Button className="btn-primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
