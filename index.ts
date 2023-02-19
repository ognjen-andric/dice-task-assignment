import "reflect-metadata";
import { registerDependencies } from "./src/config/dependency-injection/register-dependencies";
import { startGraphql } from "./src/util/graphql.util";

(async () => {
  // Dependency Injection registration of dependencies to be used
  await registerDependencies();

  //Starts Apollo GraphQL
  await startGraphql();
})();
