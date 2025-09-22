import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Camera, Save } from "lucide-react";
import { Link } from "wouter";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Rahul Kumar",
    email: "rahul.kumar@email.com",
    phone: "+91 98765 43210",
    bio: "Passionate investor focused on long-term value creation. Love analyzing market trends and sharing insights with the community.",
    location: "Mumbai, India",
    joinDate: "January 2024",
    investmentStyle: "Value Investing",
    riskTolerance: "Moderate",
    interests: ["Technology", "Healthcare", "Renewable Energy"],
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to backend
    console.log("Profile saved:", profile);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">My Profile</h1>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-purple-600"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-md mx-auto px-4 pb-24 space-y-4">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <div className="w-full space-y-3">
                  <Input
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-center font-semibold"
                  />
                  <Input
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="text-center text-sm"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-1">{profile.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{profile.email}</p>
                </>
              )}
              
              <Badge variant="secondary" className="mb-2">
                {profile.investmentStyle}
              </Badge>
              <p className="text-xs text-gray-500">Member since {profile.joinDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Contact Information</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Phone</Label>
              {isEditing ? (
                <Input
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{profile.phone}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Location</Label>
              {isEditing ? (
                <Input
                  value={profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{profile.location}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Bio</h3>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[80px]"
              />
            ) : (
              <p className="text-sm text-gray-600">{profile.bio}</p>
            )}
          </CardContent>
        </Card>

        {/* Investment Preferences */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Investment Preferences</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Risk Tolerance</Label>
              <p className="text-sm text-gray-600 mt-1">{profile.riskTolerance}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Interests</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Account Statistics</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">24</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-xs text-gray-500">Likes Received</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-xs text-gray-500">Watchlists</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">45</div>
                <div className="text-xs text-gray-500">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;