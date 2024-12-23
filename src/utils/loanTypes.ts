export type Period = "Week" | "Month" | "Year" | "Profit Margin";
export type RepaymentSchedule = "Weekly" | "Monthly" | "Yearly" | "One Whole Installment";
export type InterestModel = "Normal Simple Interest Model" | "Reducing Balance Model";

export interface LoanData {
  principal: number;
  tenor: {
    duration: number;
    duration_period: Period;
  };
  interest: {
    interest_rate: number;
    interest_period: Period;
    interest_model: InterestModel;
    repayment_installment: RepaymentSchedule;
  };
}

export interface RepaymentScheduleItem {
  installmentNumber: number;
  dueDate: string;
  amount: number;
}