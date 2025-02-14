import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { StageConfig } from "../bin/stages";
import { StaticSiteConstruct } from "./static-site-construct";

export class BitcoinGameInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StageConfig) {
    super(scope, id, props);

    new StaticSiteConstruct(this, "BTCStaticSite", props);
  }
}
