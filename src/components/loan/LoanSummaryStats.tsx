import { DollarSign, User, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface LoanSummaryStatsProps {
  loanData: any;
}

export function LoanSummaryStats({ loanData }: LoanSummaryStatsProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-2">
            <DollarSign className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-2xl font-bold">KES {loanData.principal.toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">Loan Amount</p>
          </div>
          <div className="text-center space-y-2">
            <User className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-2xl font-bold">{loanData.clients.first_name} {loanData.clients.last_name}</h3>
            <p className="text-sm text-muted-foreground">ID: {loanData.clients.national_id}</p>
          </div>
          <div className="text-center space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-2xl font-bold">{format(new Date(loanData.created_at), 'MMM dd, yyyy')}</h3>
            <p className="text-sm text-muted-foreground">Application Date</p>
          </div>
          <div className="text-center space-y-2">
            <FileText className="w-8 h-8 mx-auto text-primary" />
            <h3 className="text-2xl font-bold">{loanData.loan_id}</h3>
            <p className="text-sm text-muted-foreground">Loan ID</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}