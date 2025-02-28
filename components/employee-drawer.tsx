"use client";

import { useState } from "react";

import { Edit, UserPlus, Users } from "lucide-react";

import { Dependent, Employee, Relationship } from "@/lib/types";
import {
  calculateBenefitsForEmployee,
  PAYCHECKS_PER_YEAR,
} from "@/lib/benefits";

import { useCompany } from "@/context/company-context";

import { DeleteEmployeeButton } from "@/components/delete-employee-button";
import { DeleteDependentButton } from "@/components/delete-dependent-button";
import { DependentForm } from "@/components/forms/dependent-form";
import { EmployeeBenefits } from "@/components/employee-benefits";
import { EmployeeForm } from "@/components/forms/employee-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";

interface EmployeeDrawerProps {
  employee: Employee;
  open: boolean;
  onClose: () => void;
}

export function EmployeeDrawer({
  employee,
  open,
  onClose,
}: EmployeeDrawerProps) {
  const { updateEmployee, addDependent, updateDependent } = useCompany();
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [isAddingDependent, setIsAddingDependent] = useState(false);
  const [dependentToUpdate, setDependentToUpdate] = useState<Dependent | null>(
    null
  );

  // if the employee is not found (e.g., after deletion), force close the drawer
  if (!employee) {
    onClose();
    return null;
  }

  const employeeBenefits = calculateBenefitsForEmployee(employee);
  const { perPaycheckCost, totalCost } = employeeBenefits;

  const handleUpdateEmployee = (name: string) => {
    updateEmployee(employee.id, { ...employee, name });
    setIsEditingEmployee(false);
  };

  const handleAddDependent = (name: string, relationship: Relationship) => {
    addDependent(employee.id, { name, relationship });
    setIsAddingDependent(false);
  };

  const handleUpdateDependent = (name: string, relationship: Relationship) => {
    if (dependentToUpdate) {
      updateDependent(employee.id, dependentToUpdate.id, {
        name,
        relationship,
      });
    }
    setDependentToUpdate(null);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl">
        <div className="h-full flex flex-col">
          <SheetHeader className="flex-none pb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center justify-between space-x-2">
                  {/* TODO: this doesn't update when editing the employee name through the inline form */}
                  <SheetTitle className="text-xl">{employee.name}</SheetTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingEmployee(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {employee.dependents.length}{" "}
                  {employee.dependents.length === 1
                    ? "dependent"
                    : "dependents"}
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto pt-0 p-4">
            <div className="space-y-6">
              {isEditingEmployee && (
                <div className="w-full">
                  <EmployeeForm
                    initialName={employee.name}
                    onSubmit={handleUpdateEmployee}
                    onCancel={() => setIsEditingEmployee(false)}
                  />
                </div>
              )}
              <div className="bg-accent text-accent-foreground border border-accent-foreground/10 p-3 rounded-md text-sm mb-4">
                <p className="text-center">
                  Benefits cost is{" "}
                  <strong>${perPaycheckCost.toFixed(2)}</strong> per paycheck
                  <br />(<strong>${totalCost.toFixed(2)}</strong> annually over{" "}
                  <strong>{PAYCHECKS_PER_YEAR}</strong> pay periods)
                </p>
              </div>

              <div>
                <div className="flex flex-row justify-between items-center mb-4">
                  <h3 className="text-base font-medium">Dependents</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isAddingDependent}
                    onClick={() => setIsAddingDependent(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Dependent
                  </Button>
                </div>

                {isAddingDependent && (
                  <Card>
                    <CardContent>
                      <DependentForm
                        onSubmit={handleAddDependent}
                        onCancel={() => setIsAddingDependent(false)}
                      />
                    </CardContent>
                  </Card>
                )}

                {employee.dependents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No dependents added
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {employee.dependents.map((dependent) => (
                      <li key={dependent.id}>
                        {dependentToUpdate !== null &&
                        dependentToUpdate.id === dependent.id ? (
                          <Card>
                            <CardContent>
                              <DependentForm
                                initialName={dependent.name}
                                initialRelationship={dependent.relationship}
                                onSubmit={handleUpdateDependent}
                                onCancel={() => setDependentToUpdate(null)}
                              />
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted">
                            <div>
                              <span>{dependent.name}</span>
                              <Badge
                                variant="outline"
                                className="ml-2 capitalize"
                              >
                                {dependent.relationship}
                              </Badge>
                            </div>
                            <div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDependentToUpdate(dependent)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DeleteDependentButton
                                dependent={dependent}
                                employee={employee}
                              />
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Separator />

              <EmployeeBenefits employee={employee} />
            </div>
          </div>

          <SheetFooter>
            <DeleteEmployeeButton
              employee={employee}
              onDelete={() => onClose()}
            />
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
