import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Bell, Shield, Globe, Eye, Lock, Smartphone, Mail } from "lucide-react";
import { Link } from "wouter";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    posts: true,
    comments: true,
    likes: false,
    follows: true,
    marketAlerts: true,
    weeklyDigest: true,
    expertUpdates: true,
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showActivity: true,
    showWatchlist: false,
    allowMessages: true,
    showOnlineStatus: true,
  });

  const [preferences, setPreferences] = useState({
    language: "english",
    region: "india",
    currency: "inr",
    theme: "light",
  });

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (key: string) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Settings</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Notification Settings */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">Notification Preferences</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New Posts</p>
                <p className="text-xs text-gray-500">Get notified about new community posts</p>
              </div>
              <Switch
                checked={notifications.posts}
                onCheckedChange={() => handleNotificationToggle('posts')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Comments</p>
                <p className="text-xs text-gray-500">When someone comments on your posts</p>
              </div>
              <Switch
                checked={notifications.comments}
                onCheckedChange={() => handleNotificationToggle('comments')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Likes & Reactions</p>
                <p className="text-xs text-gray-500">When someone likes your content</p>
              </div>
              <Switch
                checked={notifications.likes}
                onCheckedChange={() => handleNotificationToggle('likes')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New Followers</p>
                <p className="text-xs text-gray-500">When someone follows you</p>
              </div>
              <Switch
                checked={notifications.follows}
                onCheckedChange={() => handleNotificationToggle('follows')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Market Alerts</p>
                <p className="text-xs text-gray-500">Price alerts for your watchlist</p>
              </div>
              <Switch
                checked={notifications.marketAlerts}
                onCheckedChange={() => handleNotificationToggle('marketAlerts')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Expert Updates</p>
                <p className="text-xs text-gray-500">Updates from experts you follow</p>
              </div>
              <Switch
                checked={notifications.expertUpdates}
                onCheckedChange={() => handleNotificationToggle('expertUpdates')}
              />
            </div>

            <div className="border-t pt-3 mt-4">
              <h4 className="text-sm font-medium mb-3">Delivery Methods</h4>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                />
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Email Notifications</span>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Privacy Settings</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">Profile Visibility</p>
                  <p className="text-xs text-gray-500">Who can see your profile</p>
                </div>
              </div>
              <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy(prev => ({ ...prev, profileVisibility: value }))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="followers">Followers Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Activity</p>
                <p className="text-xs text-gray-500">Let others see your likes and comments</p>
              </div>
              <Switch
                checked={privacy.showActivity}
                onCheckedChange={() => handlePrivacyToggle('showActivity')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Watchlist</p>
                <p className="text-xs text-gray-500">Make your watchlist visible to others</p>
              </div>
              <Switch
                checked={privacy.showWatchlist}
                onCheckedChange={() => handlePrivacyToggle('showWatchlist')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Allow Messages</p>
                <p className="text-xs text-gray-500">Let other users message you</p>
              </div>
              <Switch
                checked={privacy.allowMessages}
                onCheckedChange={() => handlePrivacyToggle('allowMessages')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Language & Region</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Language</p>
              <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                  <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Region</p>
              <Select value={preferences.region} onValueChange={(value) => setPreferences(prev => ({ ...prev, region: value }))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="uae">UAE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Currency</p>
              <Select value={preferences.currency} onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">₹ Indian Rupee (INR)</SelectItem>
                  <SelectItem value="usd">$ US Dollar (USD)</SelectItem>
                  <SelectItem value="gbp">£ British Pound (GBP)</SelectItem>
                  <SelectItem value="eur">€ Euro (EUR)</SelectItem>
                  <SelectItem value="aed">د.إ UAE Dirham (AED)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold">Account</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Eye className="mr-2 h-4 w-4" />
              Download My Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <Lock className="mr-2 h-4 w-4" />
              Deactivate Account
            </Button>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="pt-4">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;