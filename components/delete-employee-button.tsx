"use client";

import { Employee } from "@/lib/types";

import { useCompany } from "@/context/company-context";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteEmployeeButtonProps {
  employee: Employee;
  onDelete?: () => void;
  children?: React.ReactNode;
}

export function DeleteEmployeeButton({
  employee,
  onDelete,
  children,
}: DeleteEmployeeButtonProps) {
  const { deleteEmployee } = useCompany();

  const handleDeleteEmployee = () => {
    deleteEmployee(employee.id);
    onDelete?.();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Employee</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{employee.name}</strong>?
            This will also delete all their dependents. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteEmployee}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
