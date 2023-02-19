import { container } from "../../../config/dependency-injection/container";
import { UserService } from "../../../service/user/user.service";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    getUser: async (_: any, args: { id: number }) => {
      const { id } = args;
      const userService = container.resolve(UserService);
      const user = await userService.getUser(id);
      if (!user) throw new GraphQLError("User could not be found.");
      return user;
    },
    getUserList: async () => {
      const userService = container.resolve(UserService);
      return userService.getAllUsers();
    },
  },
  Mutation: {},
};
