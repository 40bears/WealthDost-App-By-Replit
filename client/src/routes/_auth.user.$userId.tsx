import { createFileRoute } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/graphql";

export const Route = createFileRoute("/_auth/user/$userId")({
  component: UserProfilePage,
});

function UserProfilePage() {
  const { userId } = Route.useParams();
  const { data, loading, error } = useUserProfile(userId);
  const user = data?.userProfile;

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
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  const fullName = user.fullName || `${user.firstName} ${user.lastName}`.trim() || user.username || "User";
  const email = user.email || "email@example.com";
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-600 mb-2">{email}</p>
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
              <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
              <p className="text-sm text-gray-600">{location}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Bio</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {bio}
          </p>
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
      </div>
    </div>
  );
}
