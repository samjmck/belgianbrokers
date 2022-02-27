import { calculateIntervalFees, ETF, Exchange, FeeInterval, SecurityType, Transaction } from "../action/Transaction";
import { add, CurrencyType } from "../Money";
import { Fee } from "../Fee";
import { formatMoney, formatPercentage } from "../i18n/language";
import { Broker, BrokerName } from "./Broker";
import { Action } from "../action/Action";
import { ActionType } from "../action/ActionType";
import { isCoreSelection } from "./DEGIRO-core-selection";

function getBENLFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            maximumFee: new Fee(
                [CurrencyType.EUR, 30_00],
                "fee.type.transaction",
                "fee.description.interval.maximumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 30_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                add([CurrencyType.EUR, 2_00], [value[0], value[1] * 0.0003]),
                "fee.type.transaction",
                "fee.description.absoluteWithPercentage",
                [
                    locale => formatMoney([CurrencyType.EUR, 2_00], locale),
                    locale => formatPercentage(0.0003, locale),
                    locale => formatMoney(value, locale),
                ]
            ),
        },
    ];
}

function getXetraFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            maximumFee: new Fee(
                [CurrencyType.EUR, 60_00],
                "fee.type.transaction",
                "fee.description.interval.maximumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 60_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                add([CurrencyType.EUR, 4_00], [value[0], value[1] * 0.0005]),
                "fee.type.transaction",
                "fee.description.absoluteWithPercentage",
                [
                    locale => formatMoney([CurrencyType.EUR, 4_00], locale),
                    locale => formatPercentage(0.0005, locale),
                    locale => formatMoney(value, locale),
                ]
            ),
        },
    ];
}

function getFrankfurtSharesFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            calculateFee: value => new Fee(
                add([CurrencyType.EUR, 7_50], [value[0], value[1] * 0.0009]),
                "fee.type.transaction",
                "fee.description.absoluteWithPercentage",
                [
                    locale => formatMoney([CurrencyType.EUR, 7_50], locale),
                    locale => formatPercentage(0.0009, locale),
                    locale => formatMoney(value, locale),
                ]
            ),
        },
    ];
}

// Denmark, Finland, France, Ireland, Italy, Norway, Austria, Portugal, Spain, UK, Sweden, Switzerland
function getGroup1FeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            maximumFee: new Fee(
                [CurrencyType.EUR, 60_00],
                "fee.type.transaction",
                "fee.description.interval.maximumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 60_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                add([CurrencyType.EUR, 4_00], [value[0], value[1] * 0.0005]),
                "fee.type.transaction",
                "fee.description.absoluteWithPercentage",
                [
                    locale => formatMoney([CurrencyType.EUR, 4_00], locale),
                    locale => formatPercentage(0.0005, locale),
                    locale => formatMoney(value, locale),
                ]
            ),
        },
    ];
}

function getUSFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            calculateFee: value => new Fee(
                add([CurrencyType.EUR, 50], [CurrencyType.USD, 0.4 * transaction.quantity]),
                "fee.type.transaction",
                "degiro.fee.description.usAndCanada",
                [
                    locale => formatMoney([CurrencyType.EUR, 50], locale),
                    locale => formatMoney([CurrencyType.USD, 0.4], locale),
                    `${transaction.quantity}`,
                ]
            ),
        },
    ];
}

function getCanadaFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            calculateFee: value => new Fee(
                add([CurrencyType.EUR, 2_00], [CurrencyType.CAD, 1 * transaction.quantity]),
                "fee.type.transaction",
                "degiro.fee.description.usAndCanada",
                [
                    locale => formatMoney([CurrencyType.EUR, 2_00], locale),
                    locale => formatMoney([CurrencyType.CAD, 1], locale),
                    `${transaction.quantity}`,
                ]
            ),
        },
    ];
}

// Australia, Hong Kong, Japan, Singapore
function getGroup2FeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            calculateFee: value => new Fee(
                add([CurrencyType.EUR, 10_00], [value[0], value[1] * 0.0006]),
                "fee.type.transaction",
                "fee.description.absoluteWithPercentage",
                [
                    locale => formatMoney([CurrencyType.EUR, 10_00], locale),
                    locale => formatPercentage(0.0006, locale),
                    locale => formatMoney(value, locale),
                ]
            ),
        },
    ];
}

