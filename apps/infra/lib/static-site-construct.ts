import * as cdk from "aws-cdk-lib";
import {
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_s3 as s3,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { StageConfig } from "../bin/stages";

export class StaticSiteConstruct extends Construct {
  constructor(scope: Construct, id: string, props: StageConfig) {
    super(scope, id);

    const siteBucketName = `${id.toLowerCase()}bucket-${props.stage}-${props.env.region}`;

    const siteBucket = new s3.Bucket(this, "StaticSiteBucket", {
      bucketName: siteBucketName,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });
  }
}
