import { LoanData, Period } from "./loanTypes";
import { convertToWeeks, convertToMonths, convertToYears } from "./loanPeriodConversions";

export const calculateInterest = async (loanData: LoanData): Promise<number> => {
  console.log('Calculating interest for loan data:', loanData);
  const { principal, tenor, interest } = loanData;

  // Validate all required data is present
  if (!interest?.interest_rate || !interest?.interest_period || !interest?.interest_model || !tenor?.duration || !tenor?.duration_period) {
    console.error('Missing required interest calculation data:', {
      hasInterestRate: !!interest?.interest_rate,
      hasInterestPeriod: !!interest?.interest_period,
      hasInterestModel: !!interest?.interest_model,
      hasTenorDuration: !!tenor?.duration,
      hasTenorPeriod: !!tenor?.duration_period
    });
    throw new Error('Missing required interest calculation data');
  }

  // Handle Profit Margin case first
  if (interest.interest_period === "Profit Margin") {
    console.log('Calculating profit margin interest');
    const profitMarginInterest = (principal * interest.interest_rate) / 100;
    console.log('Calculated profit margin interest:', profitMarginInterest);
    return profitMarginInterest;
  }

  // For other interest periods, normalize to annual rate
  let annualRate = interest.interest_rate;
  switch (interest.interest_period) {
    case "Week":
      annualRate = interest.interest_rate * 52;
      break;
    case "Month":
      annualRate = interest.interest_rate * 12;
      break;
    case "Year":
      annualRate = interest.interest_rate;
      break;
    default:
      console.error('Invalid interest period:', interest.interest_period);
      throw new Error('Invalid interest period');
  }

  console.log('Normalized annual interest rate:', annualRate);

  // Convert tenor to years for standardization
  const loanYears = convertToYears(tenor.duration, tenor.duration_period);
  console.log('Loan duration in years:', loanYears);
  
  if (interest.interest_model === "Normal Simple Interest Model") {
    const totalInterest = (principal * annualRate * loanYears) / 100;
    console.log('Calculated simple interest:', totalInterest);
    return totalInterest;
  } else if (interest.interest_model === "Reducing Balance Model") {
    let totalInterest = 0;
    let remainingPrincipal = principal;
    
    // Calculate number of installments based on repayment schedule
    let numberOfInstallments: number;
    switch (interest.repayment_installment) {
      case "Weekly":
        numberOfInstallments = convertToWeeks(tenor.duration, tenor.duration_period);
        break;
      case "Monthly":
        numberOfInstallments = convertToMonths(tenor.duration, tenor.duration_period);
        break;
      case "Yearly":
        numberOfInstallments = convertToYears(tenor.duration, tenor.duration_period);
        break;
      case "One Whole Installment":
        numberOfInstallments = 1;
        break;
      default:
        throw new Error('Invalid repayment installment type');
    }

    const principalPerInstallment = principal / numberOfInstallments;
    const ratePerInstallment = annualRate / (52 * numberOfInstallments); // Weekly rate

    for (let i = 0; i < numberOfInstallments; i++) {
      const installmentInterest = (remainingPrincipal * ratePerInstallment) / 100;
      totalInterest += installmentInterest;
      remainingPrincipal -= principalPerInstallment;
    }

    console.log('Calculated reducing balance interest:', totalInterest);
    return totalInterest;
  }

  throw new Error('Invalid interest model');
};