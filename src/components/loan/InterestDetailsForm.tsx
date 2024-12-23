import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const interestSchema = z.object({
  interest_rate: z.number().min(0, "Interest rate must be positive"),
  interest_period: z.enum(["Week", "Month", "Year", "Profit Margin"]),
  repayment_installment: z.enum(["Weekly", "Monthly", "Yearly", "One Whole Installment"]),
  interest_model: z.enum(["Normal Simple Interest Model", "Reducing Balance Model"])
});

interface InterestDetailsFormProps {
  onSubmit: (data: z.infer<typeof interestSchema>) => void;
  defaultValues?: z.infer<typeof interestSchema>;
}

export function InterestDetailsForm({ onSubmit, defaultValues }: InterestDetailsFormProps) {
  const form = useForm<z.infer<typeof interestSchema>>({
    resolver: zodResolver(interestSchema),
    defaultValues: defaultValues || {
      interest_rate: 0,
      interest_period: "Month",
      repayment_installment: "Monthly",
      interest_model: "Normal Simple Interest Model"
    }
  });

  const handleSubmit = (data: z.infer<typeof interestSchema>) => {
    console.log("Form data before submission:", data);
    onSubmit(data);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Interest Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="interest_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interest_period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Week">Per Week</SelectItem>
                        <SelectItem value="Month">Per Month</SelectItem>
                        <SelectItem value="Year">Per Year</SelectItem>
                        <SelectItem value="Profit Margin">Profit Margin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repayment_installment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repayment Schedule</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                        <SelectItem value="One Whole Installment">One Whole Installment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interest_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Normal Simple Interest Model">Normal Simple Interest</SelectItem>
                        <SelectItem value="Reducing Balance Model">Reducing Balance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">Submit Interest Details</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
