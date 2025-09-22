import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ChevronRight, MessageCircle, Book, Shield, CreditCard, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: TrendingUp,
      title: "Getting Started",
      description: "Learn the basics of WealthDost",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Users,
      title: "Community Features",
      description: "Posts, comments, and interactions",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Account safety and data protection",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: CreditCard,
      title: "Premium Features",
      description: "Subscriptions and expert content",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const faqs = [
    {
      question: "How do I create my first post?",
      answer: "Tap the '+' button in the bottom navigation, choose your post type (analysis, question, or discussion), write your content, add relevant tags, and publish. Make sure to follow community guidelines for the best engagement."
    },
    {
      question: "How does the watchlist feature work?",
      answer: "Your watchlist allows you to track stocks, mutual funds, and other investments. Add items by tapping the heart icon next to any asset, set price alerts, and get notifications when your targets are hit."
    },
    {
      question: "What are expert recommendations?",
      answer: "Verified experts on WealthDost share their investment insights, stock picks, and market analysis. You can follow experts, view their track records, and get notifications about their latest recommendations."
    },
    {
      question: "How do I verify my expert status?",
      answer: "To become a verified expert, submit your credentials including certifications (CFA, FRM, etc.), work experience, and track record. Our team reviews applications within 5-7 business days."
    },
    {
      question: "Is my personal data secure?",
      answer: "Yes, we use bank-level encryption and never share your personal information with third parties. You can control your privacy settings in the Settings menu to choose what information is visible to other users."
    },
    {
      question: "How do price alerts work?",
      answer: "Set price alerts for any stock in your watchlist by tapping the bell icon. Choose target price, alert type (above/below), and notification method. You'll get instant notifications when prices hit your targets."
    },
    {
      question: "Can I connect my broker account?",
      answer: "Yes, WealthDost supports integration with major Indian brokers like Zerodha, Upstox, and Angel One. This allows automatic portfolio tracking and performance analysis."
    },
    {
      question: "What are investment rooms?",
      answer: "Investment rooms are community spaces focused on specific themes like 'Tech Stocks', 'ESG Investing', or 'Options Trading'. Join rooms to discuss strategies with like-minded investors."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Help Center</h1>
            <div className="w-8"></div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pb-24 space-y-4">
        
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Quick Help</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/help/contact">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Contact Support</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/help/guide">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Book className="mr-2 h-4 w-4 text-green-600" />
                  <span>User Guide</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Browse by Category</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const categorySlug = category.title.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link key={index} href={`/help/category/${categorySlug}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <IconComponent className={`h-5 w-5 ${category.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{category.title}</p>
                        <p className="text-xs text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Frequently Asked Questions</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="border rounded-lg">
                <button
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{faq.question}</p>
                    <ChevronRight 
                      className={`h-4 w-4 text-gray-400 transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="px-3 pb-3 border-t bg-gray-50">
                    <p className="text-sm text-gray-600 pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}

            {filteredFaqs.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500 text-sm">Try searching with different keywords or contact support.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Still need help?</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat Support
              </Button>
              <Button variant="outline">
                <span className="material-icons mr-2 text-base">email</span>
                Email Us
              </Button>
            </div>
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Average response time: 2-4 hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;