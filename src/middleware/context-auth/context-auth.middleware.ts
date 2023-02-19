import { container } from "../../config/dependency-injection/container";
import { ContextValue } from "../../model/context.graphql.model";
import { Logger } from "../../service/logger/logger.service";
import { UserService } from "../../service/user/user.service";

export const contextAuthMiddleware = (req: any): Promise<ContextValue> => {
  const userService = container.resolve(UserService);
  const logger = container.resolve(Logger);
  return new Promise(async (resolve) => {
    const sentValue = req.headers.authorization || "0";
    try {
      resolve({
        user: await userService.getUser(parseInt(sentValue)),
      });
    } catch (e) {
      logger.error(JSON.stringify(e));
      resolve({
        user: null,
      });
    }
  });
};
