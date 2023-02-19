export const resolvers = {
  Query: {
    getBet: () => {
      return null;
    },
  },
  Mutation: {
    createBet: (_: any, input: any) => {
      console.log(input);
      return null;
    },
  },
};
