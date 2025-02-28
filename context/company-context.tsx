"use client";

// INFO: I'm using context for the company data (employees and their dependents) in lieu of actual API endpoints for speed and simplicity; I would definitely want to gather more requirements, but assuming Next.js is a viable framework (i.e. it is web-only), I think server actions could be a good fit for this use case.

import { createContext, useContext, useState, type ReactNode } from "react";

import type { Dependent, Employee } from "@/lib/types";
import { uuid } from "@/lib/utils";

type CompanyContextType = {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, employee: Omit<Employee, "id">) => void;
  deleteEmployee: (id: string) => void;
  addDependent: (employeeId: string, dependent: Omit<Dependent, "id">) => void;
  updateDependent: (
    employeeId: string,
    dependentId: string,
    dependent: Omit<Dependent, "id">
  ) => void;
  deleteDependent: (employeeId: string, dependentId: string) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  // INFO: for simplicity I'm storing dependents in an array within each employee; in the real world I would expect dependents to be stored in a separate table with foreign keys to employees
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: uuid(),
      name: "John Smith",
      dependents: [
        {
          id: uuid(),
          name: "Jane Smith",
          relationship: "spouse",
        },
        {
          id: uuid(),
          name: "Jimmy Smith",
          relationship: "child",
        },
      ],
    },
    {
      id: uuid(),
      name: "Alice Johnson",
      dependents: [
        {
          id: uuid(),
          name: "Bob Johnson",
          relationship: "spouse",
        },
      ],
    },
    {
      id: uuid(),
      name: "Andy Bernard",
      dependents: [],
    },
    {
      id: uuid(),
      name: "Phyllis Vance",
      dependents: [
        {
          id: uuid(),
          name: "Bob Vance",
          relationship: "spouse",
        },
      ],
    },
    {
      id: uuid(),
      name: "Jim Halpert",
      dependents: [
        {
          id: uuid(),
          name: "Pam Halpert",
          relationship: "spouse",
        },
        {
          id: uuid(),
          name: "Cecilia Halpert",
          relationship: "child",
        },
        {
          id: uuid(),
          name: "Phillip Halpert",
          relationship: "child",
        },
      ],
    },
  ]);

  /**
   * Adds a new employee
   * @param {Partial<Employee>} employee the employee to add
   */
  // TODO: this should verify the employee doesn't already exist (e.g., by checking for a duplicate name)
  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: uuid(),
    };
    setEmployees([...employees, newEmployee]);
  };

  /**
   * Updates an existing employee
   * @param {string} id the id of the employee
   * @param {Partial<Employee>} employee the updated employee
   */
  // TODO: this should verify the employee doesn't already exist (e.g., by checking for a duplicate name)
  const updateEmployee = (id: string, employee: Omit<Employee, "id">) => {
    setEmployees(
      employees.map((emp) => (emp.id === id ? { ...emp, ...employee } : emp))
    );
  };

  /**
   * Deletes an existing employee
   * @param {string} id the id of the employee
   * @throws {Error} if the employee does not exist
   */
  const deleteEmployee = (id: string) => {
    try {
      setEmployees((currentEmployees) =>
        currentEmployees.filter((emp) => emp.id !== id)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw new Error("Failed to delete employee");
    }
  };

  /**
   * Adds a new dependent to an employee
   * @param {string} employeeId the id of the employee
   * @param {Partial<Dependent>} dependent the dependent to add
   * @throws {Error} if the employee does not exist
   */
  // TODO: this should verify the dependent doesn't already exist (e.g., by checking for a duplicate name)
  const addDependent = (
    employeeId: string,
    dependent: Omit<Dependent, "id">
  ) => {
    try {
      // TODO: this will lead to concurrency/race conditions
      const currentEmployees = Array.from(employees);

      const employeeIdx = currentEmployees.findIndex(
        (emp) => emp.id === employeeId
      );
      if (employeeIdx === -1) {
        throw new Error("Employee not found");
      }

      currentEmployees[employeeIdx].dependents.push({
        ...dependent,
        id: uuid(),
      });

      setEmployees(currentEmployees);
    } catch (error) {
      console.error("Error adding dependent:", error);
      throw new Error("Failed to add dependent");
    }
  };

  /**
   * Updates an existing dependent for an employee
   * @param {string} employeeId the id of the employee
   * @param {string} dependentId the id of the dependent
   * @param {Partial<Dependent>} dependent the updated dependent
   * @throws {Error} if the employee or dependent does not exist
   */
  // TODO: this should verify the dependent doesn't already exist (e.g., by checking for a duplicate name)
  // INFO: this is a rather verbose way of performing the update, but due to the nested structure of dependents within employees, it is a good way to debug the process if something goes wrong. Again assuming dependents are stored in a separate table, I would expect this to be a much simpler method.
  const updateDependent = (
    employeeId: string,
    dependentId: string,
    dependent: Omit<Dependent, "id">
  ) => {
    try {
      // TODO: this will lead to concurrency/race conditions
      const currentEmployees = Array.from(employees);

      const employeeIdx = currentEmployees.findIndex(
        (emp) => emp.id === employeeId
      );
      if (employeeIdx === -1) {
        throw new Error("Employee not found");
      }

      const employeeToUpdate = currentEmployees[employeeIdx];

      const dependentIdx = employeeToUpdate.dependents.findIndex(
        (dep) => dep.id === dependentId
      );
      if (dependentIdx === -1) {
        throw new Error("Dependent not found");
      }

      const dependentToUpdate = employeeToUpdate.dependents[dependentIdx];

      const updatedDependent = {
        ...dependentToUpdate,
        ...dependent,
      };

      currentEmployees[employeeIdx].dependents[dependentIdx] = updatedDependent;

      setEmployees(currentEmployees);
    } catch (error) {
      console.error("Error updating dependent:", error);
      throw new Error("Failed to update dependent");
    }
  };

  /**
   * Deletes an existing dependent from an employee
   * @param {string} employeeId the id of the employee
   * @param {string} dependentId the id of the dependent
   * @throws {Error} if the employee or dependent does not exist
   */
  // INFO: this is also a verbose way to perform the delete; in the real world I would unlink and/or toggle a flag on the dependent's entry in the table to do a soft delete.
  const deleteDependent = (employeeId: string, dependentId: string) => {
    try {
      // TODO: this will lead to concurrency/race conditions
      const currentEmployees = Array.from(employees);

      const employeeIdx = currentEmployees.findIndex(
        (emp) => emp.id === employeeId
      );
      if (employeeIdx === -1) {
        throw new Error("Employee not found");
      }

      const employeeToUpdate = currentEmployees[employeeIdx];

      const dependentIdx = employeeToUpdate.dependents.findIndex(
        (dep) => dep.id === dependentId
      );
      if (dependentIdx === -1) {
        throw new Error("Dependent not found");
      }

      currentEmployees[employeeIdx].dependents.splice(dependentIdx, 1);

      setEmployees(currentEmployees);
    } catch (error) {
      console.error("Error deleting dependent:", error);
      throw new Error("Failed to delete dependent");
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDependent,
        updateDependent,
        deleteDependent,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
