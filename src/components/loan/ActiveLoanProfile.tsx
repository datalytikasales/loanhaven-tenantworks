import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateRepaymentSchedule } from "@/utils/loanCalculations";
import { LoanSummaryStats } from "./LoanSummaryStats";
import { LoanTermsDisplay } from "./LoanTermsDisplay";
import { RepaymentScheduleTable } from "./RepaymentScheduleTable";
import { PaymentHistoryTable } from "./PaymentHistoryTable";
import { toast } from "sonner";

interface ActiveLoanProfileProps {
  loanId: number;
}

export function ActiveLoanProfile({ loanId }: ActiveLoanProfileProps) {
  console.log('ActiveLoanProfile mounted for loan:', loanId);

  const { data: loanData, isLoading: isLoadingLoan } = useQuery({
    queryKey: ['active-loan', loanId],
    queryFn: async () => {
      console.log('Fetching loan data for:', loanId);
      
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          clients (
            first_name,
            last_name,
            national_id,
            email,
            phone_number,
            place_of_work,
            work_economic_activity
          ),
          loan_tenor!inner (
            duration,
            duration_period
          ),
          interest!inner (
            interest_rate,
            interest_period,
            interest_model,
            repayment_installment
          ),
          guarantors (
            name,
            phone_number,
            national_id,
            place_of_work,
            id_photo_front,
            id_photo_back,
            passport_photo
          ),
          collateral (
            name,
            value,
            pic_1,
            pic_2
          )
        `)
        .eq('id', loanId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching loan data:', error);
        toast.error("Error loading loan data");
        throw error;
      }

      console.log('Fetched loan data:', data);
      return data;
    }
  });

  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ['loan-schedule', loanId, loanData?.id],
    queryFn: async () => {
      if (!loanData?.id) {
        console.log('No loan ID available for schedule calculation');
        return null;
      }

      console.log('Generating repayment schedule for loan ID:', loanData.id);
      try {
        const schedule = await generateRepaymentSchedule(loanData.id);
        console.log('Generated schedule:', schedule);
        return schedule;
      } catch (error) {
        console.error('Error generating schedule:', error);
        toast.error("Error calculating repayment schedule");
        return null;
      }
    },
    enabled: !!loanData?.id
  });

  if (isLoadingLoan || isLoadingSchedule) {
    return <div className="p-4">Loading loan details...</div>;
  }

  if (!loanData) {
    return <div className="p-4 text-red-500">No loan data found</div>;
  }

  const paymentHistory = [
    { date: '2024-03-01', amount: 5000 },
    { date: '2024-03-08', amount: 5000 },
  ];

  return (
    <div className="space-y-6">
      <LoanSummaryStats loanData={loanData} />
      <LoanTermsDisplay 
        interest={loanData.interest} 
        loan_tenor={loanData.loan_tenor} 
      />
      {schedule && <RepaymentScheduleTable schedule={schedule} />}
      <PaymentHistoryTable payments={paymentHistory} />
    </div>
  );
}
