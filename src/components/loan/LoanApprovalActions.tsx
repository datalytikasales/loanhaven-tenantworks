import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LoanApprovalActionsProps {
  onApprove: () => void;
  loanId: string;
}

export function LoanApprovalActions({ onApprove, loanId }: LoanApprovalActionsProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`edit-loan`, { state: { loanId } });
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button onClick={onApprove}>Approve Loan</Button>
      <Button variant="outline" onClick={handleEdit}>Edit Loan</Button>
    </div>
  );
}