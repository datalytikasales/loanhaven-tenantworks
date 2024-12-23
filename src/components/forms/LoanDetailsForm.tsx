import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LoanDetailsFormProps {
  form: UseFormReturn<any>;
  defaultValues?: any;
}

export function LoanDetailsForm({ form, defaultValues }: LoanDetailsFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="principal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loan Amount</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseFloat(e.target.value))}
                defaultValue={defaultValues?.principal}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={e => field.onChange(parseFloat(e.target.value))}
                defaultValue={defaultValues?.duration}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="duration_period"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration Period</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={defaultValues?.duration_period || field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration period" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Week">Week</SelectItem>
                <SelectItem value="Month">Month</SelectItem>
                <SelectItem value="Year">Year</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="loan_purpose"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Loan Purpose</FormLabel>
            <FormControl>
              <Textarea {...field} defaultValue={defaultValues?.loan_purpose} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}