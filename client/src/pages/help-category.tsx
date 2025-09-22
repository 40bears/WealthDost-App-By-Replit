import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, Shield, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function HelpCategory() {
  const params = useParams();
  const categorySlug = params.category;
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Category data based on slug
  const categoryData: Record<string, any> = {
    "getting-started": {
      title: "Getting Started",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Learn the basics of WealthDost",
      faqs: [
        {
          question: "How do I create my first post?",
          answer: "Tap the '+' button in the bottom navigation, choose your post type (analysis, question, or discussion), write your content, add relevant tags, and publish. Make sure to follow community guidelines for the best engagement."
        },
        {
          question: "How does the watchlist feature work?",
          answer: "Your watchlist allows you to track stocks, mutual funds, and other investments. Add items by tapping the heart icon next to any asset, set price alerts, and get notifications when your targets are hit."
        },
        {
          question: "How do I set up my profile?",
          answer: "Go to Settings → Profile. Add a profile picture, bio, investment interests, and experience level. A complete profile helps you connect with like-minded investors and experts."
        }
      ]
    },
    "community-features": {
      title: "Community Features", 
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Posts, comments, and interactions",
      faqs: [
        {
          question: "How do I follow experts?",
          answer: "Browse the Experts tab or search for specific experts. Tap the 'Follow' button on their profile. You'll see their posts in your feed and get notifications about their latest insights."
        },
        {
          question: "What are investment rooms?",
          answer: "Investment rooms are community spaces focused on specific themes like 'Tech Stocks', 'ESG Investing', or 'Options Trading'. Join rooms to discuss strategies with like-minded investors."
        },
        {
          question: "How do I participate in debates?",
          answer: "Go to the Debates section, browse active topics, and vote on your position. You can also start new debates by posting controversial investment opinions or market predictions."
        }
      ]
    },
    "privacy-&-security": {
      title: "Privacy & Security",
      icon: Shield, 
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Account safety and data protection",
      faqs: [
        {
          question: "Is my personal data secure?",
          answer: "Yes, we use bank-level encryption and never share your personal information with third parties. You can control your privacy settings in the Settings menu to choose what information is visible to other users."
        },
        {
          question: "How do I change my privacy settings?",
          answer: "Go to Settings → Privacy. You can control who can see your posts, follow you, send messages, and view your investment activity. Set different levels for public, followers, or private."
        },
        {
          question: "How do I report inappropriate content?",
          answer: "Tap the three dots on any post or comment and select 'Report'. Choose the reason (spam, harassment, misinformation) and our moderation team will review within 24 hours."
        }
      ]
    },
    "premium-features": {
      title: "Premium Features",
      icon: CreditCard,
      color: "text-orange-600", 
      bgColor: "bg-orange-50",
      description: "Subscriptions and expert content",
      faqs: [
        {
          question: "What's included in Premium?",
          answer: "Premium includes unlimited watchlist items, advanced analytics, exclusive expert content, priority customer support, and early access to new features. Plans start at ₹299/month."
        },
        {
          question: "How do I upgrade to Premium?",
          answer: "Go to Settings → Subscription and choose your plan. We accept UPI, cards, and net banking. You can cancel anytime and keep Premium features until your billing period ends."
        },
        {
          question: "Can I get expert recommendations?",
          answer: "Premium users get access to expert stock picks, detailed analysis reports, and personalized investment recommendations based on your risk profile and interests."
        }
      ]
    }
  };

  const category = categoryData[categorySlug || ""] || categoryData["getting-started"];
  const IconComponent = category.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/help-center">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">{category.title}</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pb-24 space-y-4">
        
        {/* Category Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-3 rounded-lg ${category.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${category.color}`} />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{category.title}</h2>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {category.faqs.map((faq: any, index: number) => (
              <div key={index} className="border rounded-lg">
                <button
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="px-3 pb-3 border-t border-gray-100 pt-3 mt-3">
                    <p className="text-sm text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Still need help?</h3>
            <div className="space-y-2">
              <Link href="/help/contact">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
              <Link href="/help/guide">
                <Button variant="outline" className="w-full">
                  View User Guide
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}