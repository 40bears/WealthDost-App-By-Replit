import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4 p-2"
            onClick={() => window.history.back()}
          >
            ← Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
            <p className="text-sm text-gray-600">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
              <p className="text-gray-700">
                By accessing and using WealthDost, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Use License</h3>
              <p className="text-gray-700">
                Permission is granted to temporarily use WealthDost for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Investment Disclaimer</h3>
              <p className="text-gray-700">
                All investment information and advice provided on WealthDost is for educational purposes only. We do not provide investment advice and are not responsible for any investment decisions made based on our content.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. User Account</h3>
              <p className="text-gray-700">
                You are responsible for safeguarding your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Contact Information</h3>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at legal@wealthdost.com
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}