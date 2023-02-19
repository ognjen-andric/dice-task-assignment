export const resolvers = {
  Query: {
    getUser: (_: any, id: number) => {
      console.log(id);
      return null;
    },
  },
  Mutation: {},
};
