#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { BitcoinGameInfraStack } from "../lib/infra-stack";
import { STAGE_PROD_US_EAST_1 } from "./stages";

const app = new cdk.App();

// We could add here more stages here if applicable.
// To deploy a given stage we just need to pass the stack name to cdk deploy.
new BitcoinGameInfraStack(app, "BTCInfraStack-Dev-UsEast1", STAGE_PROD_US_EAST_1);
