export type BoilerplateFairness = {
    userId: number;
}

export type HiddenFairness = BoilerplateFairness & {
    id: number;
    hash: string
}

export type ShownFairness = HiddenFairness & {
    result: number;
    secret: string;
}

export type FinishedFairness = ShownFairness & {
    gameId: number;
}