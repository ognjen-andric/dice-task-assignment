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
    }

    extend type Query{
        getBet(id: Int!) : Bet
    }

    extend type Mutation{
        createBet(input: BetInput) : Bet
    }
`;
