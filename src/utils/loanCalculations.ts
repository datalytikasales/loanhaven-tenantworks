import { addWeeks, addMonths, addYears, parseISO, format } from "date-fns";
import { RepaymentScheduleItem, LoanData } from "./loanTypes";
import { fetchLoanData } from "./loanDataFetcher";
import { calculateInterest } from "./loanInterestCalculator";
import { convertToWeeks, convertToMonths, convertToYears } from "./loanPeriodConversions";
import { supabase } from "@/integrations/supabase/client";

export const calculateRepaymentAmount = async (loanData: LoanData): Promise<number> => {
  console.log('Calculating repayment amount for loan data:', loanData);
  
  try {
    const totalInterest = await calculateInterest(loanData);
    console.log('Calculated total interest:', totalInterest);
    const totalAmount = loanData.principal + totalInterest;
    console.log('Total amount to repay:', totalAmount);

    let numberOfInstallments: number;
    switch (loanData.interest.repayment_installment) {
      case "Weekly":
        numberOfInstallments = convertToWeeks(
          loanData.tenor.duration,
          loanData.tenor.duration_period
        );
        break;
      case "Monthly":
        numberOfInstallments = convertToMonths(
          loanData.tenor.duration,
          loanData.tenor.duration_period
        );
        break;
      case "Yearly":
        numberOfInstallments = convertToYears(
          loanData.tenor.duration,
          loanData.tenor.duration_period
        );
        break;
      case "One Whole Installment":
        numberOfInstallments = 1;
        break;
      default:
        throw new Error("Invalid repayment schedule");
    }

    const installmentAmount = totalAmount / numberOfInstallments;
    console.log('Calculated installment amount:', installmentAmount);
    return installmentAmount;
  } catch (error) {
    console.error('Error in calculateRepaymentAmount:', error);
    throw error;
  }
};

export const generateRepaymentSchedule = async (
  loanId: number
): Promise<RepaymentScheduleItem[]> => {
  console.log('Generating repayment schedule for loan ID:', loanId);
  
  try {
    const loanData = await fetchLoanData(loanId);
    console.log('Fetched loan data for schedule:', loanData);
    
    const repaymentAmount = await calculateRepaymentAmount(loanData);
    console.log('Calculated repayment amount:', repaymentAmount);

    // Get loan activation date
    const { data: statusChange, error: statusError } = await supabase
      .from('loan_status_change')
      .select('created_at')
      .eq('loan_id', loanId)
      .eq('loan_status', 'Active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (statusError) {
      console.error('Error fetching loan status:', statusError);
      throw statusError;
    }
    if (!statusChange) {
      console.error('No activation date found for loan:', loanId);
      throw new Error('No activation date found');
    }

    const startDate = parseISO(statusChange.created_at);
    const schedule: RepaymentScheduleItem[] = [];

    let numberOfInstallments: number;
    let addDate: (date: Date, amount: number) => Date;

    switch (loanData.interest.repayment_installment) {
      case "Weekly":
        numberOfInstallments = convertToWeeks(
          loanData.tenor.duration,
          loanData.tenor.duration_period
        );
        addDate = addWeeks;
        break;
      case "Monthly":
        numberOfInstallments = convertToMonths(
          loanData.tenor.duration,
          loanData.tenor.duration_period
        );
        addDate = addMonths;
        break;
      case "Yearly":
        numberOfInstallments = convertToYears(
          loanData.tenor.duration,
          loanData.tenor.duration_period
        );
        addDate = addYears;
        break;
      case "One Whole Installment":
        numberOfInstallments = 1;
        addDate = addMonths; // Default to months for one-time payment
        break;
      default:
        throw new Error("Invalid repayment schedule");
    }

    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = addDate(startDate, i + 1);
      schedule.push({
        installmentNumber: i + 1,
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        amount: repaymentAmount
      });
    }

    console.log('Generated schedule:', schedule);
    return schedule;
  } catch (error) {
    console.error('Error generating repayment schedule:', error);
    throw error;
  }
};