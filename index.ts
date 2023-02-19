import "reflect-metadata";
import { registerDependencies } from "./src/config/dependency-injection/register-dependencies";
import { startGraphqlServer } from "./src/server";

(async () => {
  // Dependency Injection registration of dependencies to be used
  await registerDependencies();

  //Starts Apollo GraphQL
  await startGraphqlServer();
})();
