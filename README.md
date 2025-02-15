# Bitcoin game

## Application Architecture

<img src="./docs/architecture.jpg" alt="Application Architecture" />

### Frontend

- The website is served as a Single Page Application hosted in AWS S3 and served through cloudfront.
- The infra for this is maintained with `AWS CDK`. At the moment I do not have any domain for the
  project, but the hosted zone and certificate could be added easily to the stack.

### Backend

- The backend part is developed and deployed using `AWS SAM`.
- I ended up creating three lambdas:
  - **start**: This lambda is responsible for starting a new game. If first time user, it will
    create a new session and store it in dynamodb, then send a cookie to the client with the
    `sessionId` in it. This `sessionId` will be used in future accesses to the game so that the user
    can carry on with the score they had.
  - **score**: The job of this lambda is to get the guess information once it is resolved (the price
    at the time of the guess, the final price at the end, and what was the user's guess), calculate
    the new score, update it in the database then return it to the user. I also introduced the
    concept of variance, which indicates to the frontend by how much are we incrementing or
    decrementing the score on each guess resolution, so that the frontend can let the user know what
    was the different. This is also useful just in case we wanted to add any new business rules in
    the future around scores.
  - **price**: backend for frontend in charge of fetching the btc price from a third party API
    (cryptocompare).

**⚠️ Disclaimer:** This is not an ideal solution, because there is a lot of logic in the frontend
and the game rules could be bypassed easily with very little technical knowledge. The ideal solution
should go through implementing websockets in the backend to get real time updates from the server
and send messages to the backend from the frontend.

## More Information About the Apps

- [Backend](./apps/backend/README.md)
- [Frontend](./apps/frontend/README.md)
- [Infra](./apps/infra/README.md)
