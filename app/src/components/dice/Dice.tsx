import { gql } from "@apollo/client/core";
import { useState, useEffect } from "react";
import { getClient } from "../../client/apollo-client";
import { Balance } from "../balance/Balance";
import { DiceResult } from "./DiceResult";

export type Bet = {
  betAmount: number;
  chance: number;
  id: string;
  payout: number;
  userId: number;
  win: boolean;
};

export const Dice = () => {
  const [userId, setUserId] = useState<number>(1);
  const [amount, setAmount] = useState<number>(100);
  const [chance, setChance] = useState<number>(45);
  const [balance, setBalance] = useState<number>(0);
  const [results, setResults] = useState<Bet[]>([]);
  const [nextHash, setNextHash] = useState<string>("Loading hash...");
  console.log(amount, chance);

  const getNewHash = async () => {
    try {
      const client = getClient(userId);
      const res = await client.query({
        query: gql`
        query GetNextFairness {
          getNextFairness {
            hash,
          }
        }`
      });
      setNextHash(res.data.getNextFairness.hash);
    } catch (e) {
      alert(e);
    }
  }
  const sendDice = async () => {
    try {
      const client = getClient(userId);
      const res = await client.mutate({
        mutation: gql`
          mutation CreateBet($input: BetInput) {
            createBet(input: $input) {
              betAmount
              win
              payout
              chance
              id
              userId
            }
          }
        `,
        variables: {
          input: {
            amount,
            chance,
          },
        },
      });
      if (res.data) {
        const betResult = res.data.createBet as Bet;
        const newResults = results.concat([betResult]);
        setResults(newResults);
      }
    } catch (e) {
      alert(e);
    }
  };
  const getBalance = async () => {
    try {
      const client = getClient(userId);
      const res = await client.query({
        query: gql`
          query GetUser($getUserId: Int!) {
            getUser(id: $getUserId) {
              balance
            }
          }
        `,
        variables: {
          getUserId: userId
        }
      });
      setBalance(res.data.getUser.balance);
    } catch (e) {
      alert(e);
    }
  }

  useEffect(() => {
    getBalance();
    getNewHash();
  }, [
    results
  ]);

  useEffect(() => {
    getNewHash();
  }, []);
  return (
    <div>
      <p>Next hash : {nextHash}</p>
      <Balance amount={balance}/>
      <div>
        <span>User ID : </span>{" "}
        <input
          value={userId}
          onChange={(e) => {
            setUserId(parseInt(e.target.value));
          }}
          type={"number"}
        />
      </div>

      <div>
        <span>Amount : </span>{" "}
        <input
          value={amount}
          onChange={(e) => {
            setAmount(parseInt(e.target.value));
          }}
          type={"number"}
        />
      </div>

      <div>
        <span>Chance : </span>{" "}
        <input
          value={chance}
          onChange={(e) => {
            setChance(parseInt(e.target.value));
          }}
          type={"range"}
        />
        <span>{chance}%</span>
      </div>

      <button onClick={sendDice}>Roll :) </button>

      <h4>Results : </h4>
      {results
        .sort((a, b) => parseInt(b.id) - parseInt(a.id))
        .map((r) => (
          <DiceResult bet={r} userId={userId}/>
        ))}
    </div>
  );
};
