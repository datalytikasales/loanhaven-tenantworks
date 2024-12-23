import { Period } from "./loanTypes";

export const convertToWeeks = (duration: number, period: Period): number => {
  switch (period) {
    case "Week":
      return duration;
    case "Month":
      return duration * 4.345; // Average weeks per month
    case "Year":
      return duration * 52.143; // Weeks per year
    case "Profit Margin":
      return duration; // For profit margin, we don't convert periods
    default:
      throw new Error(`Invalid period: ${period}`);
  }
};

export const convertToMonths = (duration: number, period: Period): number => {
  switch (period) {
    case "Week":
      return duration / 4.345;
    case "Month":
      return duration;
    case "Year":
      return duration * 12;
    case "Profit Margin":
      return duration; // For profit margin, we don't convert periods
    default:
      throw new Error(`Invalid period: ${period}`);
  }
};

export const convertToYears = (duration: number, period: Period): number => {
  switch (period) {
    case "Week":
      return duration / 52.143;
    case "Month":
      return duration / 12;
    case "Year":
      return duration;
    case "Profit Margin":
      return duration; // For profit margin, we don't convert periods
    default:
      throw new Error(`Invalid period: ${period}`);
  }
};