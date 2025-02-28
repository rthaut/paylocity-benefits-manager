"use client";

import { DollarSign, Percent, Users } from "lucide-react";

import type { Employee } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { calculateCompanyBenefitsForEmployees } from "@/lib/benefits";

import { useCompany } from "@/context/company-context";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyOverviewCardsProps {
  employees: Employee[];
}

function CompanyOverviewCards({ employees }: CompanyOverviewCardsProps) {
  const companyBenefits = calculateCompanyBenefitsForEmployees(employees);
  const {
    totalEmployees,
    totalDependents,
    totalAnnualBenefitsCost,
    averageBenefitCostPerEmployee,
    benefitsPercentage,
    totalAnnualSalary,
  } = companyBenefits;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">
            With {totalDependents} dependents
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Annual Salary Costs
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalAnnualSalary)}
          </div>
          {totalAnnualSalary > 0 && (
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalAnnualSalary / totalEmployees)} per employee
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Annual Benefits Cost
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalAnnualBenefitsCost)}
          </div>
          {averageBenefitCostPerEmployee > 0 && (
            <p className="text-xs text-muted-foreground">
              {formatCurrency(averageBenefitCostPerEmployee)} per employee
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Benefits Percentage
          </CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {benefitsPercentage.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">of total compensation</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function CompanyDashboard() {
  const { employees } = useCompany();

  if (employees.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Company Benefits Dashboard</h2>
      <CompanyOverviewCards employees={employees} />
      {/* TODO: add some charts/graphs here? */}
    </div>
  );
}
