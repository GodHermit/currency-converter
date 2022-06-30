export type HeaderState = {
    fromUSD: number;
    fromEUR: number;
}

export type SymbolType = {
    code: string;
    description: string;
};

export type ConverterStateType = {
    symbols: SymbolType[];
    fromSymbolCode: string;
    toSymbolCode: string;
    fromAmount: number | '';
    toAmount: number | '';
    error: string;
};