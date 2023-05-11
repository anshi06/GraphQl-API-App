const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/events");

const app = express();
app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String! 
        }
        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: async() => {
        return Event.find()
          .then((events) =>
            events.map((e) => {
              return { ...e._doc, _id: e.id};
            })
          )
          .catch((err) => console.log({ err }));
      },
      createEvent: async(args) => {
        // let event = { ...args.eventInput, _id: Math.random().toString() };
        const event = new Event({
          ...args.eventInput,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((res) => {
            console.log({ res });
            return { ...res._doc };
          })
          .catch((err) => {
            console.log({ err });
            throw err;
          });
      },
    },
    graphiql: true,
  })
);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@atlascluster.xacsvte.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server Started!");
    });
  })
  .catch((err) => {
    console.log({ err });
  });
