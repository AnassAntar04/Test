import { DashboardStats } from "@/components/DashboardStats";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { IntegrationStatus } from "@/components/IntegrationStatus";

export const DashboardView = () => {
  return (
    <div className="space-y-8">
      <DashboardStats />
      <FeaturesGrid />
      <IntegrationStatus />
    </div>
  );
};