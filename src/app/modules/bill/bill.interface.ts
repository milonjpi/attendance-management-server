import { Bill } from '@prisma/client';

export type IBillFilters = {
  searchTerm?: string;
  officeId?: string;
  startDate?: string;
  enDate?: string;
  status?: string;
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
