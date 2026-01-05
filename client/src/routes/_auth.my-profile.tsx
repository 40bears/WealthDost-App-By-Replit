import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Save, Loader2 } from "lucide-react";
import { useMyProfile } from "@/hooks/graphql";
import { useMutation } from "@apollo/client/react";
import { UPDATE_MY_PROFILE } from "@/graphql/user/mutations";
import type { UpdateMyProfileResponse, UpdateMyProfileVariables } from "@/graphql/user/types";
import { useToast } from "@/hooks/use-toast";
import { AccountDeletion } from "@/components/auth/AccountDeletion";

export const Route = createFileRoute("/_auth/my-profile")({
  component: MyProfilePage,
});

function MyProfilePage() {
  const { toast } = useToast();
  const { data, loading, error, refetch } = useMyProfile();
  const user = data?.myProfile;
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
        bio: user.profileBio || user.detailedBio || "",
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
      // Refresh the profile data
      await refetch();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Failed to load profile</div>
      </div>
    );
  }

  // Extract user data with fallbacks
  const fullName = user.fullName || `${user.firstName} ${user.lastName}`.trim() || user.username || "User";
  const email = user.email || "email@example.com";
  const phone = user.phone || "Not provided";
  const location = "Mumbai, India"; // TODO: Get from user profile
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "January 2024";
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const bio = user.profileBio || user.detailedBio || "No bio available";
  const riskTolerance = user.riskLevel || user.riskPersona || "Not specified";
  const interests = user.interests || [];
  const industrySectors = user.industrySectors || [];
  const topics = user.topics || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-4 pb-24">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-purple-600 hover:bg-purple-50"
            onClick={() => {
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
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {isEditing ? (
              <div className="w-full space-y-3 mb-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-200 focus-visible:ring-offset-0"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-200 focus-visible:ring-offset-0"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900">{fullName}</h2>
                <p className="text-sm text-gray-600 mb-2">{email}</p>
              </>
            )}

            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-medium mb-2">
              Value Investing
            </div>
            <p className="text-sm text-gray-500">Member since {memberSince}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Contact Information</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Phone</p>
              <p className="text-sm text-gray-600">{phone}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
              <p className="text-sm text-gray-600">{location}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Bio</h3>
          {isEditing ? (
            <Textarea
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-[100px] rounded-lg border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-200 focus-visible:ring-offset-0"
            />
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">
              {bio}
            </p>
          )}
        </div>

        {/* Investment Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Investment Preferences</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Risk Tolerance</p>
              <p className="text-sm text-gray-600">{riskTolerance}</p>
            </div>

            {interests.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {industrySectors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Industry Sectors</p>
                <div className="flex flex-wrap gap-2">
                  {industrySectors.map((sector) => (
                    <span key={sector} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {topics.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span key={topic} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Account Statistics</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{user.totalPosts || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Posts</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{user.likesReceived || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Likes Received</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{user.watchlistCount || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Watchlists</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{user.totalComments || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Comments</p>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <AccountDeletion
          deletionRequestedAt={user.deletionRequestedAt}
        />
      </div>
    </div>
  );
}
