"use client";

import { Trash } from "lucide-react";

import { Employee, Dependent } from "@/lib/types";

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
import { Button } from "@/components/ui/button";

interface DeleteDependentButtonProps {
  employee: Employee;
  dependent: Dependent;
}

export function DeleteDependentButton({
  employee,
  dependent,
}: DeleteDependentButtonProps) {
  const { deleteDependent } = useCompany();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* TODO: make this children instead so the parent component can control the button text/appearance */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive"
        >
          <Trash className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Dependent</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{dependent.name}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteDependent(employee.id, dependent.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
