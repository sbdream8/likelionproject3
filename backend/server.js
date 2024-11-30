import {ApolloServer, gql} from "apollo-server";

let users = [
  {
    id: "1",
    firstName: "Chanbin",
    lastName: "Na",
  },
  {
    id: "2",
    firstName: "Heesu",
    lastName: "Park",
  },
];

const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
    }

    type Query {
        allUsers: [User!]!
    }

    type Mutation {
        createUser(firstName: String!, lastName: String!): User!
    }
`;

const resolvers = {
    Query: {
        allUsers() {
            return users;
        }
    },

    Mutation: {
        createUser(_, {firstName, lastName}) {
            const newId =
                users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;
            const newUser = {
                id: newId,
                firstName: firstName,
                lastName: lastName
            }
            return newUser;
        },

        deleteUser(_, { id }) {
            const userIndex = users.findIndex((user) => user.id === id);
            if (userIndex === -1) {
                throw new Error("User not found");
            }

            const deletedUser = users.splice(userIndex, 1)[0];
            return deletedUser;
        },
    },

    User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
})