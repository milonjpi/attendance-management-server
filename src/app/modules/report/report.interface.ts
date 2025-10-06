import { Employee, Location } from '@prisma/client';

export type IEmployeeReportFilters = {
  searchTerm?: string;
  employeeId?: string;
  designationId?: string;
  departmentId?: string;
  locationId?: string;
  startDate?: string;
  endDate?: string;
  isActive?: string;
  isOwn?: string;
};
export type IEmployeeSalary = {
  officeId: string;
  fullName: string;
  designation: string;
  department: string;
  joiningDate: string;
  branch: string;
  address: string;
  totalDay: number;
  weekends: number;
  workingDay: number;
  presents: number;
  leaves: number;
  absent: number;
  salary: number;
  earnSalary: number;
  deduction: number;
};

export type IExpenseSummaryFilter = {
  startDate?: string;
  endDate?: string;
  month?: string;
  year?: string;
  locationId?: string;
};

export type IExpenseSummaryResponse = {
  location: Location;
  conveyances: number;
  bills: number;
  salaries: number;
  totalExpenses: number;
};

export type IExpenseSummaryYearResponse = {
  month: string;
  conveyances: number;
  bills: number;
  salaries: number;
  totalExpenses: number;
};

export type IExpenseSummaryLocation = {
  location: Location;
  conveyances: number;
  bills: number;
  salaries: number;
  totalExpenses: number;
};

export type IExpenseSummaryMonthResponse = {
  month: string;
  locations: IExpenseSummaryLocation[];
};

// employee wise conveyance summary
export type IEmployeeConveyance = {
  employee: Employee | undefined;
  amount: number;
};
