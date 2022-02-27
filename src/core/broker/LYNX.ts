import { calculateIntervalFees, Exchange, FeeInterval, SecurityType, Transaction } from "../action/Transaction";
import { CurrencyType } from "../Money";
import { Fee } from "../Fee";
import { formatMoney, formatPercentage } from "../i18n/language";
import { Broker, BrokerName } from "./Broker";
import { Action } from "../action/Action";
import { ActionType } from "../action/ActionType";

function getBENLFRFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            minimumFee: new Fee(
                [CurrencyType.EUR, 6_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 6_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            maximumFee: new Fee(
                [CurrencyType.EUR, 99_00],
                "fee.type.transaction",
                "fee.description.interval.maximumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 99_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0009],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0009, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0009], locale),
                ]
            ),
        },
    ];
}

function getUSFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            minimumFee: new Fee(
                [CurrencyType.USD, 5_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.USD, 5_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            maximumFee: new Fee(
                [transaction.value[0], transaction.value[1] * 0.03],
                "fee.type.transaction",
                "fee.description.interval.maximumWithNoClose",
                [
                    locale => formatPercentage(0.03, locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [CurrencyType.USD, 1 * transaction.quantity],
                "fee.type.transaction",
                "fee.description.numberOfShares",
                [
                    locale => formatMoney([CurrencyType.USD, 1], locale),
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
            minimumFee: new Fee(
                [CurrencyType.CAD, 6_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.CAD, 6_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            maximumFee: new Fee(
                [transaction.value[0], transaction.value[1] * 0.03],
                "fee.type.transaction",
                "fee.description.interval.maximumWithNoClose",
                [
                    locale => formatPercentage(0.03, locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [CurrencyType.CAD, 2 * transaction.quantity],
                "fee.type.transaction",
                "fee.description.numberOfShares",
                [
                    locale => formatMoney([CurrencyType.CAD, 2], locale),
                    `${transaction.quantity}`,
                ]
            ),
        },
    ];
}

function getDEITESFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            minimumFee: new Fee(
                [CurrencyType.EUR, 6_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 6_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            maximumFee: new Fee(
                [CurrencyType.EUR, 99_00],
                "fee.type.transaction",
                "fee.description.interval.maximumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 99_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0014],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0014, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0014], locale),
                ]
            ),
        },
    ];
}

function getBalticFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            minimumFee: new Fee(
                [CurrencyType.EUR, 20_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 20_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0039],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0039, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0039], locale),
                ]
            ),
        },
    ];
}

function getRussiaFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.RUB, 0],
            minimumFee: new Fee(
                [CurrencyType.RUB, 900_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.RUB, 900_00], locale),
                    locale => formatMoney([CurrencyType.RUB, 0], locale),
                ],
            ),
            maximumFee: new Fee(
                [CurrencyType.RUB, 8500_00],
                "fee.type.transaction",
                "fee.description.interval.maximumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.RUB, 8500_00], locale),
                    locale => formatMoney([CurrencyType.RUB, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0025],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0025, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0025], locale),
                ]
            ),
        },
    ];
}

function getAustriaFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            minimumFee: new Fee(
                [CurrencyType.EUR, 6_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 6_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            maximumFee: new Fee(
                [CurrencyType.EUR, 99_00],
                "fee.type.transaction",
                "fee.description.interval.maximumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.RUB, 99_00], locale),
                    locale => formatMoney([CurrencyType.RUB, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0019, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0019], locale),
                ]
            ),
        },
    ];
}

function getHungaryFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.HUF, 0],
            minimumFee: new Fee(
                [CurrencyType.HUF, 1500_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 1500_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0019, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0019], locale),
                ]
            ),
        },
    ];
}

function getPolandFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.PLN, 0],
            minimumFee: new Fee(
                [CurrencyType.PLN, 20_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 20_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0019, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0019], locale),
                ]
            ),
        },
    ];
}

function getUKFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.GBP, 0],
            minimumFee: new Fee(
                [CurrencyType.GBP, 9_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.GBP, 9_00], locale),
                    locale => formatMoney([CurrencyType.GBP, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0014],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0014, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0014], locale),
                ]
            ),
        },
    ];
}

function getSwitzerlandFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.CHF, 0],
            minimumFee: new Fee(
                [CurrencyType.CHF, 15_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.CHF, 15_00], locale),
                    locale => formatMoney([CurrencyType.CHF, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0014],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0014, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0014], locale),
                ]
            ),
        },
    ];
}

function getSwedenFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.SEK, 0],
            minimumFee: new Fee(
                [CurrencyType.SEK, 40_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.SEK, 40_00], locale),
                    locale => formatMoney([CurrencyType.SEK, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0014, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0014], locale),
                ]
            ),
        },
    ];
}

function getNorwayFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.NOK, 0],
            minimumFee: new Fee(
                [CurrencyType.NOK, 40_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.NOK, 40_00], locale),
                    locale => formatMoney([CurrencyType.NOK, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0014, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0014], locale),
                ]
            ),
        },
    ];
}

function getJapanFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.JPY, 0],
            minimumFee: new Fee(
                [CurrencyType.JPY, 500_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.JPY, 500_00], locale),
                    locale => formatMoney([CurrencyType.JPY, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0014, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0014], locale),
                ]
            ),
        },
    ];
}

function getChinaFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.CNH, 0],
            minimumFee: new Fee(
                [CurrencyType.CNH, 50_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.CNH, 50_00], locale),
                    locale => formatMoney([CurrencyType.CNH, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0019, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0019], locale),
                ]
            ),
        },
    ];
}

function getHongKongFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.HKD, 0],
            minimumFee: new Fee(
                [CurrencyType.HKD, 50_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.HKD, 50_00], locale),
                    locale => formatMoney([CurrencyType.HKD, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0019, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0019], locale),
                ]
            ),
        },
    ];
}

function getSingaporeFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.SGD, 0],
            minimumFee: new Fee(
                [CurrencyType.SGD, 8_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.SGD, 8_00], locale),
                    locale => formatMoney([CurrencyType.SGD, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0019, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0019], locale),
                ]
            ),
        },
    ];
}

function getAustraliaFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.AUD, 0],
            minimumFee: new Fee(
                [CurrencyType.AUD, 10_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.AUD, 10_00], locale),
                    locale => formatMoney([CurrencyType.AUD, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0019, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0019], locale),
                ]
            ),
        },
    ];
}

function getMexicoFeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.MXN, 0],
            minimumFee: new Fee(
                [CurrencyType.MXN, 10_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.MXN, 10_00], locale),
                    locale => formatMoney([CurrencyType.MXN, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.0019],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.0019, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.0019], locale),
                ]
            ),
        },
    ];
}

export class LYNX extends Broker {
    name = BrokerName.LYNX;

    protected calculateActionFees(action: Action): Fee[] {
        switch(action.type) {
            case ActionType.Transaction:
                return LYNX.getTransactionFees(action);
            default:
                return [];
        }
    }

    private static getTransactionFees(transaction: Transaction): Fee[] {
        switch(transaction.security.type) {
            case SecurityType.Share:
            case SecurityType.ETF:
                return LYNX.calculateEquityFees(transaction);
        }
        return [];
    }

    private static calculateEquityFees(transaction: Transaction): Fee[] {
        switch(transaction.exchange) {
            case Exchange.EuronextBrussels:
            case Exchange.EuronextParis:
            case Exchange.EuronextAmsterdam:
                return calculateIntervalFees(transaction, getBENLFRFeeIntervals(transaction));
            case Exchange.Nasdaq:
            case Exchange.NYSE:
                return calculateIntervalFees(transaction, getUSFeeIntervals(transaction));
            case Exchange.TorontoStockExchange:
                return calculateIntervalFees(transaction, getCanadaFeeIntervals(transaction));
            case Exchange.BorseFrankfurt:
            case Exchange.Xetra:
            case Exchange.BorsaItaliana:
            case Exchange.BolsaDeMadrid:
                return calculateIntervalFees(transaction, getDEITESFeeIntervals(transaction));
            // TODO: Baltic fees
            // TODO: Russia fees
            case Exchange.ViennaStockExchange:
                return calculateIntervalFees(transaction, getAustriaFeeIntervals(transaction));
            case Exchange.BudapestStockExchange:
                return calculateIntervalFees(transaction, getHungaryFeeIntervals(transaction));
            case Exchange.WarsawStockExchange:
                return calculateIntervalFees(transaction, getPolandFeeIntervals(transaction));
            case Exchange.LondonStockExchange:
                return calculateIntervalFees(transaction, getUKFeeIntervals(transaction));
            case Exchange.SIXSwissExchange:
                return calculateIntervalFees(transaction, getSwitzerlandFeeIntervals(transaction));
            case Exchange.NasdaqStockholm:
                return calculateIntervalFees(transaction, getSwedenFeeIntervals(transaction));
            case Exchange.EuronextOslo:
                return calculateIntervalFees(transaction, getNorwayFeeIntervals(transaction));
            case Exchange.JapanExchangeGroup:
                return calculateIntervalFees(transaction, getJapanFeeIntervals(transaction));
            // TODO: China fees
            case Exchange.HongKongStockExchange:
                return calculateIntervalFees(transaction, getHongKongFeeIntervals(transaction));
            case Exchange.SingaporeStockExchange:
                return calculateIntervalFees(transaction, getSingaporeFeeIntervals(transaction));
            case Exchange.AustralianStockExchange:
            case Exchange.NationalStockExchangeOfAustralia:
                return calculateIntervalFees(transaction, getAustraliaFeeIntervals(transaction));
            // TODO: Mexico fees
        }
        return [];
    }
}