// Hungary, Greece, Czechia, Turkey
function getGroup3FeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            calculateFee: value => new Fee(
                add([CurrencyType.EUR, 10_00], [value[0], value[1] * 0.0016]),
                "fee.type.transaction",
                "fee.description.absoluteWithPercentage",
                [
                    locale => formatMoney([CurrencyType.EUR, 10_00], locale),
                    locale => formatPercentage(0.0016, locale),
                    locale => formatMoney(value, locale),
                ]
            ),
        },
    ];
}

function getPolandFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            calculateFee: value => new Fee(
                add([CurrencyType.EUR, 5_00], [value[0], value[1] * 0.0016]),
                "fee.type.transaction",
                "fee.description.absoluteWithPercentage",
                [
                    locale => formatMoney([CurrencyType.EUR, 5_00], locale),
                    locale => formatPercentage(0.0016, locale),
                    locale => formatMoney(value, locale),
                ]
            ),
        },
    ];
}

export class DEGIROBE extends Broker {
    name = BrokerName.DEGIROBEBasic;

    protected calculateActionFees(action: Action): Fee[] {
        switch(action.type) {
            case ActionType.Transaction:
                return DEGIROBE.getTransactionFees(action);
            default:
                return [];
        }
    }

    private static getTransactionFees(transaction: Transaction): Fee[] {
        switch(transaction.security.type) {
            case SecurityType.Share:
            case SecurityType.ETF:
                if(isCoreSelection(transaction)) {
                    return [
                        new Fee(
                            [transaction.value[0], 0],
                            "fee.type.transaction",
                            "degiro.fee.description.coreSelection",
                            []
                        ),
                    ];
                }
                return DEGIROBE.calculateEquityFees(transaction);
        }
        return [];
    }

    private static calculateEquityFees(transaction: Transaction): Fee[] {
        switch(transaction.exchange) {
            case Exchange.EuronextBrussels:
            case Exchange.EuronextAmsterdam:
                return calculateIntervalFees(transaction, getBENLFeeIntervals(transaction));
            case Exchange.Xetra:
                return calculateIntervalFees(transaction, getXetraFeeIntervals(transaction));
            case Exchange.BorseFrankfurt:
                return calculateIntervalFees(transaction, getFrankfurtSharesFeeIntervals(transaction));
            // Group 1
            case Exchange.NasdaqCopenhagen:
            case Exchange.NasdaqHelsinki:
            case Exchange.EuronextParis:
            case Exchange.EuronextDublin:
            case Exchange.BorsaItaliana:
            case Exchange.EuronextOslo:
            case Exchange.ViennaStockExchange:
            case Exchange.EuronextLisbon:
            case Exchange.BolsaDeMadrid:
            case Exchange.LondonStockExchange:
            case Exchange.NasdaqStockholm:
            case Exchange.SIXSwissExchange:
                return calculateIntervalFees(transaction, getGroup1FeeIntervals(transaction));
            // US fees
            case Exchange.Nasdaq:
            case Exchange.NYSE:
                return calculateIntervalFees(transaction, getUSFeeIntervals(transaction));
            case Exchange.TorontoStockExchange:
                return calculateIntervalFees(transaction, getCanadaFeeIntervals(transaction));
            // Group 2
            case Exchange.AustralianStockExchange:
            case Exchange.NationalStockExchangeOfAustralia:
            case Exchange.HongKongStockExchange:
            case Exchange.JapanExchangeGroup:
            case Exchange.SingaporeStockExchange:
                return calculateIntervalFees(transaction, getGroup2FeeIntervals(transaction));
            // Group 3
            case Exchange.BudapestStockExchange:
            case Exchange.AthensStockExchange:
            case Exchange.BorsaInstanbul:
                return calculateIntervalFees(transaction, getGroup3FeeIntervals(transaction));
            case Exchange.WarsawStockExchange:
                return calculateIntervalFees(transaction, getPolandFeeIntervals(transaction));
            default:
                return [];
        }
    }
}
