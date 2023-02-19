import { ApolloClient, InMemoryCache } from "@apollo/client";

export const getClient = (userId: number) => {
  return new ApolloClient({
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
    headers: {
      Authorization: `${userId}` || "non-auth",
    },
  });
};
