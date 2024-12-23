import { supabase } from "@/integrations/supabase/client";
import { LoanData, Period } from "./loanTypes";

export const fetchLoanData = async (loanId: number): Promise<LoanData> => {
  console.log('Fetching loan data for ID:', loanId);
  
  const { data: loan, error: loanError } = await supabase
    .from('loans')
    .select(`
      principal,
      loan_tenor!inner (
        duration,
        duration_period
      ),
      interest!inner (
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

  // Ensure we have both tenor and interest data
  if (!loan.loan_tenor?.[0] || !loan.interest?.[0]) {
    console.error('Missing required loan data:', {
      hasTenor: !!loan.loan_tenor?.[0],
      hasInterest: !!loan.interest?.[0]
    });
    throw new Error('Missing required loan data (tenor or interest)');
  }

  // Cast the duration_period to Period type after validating it's a valid value
  const duration_period = loan.loan_tenor[0].duration_period as Period;
  if (!['Week', 'Month', 'Year', 'Profit Margin'].includes(duration_period)) {
    throw new Error(`Invalid duration period: ${duration_period}`);
  }

  const loanData: LoanData = {
    principal: loan.principal,
    tenor: {
      duration: loan.loan_tenor[0].duration,
      duration_period
    },
    interest: {
      interest_rate: loan.interest[0].interest_rate,
      interest_period: loan.interest[0].interest_period as Period,
      interest_model: loan.interest[0].interest_model,
      repayment_installment: loan.interest[0].repayment_installment
    }
  };

  console.log('Processed loan data for calculations:', loanData);
  
  return loanData;
};