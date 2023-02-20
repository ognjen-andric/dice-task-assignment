import { gql } from "@apollo/client";
import { getClient } from "../../client/apollo-client";
import { Bet } from "./Dice";

type DiceResultProps = {
    bet: Bet,
    userId: number;
}

export const DiceResult = (props: DiceResultProps) => {
    const {bet, userId} = props;

    const verifyGame = async () => {
        console.log('Verifying game with id : '+bet.id);
        try {
        const client = getClient(userId);
        const res = await client.query({
            query: gql`
            query GetOldFairness($gameId: Int!) {
                getOldFairness(gameId: $gameId) {
                    hash,
                    result,
                    secret
                }
            }
            `,
            variables: {
                gameId: parseInt(bet.id)
            }
        });
        const {hash, result, secret} = res.data.getOldFairness;
        alert(`You can verify fairness by using online HMAC tools like : https://www.devglan.com/online-tools/hmac-sha256-online. Result : ${result} , Hash : ${hash}, Secret : ${secret}`);
        } catch (e) {
            alert(e);
        }
    }
    
    return <p key={bet.id}>
            {" "}
            ID : {bet.id} - Wagered {bet.betAmount} with {bet.chance}% chance and
            received {bet.payout} because you <span className={`${bet.win} colored`}>{bet.win ? "won 😊" : "lost 😔"}</span>
            <button onClick={verifyGame}>Verify fairness</button>
          </p>
}