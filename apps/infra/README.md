# Bitcoin Game Infra

## Getting Started

This is just a regular AWS CDK project, written in Typescript.

## Application's Architecture

TODO

## Technology Choices

- The stack just contains a construct to deploy a static website.
- Chose CDK over other solutions since it's native to AWS and uses Typescript. This way we can have
  frontend developers writing Infrastructure as Code very rapidly.
- The website will be hosted in S3 and served through cloudfront.
- At the moment I do not have any domain for the project, but the hosted zone and certificate could
  be added easily to the stack.

## Deploying the Project

### Before Deploying: Boostrapping

If you want to run the project in your own infrastructure, you will need to bootstrap the project
first. You can do it by running:

```sh
npx cdk bootstrap aws://YOUR_AWS_ACCOUNT/us-east-1 --profile YOUR_PROFILE
```

or if running from the root folder:

```sh
npx cdk bootstrap aws://YOUR_AWS_ACCOUNT/us-east-1 --profile YOUR_PROFILE --workspace=infra
```

### Deploying the infrastructure

To deploy the infrastructure you just need to push to master branch. The secrets have already been
set (although this is not a good practice, it's good enough for a personal project) as action
environment variables. A github action will pick it up and carry out the deployment automatically.

You can find its implementation at
[./github/workflows/deploy.yml](../../.github/workflows/deploy.yml)
