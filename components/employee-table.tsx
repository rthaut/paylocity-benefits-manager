"use client";

import { useState } from "react";

import { Inspect, Trash } from "lucide-react";

import type { Employee } from "@/lib/types";
import { calculateBenefitsForEmployee } from "@/lib/benefits";
import { formatCurrency } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DeleteEmployeeButton } from "@/components/delete-employee-button";
import { EmployeeDrawer } from "@/components/employee-drawer";

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead className="text-center">Dependents</TableHead>
              <TableHead className="text-right">Annual Benefits</TableHead>
              <TableHead className="text-right">Per Paycheck</TableHead>
              <TableHead className="text-right">Take-Home Pay</TableHead>
              <TableHead className="text-right">Discounts</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => {
              const employeeBenefits = calculateBenefitsForEmployee(employee);

              return (
                <TableRow key={employee.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Button
                      variant="link"
                      className="w-full cursor-pointer font-bold justify-start"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      {employee.name}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    {employee.dependents.length}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(employeeBenefits.totalCost)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(employeeBenefits.perPaycheckCost)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(employeeBenefits.takeHomePay)}
                  </TableCell>
                  <TableCell className="text-right">
                    {employeeBenefits.discountsApplied > 0 ? (
                      <span className="text-green-600">
                        {employeeBenefits.discountsApplied}x
                      </span>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteEmployeeButton employee={employee}>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </DeleteEmployeeButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <Inspect className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {selectedEmployee && (
        // TODO: because we are storing the employee object in state, rather than the ID, changes made to the employee don't reflect in the drawer (discovered this right at the end of my preset timer... :sad-face:)
        <EmployeeDrawer
          employee={selectedEmployee}
          open={true}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </>
  );
}
