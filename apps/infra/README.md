# Bitcoin Game Infra

This is just a regular AWS CDK project, written in Typescript.

## Boostrapping the project

If you want to run the project in your own infrastructure, you will need to bootstrap the project
first. You can do it by running:

```sh
npx cdk bootstrap aws://YOUR_AWS_ACCOUNT/us-east-1 --profile YOUR_PROFILE
```

or if running from the root folder:

```sh
npx cdk bootstrap aws://YOUR_AWS_ACCOUNT/us-east-1 --profile YOUR_PROFILE --workspace=infra
```

## Deploying the infrastructure

To deploy the infrastructure you just need to push to master branch. The secrets have already been
set (although this is not a good practice, it's good enough for a personal project) as action
environment variables. A github action will pick it up and carry out the deployment automatically.
