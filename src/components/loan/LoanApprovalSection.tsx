import { InterestDetailsForm } from "./InterestDetailsForm";
import { LoanApprovalActions } from "./LoanApprovalActions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LoanApprovalSectionProps {
  loanId: string;
  loanData: any;
  onApprove?: () => void;
}

export function LoanApprovalSection({ loanId, loanData, onApprove }: LoanApprovalSectionProps) {
  const handleInterestSubmit = async (interestData: any) => {
    try {
      console.log("Attempting to insert interest data:", interestData);
      
      // Validate required fields
      if (!interestData.interest_rate || !interestData.interest_period || 
          !interestData.repayment_installment || !interestData.interest_model) {
        console.error("Missing required interest data fields");
        toast.error("Please fill in all interest details");
        return false;
      }

      // Format interest period to match database constraint
      const formattedInterestPeriod = interestData.interest_period.replace('Per ', '');

      // Begin transaction
      const { data: interestResult, error: interestError } = await supabase
        .from('interest')
        .insert({
          loan_id: loanData.id,
          interest_rate: parseFloat(interestData.interest_rate),
          interest_period: formattedInterestPeriod,
          repayment_installment: interestData.repayment_installment,
          interest_model: interestData.interest_model
        })
        .select()
        .single();

      if (interestError) {
        console.error("Error inserting interest data:", interestError);
        toast.error("Failed to set interest details");
        return false;
      }

      console.log("Successfully inserted interest data:", interestResult);
      return true;
    } catch (error) {
      console.error("Error in handleInterestSubmit:", error);
      toast.error("Failed to set interest details");
      return false;
    }
  };

  const handleApprove = async (interestData: any) => {
    try {
      console.log("Starting loan approval process");
      
      // First insert interest data
      const interestSuccess = await handleInterestSubmit(interestData);
      if (!interestSuccess) {
        console.error("Interest data insertion failed, aborting approval");
        return;
      }

      // Then update loan status
      console.log("Updating loan status to Active");
      const { error: loanError } = await supabase
        .from('loans')
        .update({ 
          loan_status: 'Active',
          status_change_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', loanData.id);

      if (loanError) {
        console.error("Error updating loan status:", loanError);
        throw loanError;
      }

      // Record status change
      console.log("Recording status change");
      const { error: statusError } = await supabase
        .from('loan_status_change')
        .insert({
          loan_id: loanData.id,
          loan_status: 'Active',
          loan_status_date: new Date().toISOString().split('T')[0]
        });

      if (statusError) {
        console.error("Error recording status change:", statusError);
        throw statusError;
      }

      console.log("Loan approval process completed successfully");
      toast.success("Loan approved successfully");
      if (onApprove) {
        onApprove();
      }
    } catch (error) {
      console.error("Error in handleApprove:", error);
      toast.error("Failed to approve loan");
    }
  };

  if (loanData?.loan_status !== 'Pending') {
    return null;
  }

  return (
    <>
      <InterestDetailsForm onSubmit={handleApprove} />
      <LoanApprovalActions 
        onApprove={() => handleApprove({})}
        loanId={loanId}
      />
    </>
  );
}