"use client";

import type { Employee } from "@/lib/types";
import { calculateBenefitsForEmployee } from "@/lib/benefits";
import { formatCurrency } from "@/lib/utils";

interface EmployeeBenefitsProps {
  employee: Employee;
  className?: string;
}

export function EmployeeBenefits({
  employee,
  className = "",
}: EmployeeBenefitsProps) {
  const employeeBenefits = calculateBenefitsForEmployee(employee);
  const {
    employeeCost,
    dependentsCost,
    discountsApplied,
    totalCost,
    perPaycheckCost,
    takeHomePay,
  } = employeeBenefits;

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Benefits Breakdown</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Employee Cost:</div>
          <div className="text-right">{formatCurrency(employeeCost)}/year</div>

          <div className="text-muted-foreground">Dependents Cost:</div>
          <div className="text-right">
            {formatCurrency(dependentsCost)}/year
          </div>

          {discountsApplied > 0 && (
            <>
              <div className="text-muted-foreground">Discount(s) Applied:</div>
              <div className="text-right text-green-600">
                {discountsApplied}x
              </div>
            </>
          )}

          <div className="text-foreground font-medium">Total Annual Cost:</div>
          <div className="text-right font-medium">
            {formatCurrency(totalCost)}/year
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Gross Pay:</div>
            <div className="text-right">$2,000.00/paycheck</div>

            <div className="text-muted-foreground">Benefits Deduction:</div>
            <div className="text-right text-destructive">
              -{formatCurrency(perPaycheckCost)}/paycheck
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-2 text-base">
            <div className="text-foreground font-medium">Take-Home Pay:</div>
            <div className="text-right font-medium">
              {formatCurrency(takeHomePay)}/paycheck
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
