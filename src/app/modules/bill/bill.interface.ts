import { Bill } from '@prisma/client';

export type IBillFilters = {
  searchTerm?: string;
  locationId?: string;
  officeId?: string;
  approverId?: string;
  startDate?: string;
  endDate?: string;
  month?: string;
  year?: string;
  status?: string;
  isService?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};

export type IBillResponse = {
  data: Bill[];
  sum: ISum;
};
