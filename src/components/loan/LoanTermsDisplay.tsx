import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoanTermsDisplayProps {
  interest: {
    interest_rate: number;
    interest_period: string;
    interest_model: string;
    repayment_installment: string;
  } | null;
  loan_tenor: {
    duration: number;
    duration_period: string;
  }[] | null;
}

export function LoanTermsDisplay({ interest, loan_tenor }: LoanTermsDisplayProps) {
  console.log('LoanTermsDisplay received:', { interest, loan_tenor });

  // Early return if no data
  if (!interest && !loan_tenor) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No loan terms data available</p>
        </CardContent>
      </Card>
    );
  }

  // Get the first tenor if it's an array
  const tenorData = Array.isArray(loan_tenor) ? loan_tenor[0] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Terms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Interest Rate</p>
            <p className="text-sm text-muted-foreground">
              {interest?.interest_rate}% per {interest?.interest_period}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Interest Model</p>
            <p className="text-sm text-muted-foreground">
              {interest?.interest_model || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Loan Tenor</p>
            <p className="text-sm text-muted-foreground">
              {tenorData ? `${tenorData.duration} ${tenorData.duration_period}` : 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Repayment Schedule</p>
            <p className="text-sm text-muted-foreground">
              {interest?.repayment_installment || 'Not specified'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}