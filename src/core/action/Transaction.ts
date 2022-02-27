import { largerThan, lessThan, Money } from "../Money";
import { Fee } from "../Fee";
import { ActionType } from "./ActionType";

export interface Transaction {
    type: ActionType.Transaction;
    exchange: Exchange;
    transactionType: TransactionType;
    security: Security;
    quantity: number;
    value: Money;
}

export enum SecurityType {
    Share,
    ETF,
    Option,
    Bond,
}

export interface Share {
    type: SecurityType.Share;
    isin: string;
}

export interface ETF {
    type: SecurityType.ETF;
    isin: string;
}

export interface Bond {
    type: SecurityType.Bond;
    isin: string;
    maturity: number;
}

export interface Option {
    type: SecurityType.Option;
}

export type Security = Share | ETF | Bond | Option;

export enum TransactionType {
    Buy,
    Sell,
}

export const transactionTypes: TransactionType[] = [
    TransactionType.Buy,
    TransactionType.Sell,
];

export const securityTypes: SecurityType[] = [
    SecurityType.Share,
    SecurityType.ETF,
    SecurityType.Option,
    SecurityType.Bond,
];

// When adding new exchanges, add to the end so we don't mess up exchange ids
export enum Exchange {
    NYSE,
    Nasdaq,
    NasdaqHelsinki,
    NasdaqStockholm,
    NasdaqCopenhagen,
    JapanExchangeGroup,
    LuxembourgStockExchange,
    LondonStockExchange,
    ShanghaiStockExchange,
    HongKongStockExchange,
    EuronextAmsterdam,
    EuronextBrussels,
    EuronextDublin,
    EuronextLisbon,
    EuronextOslo,
    EuronextParis,
    TorontoStockExchange,
    ShenzhenStockExchange,
    BombayStockExchange,
    IndiaNationalStockExchange,
    ViennaStockExchange,
    AthensStockExchange,
    JohannesburgStockExchange,
    NationalStockExchangeOfAustralia,
    AustralianStockExchange,
    SingaporeStockExchange,
    BolsaDeMadrid,
    TokyoStockExchange,
    BorsaItaliana,
    Xetra,
    SIXSwissExchange,
    KoreaExchange,
    BorseFrankfurt,
    BudapestStockExchange,
    PragueStockExchange,
    BorsaInstanbul,
    WarsawStockExchange,
}

export const exchanges: Exchange[] = [
    Exchange.NYSE,
    Exchange.Nasdaq,
    Exchange.NasdaqHelsinki,
    Exchange.NasdaqCopenhagen,
    Exchange.JapanExchangeGroup,
    Exchange.LuxembourgStockExchange,
    Exchange.LondonStockExchange,
    Exchange.ShanghaiStockExchange,
    Exchange.HongKongStockExchange,
    Exchange.EuronextAmsterdam,
    Exchange.EuronextBrussels,
    Exchange.EuronextDublin,
    Exchange.EuronextLisbon,
    Exchange.EuronextOslo,
    Exchange.EuronextParis,
    Exchange.TorontoStockExchange,
    Exchange.ShenzhenStockExchange,
    Exchange.BombayStockExchange,
    Exchange.IndiaNationalStockExchange,
    Exchange.ViennaStockExchange,
    Exchange.AthensStockExchange,
    Exchange.JohannesburgStockExchange,
    Exchange.NationalStockExchangeOfAustralia,
    Exchange.AustralianStockExchange,
    Exchange.SingaporeStockExchange,
    Exchange.BolsaDeMadrid,
    Exchange.TokyoStockExchange,
    Exchange.BorsaItaliana,
    Exchange.Xetra,
    Exchange.SIXSwissExchange,
    Exchange.KoreaExchange,
    Exchange.BorseFrankfurt,
    Exchange.BudapestStockExchange,
    Exchange.PragueStockExchange,
    Exchange.BorsaInstanbul,
    Exchange.WarsawStockExchange,
];

export interface FeeInterval {
    openFrom: Money;
    closedTo?: Money;
    minimumFee?: Fee;
    maximumFee?: Fee;
    calculateFee?: (value: Money) => Fee;
}

export function calculateIntervalFees(transaction: Transaction, intervals: FeeInterval[]): Fee[] {
    const fees: Fee[] = [];
    for(const interval of intervals) {
        if(largerThan(transaction.value, interval.openFrom)) {
            if(interval.closedTo !== undefined) {
                if(largerThan(transaction.value, interval.closedTo)) {
                    continue;
                }
            }

            if(interval.calculateFee === undefined) {
                if (interval.minimumFee === undefined) {
                    throw new Error("minimumFee cannot be undefined while calculateFee is undefined");
                }
                fees.push(interval.minimumFee);
                break;
            }

            const calculatedFee = interval.calculateFee(transaction.value);
            const calculatedFeeMoney = calculatedFee.value;
            if(interval.minimumFee !== undefined && lessThan(calculatedFeeMoney, interval.minimumFee.value)) {
                fees.push(interval.minimumFee);
                break;
            }
            if(interval.maximumFee !== undefined && largerThan(calculatedFeeMoney, interval.maximumFee.value)) {
                fees.push(interval.maximumFee);
                break;
            }
            fees.push(calculatedFee);
            break;
        }
    }
    return fees;
}
