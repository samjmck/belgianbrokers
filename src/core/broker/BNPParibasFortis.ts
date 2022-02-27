import { calculateIntervalFees, Exchange, FeeInterval, SecurityType, Transaction } from "../action/Transaction";
import { CurrencyType } from "../Money";
import { Fee } from "../Fee";
import { formatMoney, formatPercentage } from "../i18n/language";
import { Broker, BrokerName } from "./Broker";
import { Action } from "../action/Action";
import { ActionType } from "../action/ActionType";

function getGroup1FeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            closedTo: [CurrencyType.EUR, 10000_00],
            minimumFee: new Fee(
                [CurrencyType.EUR, 30_00],
                "fee.type.transaction",
                "fee.description.interval.minimum",
                [
                    locale => formatMoney([CurrencyType.EUR, 30_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                    locale => formatMoney([CurrencyType.EUR, 10000_00], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.01],
                "fee.type.transaction",
                "fee.description.interval.calculation",
                [
                    locale => formatPercentage(0.01, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.01], locale),
                ]
            ),
        },
        {
            openFrom: [CurrencyType.EUR, 10000_00],
            closedTo: [CurrencyType.EUR, 25000_00],
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0085],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0085, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0085], locale),
                ]
            ),
        },
        {
            openFrom: [CurrencyType.EUR, 25000_00],
            closedTo: [CurrencyType.EUR, 100000_00],
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.007],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.007, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.007], locale),
                ]
            ),
        },
        {
            openFrom: [CurrencyType.EUR, 100000_00],
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.004],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.004, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.004], locale),
                ]
            ),
        },
    ];
}

function getGroup2FeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            closedTo: [CurrencyType.EUR, 25000_00],
            minimumFee: new Fee(
                [CurrencyType.EUR, 50_00],
                "fee.type.transaction",
                "fee.description.interval.minimum",
                [
                    locale => formatMoney([CurrencyType.EUR, 50_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                    locale => formatMoney([CurrencyType.EUR, 25000_00], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.012],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.012, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.012], locale),
                ]
            ),
        },
        {
            openFrom: [CurrencyType.EUR, 25000_00],
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.011],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.011, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.011], locale),
                ]
            ),
        },
    ];
}

function getGroup3FeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            closedTo: [CurrencyType.EUR, 10000_00],
            minimumFee: new Fee(
                [CurrencyType.EUR, 75_00],
                "fee.type.transaction",
                "fee.description.interval.minimum",
                [
                    locale => formatMoney([CurrencyType.EUR, 75_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                    locale => formatMoney([CurrencyType.EUR, 25000_00], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.014],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.014, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.014], locale),
                ]
            ),
        },
        {
            openFrom: [CurrencyType.EUR, 25000_00],
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.013],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.013, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.013], locale),
                ]
            ),
        },
    ];
}

export class BNPParibasFortis extends Broker {
    name = BrokerName.BNPParibasFortis;

    protected calculateActionFees(action: Action): Fee[] {
        switch(action.type) {
            case ActionType.Transaction:
                return BNPParibasFortis.getTransactionFees(action);
            default:
                return [];
        }
    }

    private static getTransactionFees(transaction: Transaction): Fee[] {
        switch(transaction.security.type) {
            case SecurityType.Share:
            case SecurityType.ETF:
                return BNPParibasFortis.calculateEquityFees(transaction);
        }
        return [];
    }

    private static calculateEquityFees(transaction: Transaction): Fee[] {
        switch(transaction.exchange) {
            case Exchange.EuronextBrussels:
            case Exchange.EuronextAmsterdam:
            case Exchange.EuronextParis:
            case Exchange.EuronextLisbon:
                return calculateIntervalFees(transaction, getGroup1FeeIntervals(transaction));
            case Exchange.EuronextDublin:
            case Exchange.Xetra:
            case Exchange.NasdaqHelsinki:
            case Exchange.LondonStockExchange:
            case Exchange.LuxembourgStockExchange:
            case Exchange.BolsaDeMadrid:
            case Exchange.NYSE:
            case Exchange.Nasdaq:
            case Exchange.EuronextOslo:
            case Exchange.NasdaqStockholm:
            case Exchange.ViennaStockExchange:
            case Exchange.SIXSwissExchange:
            case Exchange.NasdaqCopenhagen:
            case Exchange.TorontoStockExchange:
                return calculateIntervalFees(transaction, getGroup2FeeIntervals(transaction));
            case Exchange.NationalStockExchangeOfAustralia:
            case Exchange.AustralianStockExchange:
            case Exchange.SingaporeStockExchange:
            case Exchange.HongKongStockExchange:
            case Exchange.TokyoStockExchange:
                return calculateIntervalFees(transaction, getGroup3FeeIntervals(transaction));
            default:
                return [];
        }
    }
}
