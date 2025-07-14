import { Bill } from '@prisma/client';

export type IBillFilters = {
  searchTerm?: string;
  locationId?: string;
  officeId?: string;
  startDate?: string;
  endDate?: string;
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
