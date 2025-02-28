import { CompanyProvider } from "@/context/company-context";

import { CompanyDashboard } from "@/components/company-dashboard";
import { CompanyEmployees } from "@/components/company-employees";

export default function Home() {
  return (
    <CompanyProvider>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Employee Benefits Manager</h1>

        <div className="mb-10">
          <CompanyDashboard />
        </div>

        <CompanyEmployees />
      </div>
    </CompanyProvider>
  );
}
