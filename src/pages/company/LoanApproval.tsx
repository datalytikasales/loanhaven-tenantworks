import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyDashboardLayout } from '@/components/company/CompanyDashboardLayout';
import { PendingLoanProfile } from '@/components/loan/PendingLoanProfile';

export default function LoanApproval() {
  const { companyUsername } = useParams();

  const { data: company } = useQuery({
    queryKey: ['company', companyUsername],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, company_name')
        .eq('company_username', companyUsername)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: pendingLoans, refetch: refetchLoans } = useQuery({
    queryKey: ['pending-loans', company?.id],
    enabled: !!company?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('loan_id')
        .eq('loan_status', 'Pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <CompanyDashboardLayout userRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Loan Approval</h1>
        <div className="space-y-6">
          {pendingLoans?.map((loan) => (
            <PendingLoanProfile 
              key={loan.loan_id} 
              loanId={loan.loan_id}
              onApprove={refetchLoans}
            />
          ))}
          {pendingLoans?.length === 0 && (
            <p className="text-gray-500">No pending loans to approve.</p>
          )}
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
