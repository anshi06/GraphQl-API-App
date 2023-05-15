const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/events");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

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
        type User {
          _id: ID!
          email: String!
          password: String
        }
        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }
        input UserInput {
          email: String!
          password: String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        return Event.find()
          .then((events) =>
            events.map((e) => {
              return { ...e._doc, _id: e.id };
            })
          )
          .catch((err) => console.log({ err }));
      },
      createEvent: async (args) => {
        const event = new Event({
          ...args.eventInput,
          date: new Date(args.eventInput.date),
          creator: '6461be5f7d533731663f53fb'
        });
        let createdEvent;
        return event
          .save()
          .then((res) => {
            createdEvent =  { ...res._doc,  _id: res._doc._id.toString()  };
            return User.findById('6461be5f7d533731663f53fb')
          })
          .then((user) => {
            if(!user){
              throw new Error("User not found.")
            }
            user.createdEvents.push(event)
            return user.save();
          })
          .then((result) => {
            return createdEvent;
          })
          .catch((err) => {
            console.log({ err });
            throw err;
          });
      },
      createUser: async (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) {
              //We have problem
              throw new Error("User already exists.");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, password: null, _id: result._doc._id.toString() };
          })
          .catch((err) => {
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
