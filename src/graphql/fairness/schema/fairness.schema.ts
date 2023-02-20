export const schema = `#graphql
    type OldFairness {
        id: ID!
        userId: Int!
        result: Int!
        secret: String!
        hash: String!
        gameId: Int
    }

    type NewFairness {
        id: ID!
        userId: Int!
        hash: String!
    }

    extend type Query {
        getNextFairness: NewFairness!
        getOldFairness(gameId: Int!) : OldFairness
    }
`;