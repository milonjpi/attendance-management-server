import { Conveyance } from '@prisma/client';

export type IConveyanceFilters = {
  searchTerm?: string;
  officeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

type ISum = {
  _sum: {
    amount: number | null;
  };
};

export type IConveyanceResponse = {
  data: Conveyance[];
  sum: ISum;
};
