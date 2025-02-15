# Bitcoin Game Backend

## Getting Started

The backend part of the project has been developed using TDD. This is way more convenient than
having to test things manually locally or in the cloud: AWS SAM does not do any hot reloading and if
you have to deploy to the cloud on every little change, that'd have hindered our progress as the
development cycle would become really slow.

So, to get started with it I recommend simply running the tests:

```sh
npm run test --workspace=backend
```

## Application's Architecture

TODO

## Technology Choices

- AWS SAM to contain the HTTP API Gateway, DynamoDB and the Lambda Functions.
- Usually since I follow TDD for lambdas I simply use CDK to develop them and deploy them. Using CDK
  I feel I have more control over the resources than with SAM. However for this project I ended up
  using SAM because it can be run locally if we need.
- Although I didn't focus on getting the project running locally it can be done in a few easy steps:

```txt
1) Install tsx as dev dependency.

2) Add the content of this file in `scripts/setup-local-dynamodb.ts`:

----
import { DynamoDB } from "@aws-sdk/client-dynamodb";

async function createTable() {
  const dynamodb = new DynamoDB({
    endpoint: "http://localhost:8000",
    region: "local",
    credentials: {
      accessKeyId: "DUMMYIDEXAMPLE",
      secretAccessKey: "DUMMYEXAMPLEKEY",
    },
  });

  try {
    await dynamodb.createTable({
      TableName: "game-state-local",
      AttributeDefinitions: [{ AttributeName: "sessionId", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "sessionId", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
    });

    console.log("Table created successfully");
  } catch (error) {
    if (error instanceof Error && error.name === "ResourceInUseException") {
      console.log("Table already exists");
    } else {
      console.error("Error creating table:", error);
    }
  }
}

createTable();
----

3) Add these scripts to the package.json:

    "predev": "docker compose up -d && npm run build && tsx scripts/setup-local-dynamodb.ts",
    "dev": "sam local start-api --warm-containers EAGER --parameter-overrides Stage=local --docker-network btc-backend --profile personal",
```

## Deploying the Project

All the deployment is done for you from a Github Action. You can find its implementation at
[./github/workflows/deploy.yml](../../.github/workflows/deploy.yml)

```

```
