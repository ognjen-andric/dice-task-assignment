import { gql } from "@apollo/client/core";
import { useState } from "react";
import { getClient } from "../../client/apollo-client";

type Bet = {
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
  const [results, setResults] = useState<Bet[]>([]);
  console.log(amount, chance);

  const sendDice = async (e: any) => {
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

  return (
    <div>
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
          <p key={r.id}>
            {" "}
            ID : {r.id} - Wagered {r.betAmount} with {r.chance}% chance and
            received {r.payout} because you <span className={`${r.win} colored`}>{r.win ? "won 😊" : "lost 😔"}</span>
          </p>
        ))}
    </div>
  );
};
