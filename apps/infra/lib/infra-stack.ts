import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { StageConfig } from "../bin/stages";

export class BitcoinGameInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StageConfig) {
    super(scope, id, props);
  }
}
