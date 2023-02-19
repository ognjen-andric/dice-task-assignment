export const schema = `#graphql
    type User {
        id: ID!
        name: String!
        balance: Float!
    }

    extend type Query {
        getUser(id: Int!) : User
    }
`;
