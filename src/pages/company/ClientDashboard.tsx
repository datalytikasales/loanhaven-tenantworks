import { useParams } from 'react-router-dom';
import { CompanyDashboardLayout } from '@/components/company/CompanyDashboardLayout';

export default function ClientDashboard() {
  const { companyUsername } = useParams();

  return (
    <CompanyDashboardLayout userRole="client">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the client dashboard for {companyUsername}. 
          This is a placeholder page - content will be added soon.
        </p>
      </div>
    </CompanyDashboardLayout>
  );
}