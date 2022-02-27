import { Broker, BrokerName } from "./Broker";
import { convertCurrency, CurrencyType } from "../Money";
import { Fee } from "../Fee";
import { calculateIntervalFees, Exchange, FeeInterval, SecurityType, Transaction } from "../action/Transaction";
import { Action } from "../action/Action";
import { ActionType } from "../action/ActionType";
import { formatMoney, formatPercentage } from "../i18n/language";

export type BoleroBondsTrade = Transaction & { market: "primary" | "secondary" };

function getDomesticMarketsFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            closedTo: [CurrencyType.EUR, 2500_00],
            minimumFee: new Fee(
                [CurrencyType.EUR, 7_50],
                "fee.type.transaction",
                "fee.description.interval.minimum",
                [
                    locale => formatMoney([CurrencyType.EUR, 7_50], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                ],
            ),
        },
        {
            openFrom: [CurrencyType.EUR, 2500_00],
            closedTo: [CurrencyType.EUR, 70000_00],
            minimumFee: new Fee(
                [CurrencyType.EUR, 15_00],
                "fee.type.transaction",
                "fee.description.interval.minimum",
                [
                    locale => formatMoney([CurrencyType.EUR, 15_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 70000_00], locale),
                ],
            ),
            maximumFee: new Fee(
                [CurrencyType.EUR, 50_00],
                "fee.type.transaction",
                "bolero.interval1.maximumFee",
                [
                    locale => formatMoney([CurrencyType.EUR, 50_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 70000_00], locale),
                ],
            ),
            calculateFee: value => {
                // Fee = 15 EUR per 10 000 EUR
                const eurValue = convertCurrency(value, CurrencyType.EUR);
                const n = Math.floor(eurValue / 10000_00);
                return new Fee(
                    [CurrencyType.EUR, n * 15_00],
                    "fee.type.transaction",
                    "fee.description.interval.calculation",
                    [
                        locale => formatMoney([CurrencyType.EUR, 15_00], locale),
                        locale => formatMoney([CurrencyType.EUR, 10000_00], locale),
                        locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                        locale => formatMoney([CurrencyType.EUR, 70000_00], locale),
                    ],
                );
            },
        },
        {
            openFrom: [CurrencyType.EUR, 70000_00],
            calculateFee: value => {
                // Fee = 50 EUR + 15 EUR per extra 10 000 EUR
                const eurValue = convertCurrency(value, CurrencyType.EUR);
                const n = Math.floor((eurValue - 70000_00) / 10000_00);
                return new Fee(
                    [CurrencyType.EUR, 50_00 + n * 15_00],
                    "fee.type.transaction",
                    "fee.description.interval.calculationWithStandard",
                    [
                        locale => formatMoney([CurrencyType.EUR, 15_00], locale),
                        locale => formatMoney([CurrencyType.EUR, 50_00], locale),
                        locale => formatMoney([CurrencyType.EUR, 10000_00], locale),
                        locale => formatMoney([CurrencyType.EUR, 70000_00], locale),
                    ],
                );
            },
        },
    ];
}

function getAmericanMarketsFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            closedTo: [CurrencyType.EUR, 2500_00],
            minimumFee: new Fee(
                [CurrencyType.USD, 15_00],
                "fee.type.transaction",
                "fee.description.interval.minimum",
                [
                    locale => formatMoney([CurrencyType.USD, 15_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                ],
            ),
        },
        {
            openFrom: [CurrencyType.EUR, 2500_00],
            closedTo: [CurrencyType.EUR, 70000_00],
            minimumFee: new Fee(
                [CurrencyType.USD, 20_00],
                "fee.type.transaction",
                "fee.description.interval.minimum",
                [
                    locale => formatMoney([CurrencyType.USD, 20_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                ],
            ),
            maximumFee: new Fee(
                [CurrencyType.USD, 50_00],
                "fee.type.transaction",
                "fee.description.maximum",
                [
                    locale => formatMoney([CurrencyType.USD, 20_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                ],
            ),
            calculateFee: value => {
                // Fee = 20 USD per 10 000 USD
                const usdValue = convertCurrency(value, CurrencyType.USD);
                const n = Math.floor(usdValue / 10000_00);
                return new Fee(
                    [CurrencyType.USD, n * 20_00],
                    "fee.type.transaction",
                    "fee.description.interval.calculation",
                    [
                        locale => formatMoney([CurrencyType.USD, 20_00], locale),
                        locale => formatMoney([CurrencyType.USD, 10000_00], locale),
                        locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                        locale => formatMoney([CurrencyType.EUR, 70000_00], locale),
                    ],
                );
            },
        },
        {
            openFrom: [CurrencyType.EUR, 70000_00],
            calculateFee: value => {
                // Fee = 50 USD + 20 USD per extra 10 000 USD
                const usdValue = convertCurrency(value, CurrencyType.USD);
                const n = Math.floor((usdValue - convertCurrency([CurrencyType.EUR, 70_000], CurrencyType.USD)) / 10000_00);
                return new Fee(
                    [CurrencyType.USD, n * 50_00 + n * 15_00],
                    "fee.type.transaction",
                    "fee.description.interval.calculation",
                    [
                        locale => formatMoney([CurrencyType.USD, 50_00], locale),
                        locale => formatMoney([CurrencyType.USD, 20_00], locale),
                        locale => formatMoney([CurrencyType.USD, 10000_00], locale),
                        locale => formatMoney([CurrencyType.EUR, 70000_00], locale),
                    ],
                );
            },
        },
    ];
}

function getCanadianMarketsFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            closedTo: [CurrencyType.EUR, 2500_00],
            minimumFee: new Fee(
                [CurrencyType.EUR, 15_00],
                "fee.type.transaction",
                "fee.description.interval.minimum",
                [
                    locale => formatMoney([CurrencyType.EUR, 15_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                ],
            ),
        },
        {
            openFrom: [CurrencyType.EUR, 2500_00],
            minimumFee: new Fee(
                [CurrencyType.EUR, 20_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 20_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                ],
            ),
            calculateFee: value => new Fee(
                value,
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.005, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.005], locale),
                ],
            ),
        },
    ];
}

function getEuropeanMarketsFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            closedTo: [CurrencyType.EUR, 2500_00],
            minimumFee: new Fee(
                [CurrencyType.EUR, 15_00],
                "fee.type.transaction",
                "fee.description.interval.minimum",
                [
                    locale => formatMoney([CurrencyType.EUR, 15_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                ],
            ),
        },
        {
            openFrom: [CurrencyType.EUR, 2500_00],
            minimumFee: new Fee(
                [CurrencyType.EUR, 30_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 15_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 2500_00], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.005],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.005, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.005], locale),
                ],
            ),
        },
    ];
}

function getOfflineMarketsFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            minimumFee: new Fee(
                [CurrencyType.EUR, 75_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 75_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.01],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.01, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.01], locale),
                ],
            ),
        },
    ];
}

export class Bolero extends Broker {
    name = BrokerName.Bolero;

    protected calculateActionFees(action: Action): Fee[] {
        switch(action.type) {
            case ActionType.Transaction:
                return Bolero.getTransactionFees(action);
            default:
                return [];
        }
    }

    private static getTransactionFees(transaction: Transaction): Fee[] {
        switch(transaction.security.type) {
            case SecurityType.Share:
            case SecurityType.ETF:
                return Bolero.calculateEquityFees(transaction);
        }
        return [];
    }

    private static calculateEquityFees(transaction: Transaction): Fee[] {
        switch(transaction.exchange) {
            case Exchange.EuronextBrussels:
            case Exchange.EuronextAmsterdam:
            case Exchange.EuronextParis:
            case Exchange.EuronextLisbon:
                return calculateIntervalFees(transaction, getDomesticMarketsFeeIntervals(transaction));
            case Exchange.NYSE:
            case Exchange.Nasdaq:
                return calculateIntervalFees(transaction, getAmericanMarketsFeeIntervals(transaction));
            case Exchange.TorontoStockExchange:
                return calculateIntervalFees(transaction, getCanadianMarketsFeeIntervals(transaction));
            case Exchange.Xetra:
            case Exchange.SIXSwissExchange:
            case Exchange.LondonStockExchange:
                // TODO: add more European markets
                return calculateIntervalFees(transaction, getEuropeanMarketsFeeIntervals(transaction));
            default:
                return calculateIntervalFees(transaction, getOfflineMarketsFeeIntervals(transaction));
        }
    }
}
