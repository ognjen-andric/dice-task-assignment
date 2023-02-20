type BalProps = {
    amount: number;
}
export const Balance = (props: BalProps) => {
    return <div>
        Balance : {props.amount}
    </div>
}