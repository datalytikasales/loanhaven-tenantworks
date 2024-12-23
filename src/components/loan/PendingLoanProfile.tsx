import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { DollarSign, User, Calendar, FileText } from "lucide-react";
import { LoanApprovalSection } from "./LoanApprovalSection";

interface PendingLoanProfileProps {
  loanId: string;
  onApprove?: () => void;
}

export function PendingLoanProfile({ loanId, onApprove }: PendingLoanProfileProps) {
  const { data: loanData } = useQuery({
    queryKey: ['loan', loanId],
    queryFn: async () => {
      console.log("Fetching loan data for ID:", loanId);
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
          loan_tenor (
            duration,
            duration_period
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
        .eq('loan_id', loanId)
        .single();

      if (error) {
        console.error("Error fetching loan data:", error);
        throw error;
      }
      console.log("Fetched loan data:", data);
      return data;
    }
  });

  if (!loanData) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Client Summary Section */}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Client Details */}
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{loanData.clients.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{loanData.clients.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Place of Work</p>
                  <p className="text-sm text-muted-foreground">{loanData.clients.place_of_work || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Economic Activity</p>
                  <p className="text-sm text-muted-foreground">{loanData.clients.work_economic_activity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Purpose</p>
                  <p className="text-sm text-muted-foreground">{loanData.loan_purpose}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {loanData.loan_tenor[0]?.duration} {loanData.loan_tenor[0]?.duration_period}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Application By</p>
                  <p className="text-sm text-muted-foreground">
                    {loanData.loan_applicant_email} ({loanData.loan_applicant_role})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Guarantors */}
          <Card>
            <CardHeader>
              <CardTitle>Guarantors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanData.guarantors?.map((guarantor: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">{guarantor.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{guarantor.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">ID Number</p>
                        <p className="text-sm text-muted-foreground">{guarantor.national_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Place of Work</p>
                        <p className="text-sm text-muted-foreground">{guarantor.place_of_work}</p>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <a href={guarantor.id_photo_front} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                        View ID Front
                      </a>
                      <a href={guarantor.id_photo_back} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                        View ID Back
                      </a>
                      {guarantor.passport_photo && (
                        <a href={guarantor.passport_photo} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                          View Passport Photo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Collateral */}
          <Card>
            <CardHeader>
              <CardTitle>Collateral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanData.collateral?.map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Item</p>
                        <p className="text-sm text-muted-foreground">{item.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Value</p>
                        <p className="text-sm text-muted-foreground">KES {item.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <a href={item.pic_1} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                        View Photo 1
                      </a>
                      <a href={item.pic_2} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-sm">
                        View Photo 2
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interest Form and Approval Section */}
      <LoanApprovalSection 
        loanId={loanId}
        loanData={loanData}
        onApprove={onApprove}
      />
    </div>
  );
}