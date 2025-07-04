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