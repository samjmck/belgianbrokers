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
                [value[0], value[1] * 0.005],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.005, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.005], locale),
                ]
            ),
        },
    ];
}

function getGroup2FeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            minimumFee: new Fee(
                [CurrencyType.EUR, 40_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 40_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
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
                ]
            ),
        },
    ];
}

function getGroup3FeeIntervals(transaction: Transaction): FeeInterval[] {
    return [
        {
            openFrom: [CurrencyType.EUR, 0],
            minimumFee: new Fee(
                [CurrencyType.EUR, 40_00],
                "fee.type.transaction",
                "fee.description.interval.minimumWithNoClose",
                [
                    locale => formatMoney([CurrencyType.EUR, 40_00], locale),
                    locale => formatMoney([CurrencyType.EUR, 0], locale),
                ],
            ),
            calculateFee: value => new Fee(
                [value[0], value[1] * 0.006],
                "fee.type.transaction",
                "fee.description.percentage",
                [
                    locale => formatPercentage(0.006, locale),
                    locale => formatMoney(value, locale),
                    locale => formatMoney([value[0], value[1] * 0.006], locale),
                ]
            ),
        },
    ];
}

export class Argenta extends Broker {
    name = BrokerName.Argenta;

    calculateFees(actions: Action[]): Map<Action, Fee[]> {
        const map = new Map<Action, Fee[]> ();
        for(const action of actions) {
            switch(action.type) {
                case ActionType.Transaction:
                    map.set(action, Argenta.getTransactionFees(action));
                    break;
            }
        }
        return map;
    }

    private static getTransactionFees(transaction: Transaction): Fee[] {
        switch(transaction.security.type) {
            case SecurityType.Share:
            case SecurityType.ETF:
                return Argenta.calculateEquityFees(transaction);
        }
        return [];
    }

    private static calculateEquityFees(transaction: Transaction): Fee[] {
        switch(transaction.exchange) {
            case Exchange.EuronextParis:
            case Exchange.EuronextBrussels:
            case Exchange.EuronextAmsterdam:
                return calculateIntervalFees(transaction, getGroup1FeeIntervals(transaction));
            case Exchange.EuronextLisbon:
            case Exchange.NYSE:
            case Exchange.Nasdaq:
            case Exchange.Xetra:
            case Exchange.LondonStockExchange:
            case Exchange.LuxembourgStockExchange:
            case Exchange.BorsaItaliana:
            case Exchange.TorontoStockExchange:
                return calculateIntervalFees(transaction, getGroup2FeeIntervals(transaction));
            default:
                return calculateIntervalFees(transaction, getGroup3FeeIntervals(transaction));
        }
    }
}
