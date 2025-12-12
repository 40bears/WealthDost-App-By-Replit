import { createFileRoute, redirect } from "@tanstack/react-router";
import PendingSebiApprovals from "@/pages/admin/pending-sebi-approvals";

export const Route = createFileRoute("/_auth/admin/pending-sebi-approvals")({
  beforeLoad: ({ context }) => {
    // Check if user is admin
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const isAdmin = userData.roles?.includes('admin') || false;

        if (!isAdmin) {
          throw redirect({
            to: '/dashboard',
          });
        }
      } catch (error) {
        throw redirect({
          to: '/dashboard',
        });
      }
    }
  },
  component: PendingSebiApprovals,
});
