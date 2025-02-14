export type StageConfig = {
  env: {
    awsAccountId: string;
    region: string;
  };
  stage: string;
};

export const STAGE_PROD_US_EAST_1: StageConfig = {
  env: {
    awsAccountId: "913524900415",
    region: "us-east-1",
  },
  stage: "dev",
};
