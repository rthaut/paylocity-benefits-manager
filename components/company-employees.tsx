"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { useCompany } from "@/context/company-context";

import { EmployeeTable } from "@/components/employee-table";
import { EmployeeForm } from "@/components/forms/employee-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CompanyEmployees() {
  const { employees, addEmployee } = useCompany();
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  const handleAddEmployee = (name: string) => {
    addEmployee({ name, dependents: [] });
    setIsAddingEmployee(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Employees</h2>
        <Button
          onClick={() => setIsAddingEmployee(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* TODO: instead of being an inline form, this should probably be a modal or drawer */}
      {isAddingEmployee && (
        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Add New Employee</h3>
            <EmployeeForm
              onSubmit={handleAddEmployee}
              onCancel={() => setIsAddingEmployee(false)}
            />
          </CardContent>
        </Card>
      )}

      {employees.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No employees added yet. Add your first employee to get started.
          </p>
        </div>
      ) : (
        <>
          {/* TODO: add pagination controls */}
          <EmployeeTable employees={employees} />
        </>
      )}
    </div>
  );
}
