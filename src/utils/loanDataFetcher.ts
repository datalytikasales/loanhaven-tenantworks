import { supabase } from "@/integrations/supabase/client";
import { LoanData, Period, InterestModel, RepaymentSchedule } from "./loanTypes";

export const fetchLoanData = async (loanId: number): Promise<LoanData> => {
  console.log('Fetching loan data for ID:', loanId);
  
  const { data: loan, error: loanError } = await supabase
    .from('loans')
    .select(`
      principal,
      loan_tenor (
        duration,
        duration_period
      ),
      interest (
        interest_rate,
        interest_period,
        interest_model,
        repayment_installment
      )
    `)
    .eq('id', loanId)
    .maybeSingle();

  if (loanError) {
    console.error('Error fetching loan data:', loanError);
    throw loanError;
  }
  if (!loan) {
    console.error('Loan not found:', loanId);
    throw new Error('Loan not found');
  }

  console.log('Raw loan data from database:', loan);

  // Check if we have both tenor and interest data
  if (!loan.loan_tenor || !loan.interest) {
    console.error('Missing required loan data:', {
      hasTenor: !!loan.loan_tenor,
      hasInterest: !!loan.interest
    });
    throw new Error('Missing required loan data (tenor or interest)');
  }

  // Get the first tenor record since it's returned as an array
  const tenor = Array.isArray(loan.loan_tenor) ? loan.loan_tenor[0] : loan.loan_tenor;
  
  // Cast the duration_period to Period type after validating it's a valid value
  const duration_period = tenor.duration_period as Period;
  if (!['Week', 'Month', 'Year', 'Profit Margin'].includes(duration_period)) {
    throw new Error(`Invalid duration period: ${duration_period}`);
  }

  // Validate interest_model and repayment_installment
  if (!['Normal Simple Interest Model', 'Reducing Balance Model'].includes(loan.interest.interest_model)) {
    throw new Error(`Invalid interest model: ${loan.interest.interest_model}`);
  }

  if (!['Weekly', 'Monthly', 'Yearly', 'One Whole Installment'].includes(loan.interest.repayment_installment)) {
    throw new Error(`Invalid repayment installment: ${loan.interest.repayment_installment}`);
  }

  const loanData: LoanData = {
    principal: loan.principal,
    tenor: {
      duration: tenor.duration,
      duration_period
    },
    interest: {
      interest_rate: loan.interest.interest_rate,
      interest_period: loan.interest.interest_period as Period,
      interest_model: loan.interest.interest_model as InterestModel,
      repayment_installment: loan.interest.repayment_installment as RepaymentSchedule
    }
  };

  console.log('Processed loan data for calculations:', loanData);
  
  return loanData;
};