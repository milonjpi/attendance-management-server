import { Conveyance } from '@prisma/client';

export type IConveyanceFilters = {
  searchTerm?: string;
  officeId?: string;
  locationId?: string;
  approverId?: string;
  startDate?: string;
  endDate?: string;
  month?: string;
  year?: string;
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
