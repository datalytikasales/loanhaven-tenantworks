import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface RecentApplication {
  loan_id: string;
  principal: number;
  created_at: string;
  loan_status: string;
  clients: {
    first_name: string;
    last_name: string;
  };
}

interface RecentApplicationsListProps {
  applications: RecentApplication[];
}

export function RecentApplicationsList({ applications }: RecentApplicationsListProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Applications</h2>
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.loan_id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border"
          >
            <div>
              <h3 className="font-medium">
                {application.clients.first_name} {application.clients.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                KES {application.principal.toLocaleString()} - {format(new Date(application.created_at), 'yyyy-MM-dd')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                {application.loan_status}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`loan/${application.loan_id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}