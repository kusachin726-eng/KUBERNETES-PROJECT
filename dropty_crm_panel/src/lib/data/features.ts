export type Feature = {
  id: number;
  title: string;
  isActive: boolean;
  createdBy: number | null;
  updateBy: number | null;
  createdAt: string;
  updatedAt: string;
};

export type GetFeaturesApiResponse = {
  success: boolean;
  data: {
    rows: Feature[];
    count: number;
  };
};
