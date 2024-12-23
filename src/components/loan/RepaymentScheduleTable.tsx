import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { RepaymentScheduleItem } from "@/utils/loanTypes";

interface RepaymentScheduleTableProps {
  schedule: RepaymentScheduleItem[] | null;
}

export function RepaymentScheduleTable({ schedule }: RepaymentScheduleTableProps) {
  if (!schedule || schedule.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Repayment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No repayment schedule available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repayment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Installment</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount (KES)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((item) => (
              <TableRow key={item.installmentNumber}>
                <TableCell>{item.installmentNumber}</TableCell>
                <TableCell>{format(new Date(item.dueDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">{item.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}