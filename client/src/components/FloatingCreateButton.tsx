import { useState } from "react";
import { Plus, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnhancedCreatePostModal from "@/components/dashboard/EnhancedCreatePostModal";
import AuthPrompt from "@/components/auth/AuthPrompt";
import { useAuth } from "@/hooks/useAuth";

interface FloatingCreateButtonProps {
  className?: string;
}

const FloatingCreateButton = ({ className = "" }: FloatingCreateButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleOptionSelect = (type: 'post' | 'tip') => {
    setShowOptions(false);
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleMainButtonClick = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setShowOptions(!showOptions);
  };

  return (
    <>
      {/* Floating Button */}
      <div className={`fixed bottom-20 right-4 z-40 ${className}`}>
        {/* Options Menu */}
        {showOptions && (
          <Card className="absolute bottom-16 right-0 w-48 shadow-lg mb-2 animate-in slide-in-from-bottom-2 duration-200">
            <CardContent className="p-2">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => handleOptionSelect('post')}
                >
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Create Post</div>
                    <div className="text-xs text-gray-500">Share thoughts & insights</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => handleOptionSelect('tip')}
                >
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Stock Tip</div>
                    <div className="text-xs text-gray-500">Share investment advice</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Floating Button */}
        <Button
          onClick={handleMainButtonClick}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 group"
          size="sm"
        >
          <Plus 
            className={`h-6 w-6 text-white transition-transform duration-200 ${
              showOptions ? 'rotate-45' : 'rotate-0'
            }`} 
          />
        </Button>
      </div>

      {/* Backdrop to close options */}
      {showOptions && (
        <div 
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setShowOptions(false)}
        />
      )}

      {/* Create Post Modal */}
      <EnhancedCreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={() => {
          console.log('Post created from floating button');
        }}
      />

      {/* Auth Prompt */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        onSuccess={() => {
          setShowAuthPrompt(false);
          setIsModalOpen(true);
        }}
        message="Sign in to create posts and share your insights with the community."
      />
    </>
  );
};

export default FloatingCreateButton;