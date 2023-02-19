export const schema = `#graphql
    type Bet {
        id: ID!
        userId: Int!
        betAmount: Float!
        chance: Float!
        payout: Float!
        win: Boolean!
    }

    input BetInput {
        amount: Float!
        chance: Float!
    }

    extend type Query{
        getBet(id: Int!) : Bet
        getBetList: [Bet!]!
        getBestBetPerUser(limit: Int): [Bet!]!
    }

    extend type Mutation{
        createBet(input: BetInput) : Bet
    }
`;
