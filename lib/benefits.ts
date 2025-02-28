import type { Employee } from "@/lib/types";

// INFO: this file was almost completely LLM generated. I really should have at least added tests for it.

export const EMPLOYEE_BENEFITS_COST_PER_YEAR = 1000;
export const DEPENDENT_BENEFITS_COST_PER_YEAR = 500;
export const DISCOUNT_RATE_A_NAME = 0.1;
export const PAYCHECKS_PER_YEAR = 26;
export const PAYCHECK_AMOUNT = 2000;

export const calculateBenefitsForEmployee = (employee: Employee) => {
  let discountsApplied = 0;

  // Calculate employee cost with potential discount
  let employeeCost = EMPLOYEE_BENEFITS_COST_PER_YEAR;
  const employeeDiscount = employee.name.toLowerCase().startsWith("a");
  if (employeeDiscount) {
    discountsApplied++;
    employeeCost = employeeCost * (1 - DISCOUNT_RATE_A_NAME);
  }

  // Calculate dependents cost with potential discounts
  let dependentsCost = 0;
  for (const dependent of employee.dependents) {
    let dependentCost = DEPENDENT_BENEFITS_COST_PER_YEAR;
    if (dependent.name.toLowerCase().startsWith("a")) {
      discountsApplied++;
      dependentCost = dependentCost * (1 - DISCOUNT_RATE_A_NAME);
    }
    dependentsCost += dependentCost;
  }

  // Calculate total cost and per-paycheck cost
  const totalCost = employeeCost + dependentsCost;
  const perPaycheckCost = totalCost / PAYCHECKS_PER_YEAR;
  const takeHomePay = PAYCHECK_AMOUNT - perPaycheckCost;

  return {
    employeeCost,
    dependentsCost,
    totalCost,
    discountsApplied,
    perPaycheckCost,
    takeHomePay,
  };
};

export const calculateCompanyBenefitsForEmployees = (employees: Employee[]) => {
  const totalEmployees = employees.length;
  const totalDependents = employees.reduce(
    (sum, emp) => sum + emp.dependents.length,
    0
  );
  const totalAnnualSalary =
    totalEmployees * PAYCHECK_AMOUNT * PAYCHECKS_PER_YEAR;

  let totalAnnualBenefitsCost = 0;
  let employeesWithDiscount = 0;
  let dependentsWithDiscount = 0;

  // Calculate total benefits cost
  employees.forEach((employee) => {
    const benefits = calculateBenefitsForEmployee(employee);
    totalAnnualBenefitsCost += benefits.totalCost;

    if (employee.name.toLowerCase().startsWith("a")) {
      employeesWithDiscount++;
    }

    employee.dependents.forEach((dependent) => {
      if (dependent.name.toLowerCase().startsWith("a")) {
        dependentsWithDiscount++;
      }
    });
  });

  return {
    totalEmployees,
    totalDependents,
    totalAnnualSalary,
    totalAnnualBenefitsCost,
    totalCompensation: totalAnnualSalary + totalAnnualBenefitsCost,
    employeesWithDiscount,
    dependentsWithDiscount,
    averageBenefitCostPerEmployee: totalEmployees
      ? totalAnnualBenefitsCost / totalEmployees
      : 0,
    benefitsPercentage: totalAnnualSalary
      ? (totalAnnualBenefitsCost / totalAnnualSalary) * 100
      : 0,
  };
};
