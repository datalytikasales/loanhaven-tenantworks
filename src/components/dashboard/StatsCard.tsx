import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center p-6">
        <div className="rounded-full p-2 bg-gray-100">
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}