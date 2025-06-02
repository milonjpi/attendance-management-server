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
  branch: string;
  totalDay: number;
  weekend: number;
  workingDay: number;
  presents: number;
  leaves: number;
  absent: number;
  salary: number;
};
