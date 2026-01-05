import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Save, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@apollo/client/react";
import { UPDATE_MY_PROFILE } from "@/graphql/user/mutations";
import type { UpdateMyProfileResponse, UpdateMyProfileVariables } from "@/graphql/user/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
  });

  // Initialize profile from user data
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || "",
        email: user.email || "",
        bio: user.profileBio || "",
      });
    }
  }, [user]);

  const [updateProfile, { loading: updateLoading }] = useMutation<
    UpdateMyProfileResponse,
    UpdateMyProfileVariables
  >(UPDATE_MY_PROFILE, {
    onCompleted: async () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      // Refresh the user profile in auth context
      await refreshProfile();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSave = async () => {
    if (!profile.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    // Split name into firstName and lastName
    const nameParts = profile.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    await updateProfile({
      variables: {
        input: {
          firstName,
          lastName,
          fullName: profile.name.trim(),
          email: profile.email.trim(),
          profileBio: profile.bio.trim(),
        },
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  console.log("Rendering with isEditing:", isEditing, "profile:", profile);

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
              onClick={() => {
                console.log("Edit button clicked, isEditing:", isEditing);
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              disabled={updateLoading}
            >
              {updateLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isEditing ? (
                <Save className="h-5 w-5" />
              ) : (
                <Edit className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-md mx-auto px-4 pb-24 space-y-4 mt-4">
        {/* Profile Picture & Basic Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                  {getInitials(profile.name || user.email)}
                </AvatarFallback>
              </Avatar>

              {isEditing ? (
                <div className="w-full space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Name</Label>
                    <Input
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                      placeholder="Enter your email"
                      type="email"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-1">{profile.name || "No name set"}</h2>
                  <p className="text-gray-600 text-sm mb-2">{profile.email}</p>
                </>
              )}

              <Badge variant="secondary" className="mb-2 mt-2">
                {user.roles?.[0] || 'Investor'}
              </Badge>
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
              <p className="text-sm text-gray-600">
                {profile.bio || "No bio added yet"}
              </p>
            )}
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
                <div className="text-2xl font-bold text-purple-600">
                  {user.totalPosts || 0}
                </div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {user.likesReceived || 0}
                </div>
                <div className="text-xs text-gray-500">Likes Received</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {user.watchlistCount || 0}
                </div>
                <div className="text-xs text-gray-500">Watchlists</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {user.totalComments || 0}
                </div>
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
