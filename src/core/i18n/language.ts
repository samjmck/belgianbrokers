import { dutch, english } from "./languages";
import { CurrencyType, Money } from "../Money";
import { BrokerName } from "../broker/Broker";
import { Exchange, SecurityType, TransactionType } from "../action/Transaction";
import { ActionType } from "../action/ActionType";

export enum Language {
    English,
    Nederlands,
}
export const languages: Language[] = [
    Language.English,
    Language.Nederlands,
];

export interface Locale {
    language: Language;
    decimalSeparator: string;
    thousandsSeparator: string;
}

export function getMessage(language: Language, key: string, capitalize = true): string {
    let message: string;
    switch(language) {
        case Language.English:
            message = english[key];
            break;
        case Language.Nederlands:
            message = dutch[key];
            break;
    }
    if(message === undefined) {
        console.log(`could not get message with ${key}`);
        return `unknown`;
    }
    if(capitalize) {
        return `${message[0].toUpperCase()}${message.substr(1)}`;
    }
    return message;
}

export type TemplateValues = (string | ((locale: Locale) => string))[];

export function getTemplate(locale: Locale, key: string, capitalize = true,...values: TemplateValues) {
    let template: string;
    switch(locale.language) {
        case Language.English:
            template = english[key];
            break;
        case Language.Nederlands:
            template = dutch[key];
            break;
    }

    for(let i = 0; i < values.length; i++) {
        let value: string;
        if(typeof values[i] === "string") {
            value = <string> values[i];
        } else {
            value = (<(locale: Locale) => string> values[i])(locale);
        }

        template = template.replace(`{${i}}`, value);
    }
    if(capitalize) {
        return `${template[0].toUpperCase()}${template.substr(1)}`;
    }
    return template;
}

export type FormatMoneyParams = Locale;

export function formatMoney(
    money: Money,
    {
        decimalSeparator,
        thousandsSeparator,
    }: FormatMoneyParams,
): string {
    const negative = money[1] < 0;
    if(negative) {
        money[1] *= -1;
    }
    const decimalNumbers = money[1] - Math.floor(money[1] / 100) * 100;
    let wholeNumbers = `${Math.floor((money[1] - decimalNumbers) / 100)}`;

    let index = wholeNumbers.length - 3;
    while (index > 0) {
        wholeNumbers = `${wholeNumbers.substr(0, index)}${thousandsSeparator}${wholeNumbers.substr(index)}`;
        index -= 3;
    }
    const formattedWholeNumber = `${wholeNumbers}${decimalSeparator}${decimalNumbers < 10 ? "0" + Math.round(decimalNumbers) : Math.round(decimalNumbers)}`;

    return `${negative ? "-" : ""}${formattedWholeNumber} ${money[0]}`;
}

export function formatPercentage(
    percentage: number,
    {
        decimalSeparator
    }: Locale,
): string {
    return `${percentage * 100}%`.replace(".", decimalSeparator);
}

export type FormatMoneyHTMLParams = FormatMoneyParams & {
    currencySymbolClass: string;
    numberClass: string;
    currencyCodeClass: string;
};

export function formatMoneyHTML(
    money: Money,
    {
        language,
        decimalSeparator,
        thousandsSeparator,
        currencySymbolClass,
        numberClass,
        currencyCodeClass,
    }: FormatMoneyHTMLParams
): string {
    const negative = money[1] < 0;
    if(negative) {
        money[1] *= -1;
    }
    const decimalNumbers = money[1] - Math.floor(money[1] / 100) * 100;
    let wholeNumbers = `${Math.floor((money[1] - decimalNumbers) / 100)}`;

    let index = wholeNumbers.length - 3;
    while (index > 0) {
        wholeNumbers = `${wholeNumbers.substr(0, index)}${thousandsSeparator}${wholeNumbers.substr(index)}`;
        index -= 3;
    }
    const formattedWholeNumber = `${wholeNumbers}${decimalSeparator}${decimalNumbers < 10 ? "0" + Math.round(decimalNumbers) : Math.round(decimalNumbers)}`;

    return `<span class="${currencySymbolClass}">${getCurrencySymbol(money[0])}</span><span class="${numberClass}">${negative ? "-" : ""}${formattedWholeNumber}</span><span class="${currencyCodeClass}">${money[0]}</span>`;
}

export function getLanguage(language: Language, selectedLanguage: Language) {
    switch(selectedLanguage) {
        case Language.English:
            return getMessage(language, "language.english");
        case Language.Nederlands:
            return getMessage(language, "language.dutch");
        default:
            return getMessage(language, "language.english");
    }
}

export function getBrokerName(language: Language, brokerName: BrokerName) {
    switch(brokerName) {
        case BrokerName.Argenta:
            return getMessage(language, "broker.argenta");
        case BrokerName.Belfius:
            return getMessage(language, "broker.belfius");
        case BrokerName.BinckBank:
            return getMessage(language, "broker.binckbank");
        case BrokerName.BNPParibasFortis:
            return getMessage(language, "broker.bnpparibasfortis");
        case BrokerName.Bolero:
            return getMessage(language, "broker.bolero");
        case BrokerName.DEGIROBEBasic:
            return getMessage(language, "broker.degirobebasic");
        case BrokerName.DeutscheBank:
            return getMessage(language, "broker.deutschebank");
        case BrokerName.Keytrade:
            return getMessage(language, "broker.keytrade");
        case BrokerName.LYNX:
            return getMessage(language, "broker.lynx");
    }
}

export function getSecurityType(language: Language, securityType: SecurityType) {
    switch(securityType) {
        case SecurityType.Share:
            return getMessage(language, "security.share");
        case SecurityType.ETF:
            return getMessage(language, "security.etf");
        case SecurityType.Option:
            return getMessage(language, "security.option");
        case SecurityType.Bond:
            return getMessage(language, "security.bond");
    }
}

export function getExchange(language: Language, exchange: Exchange) {
    switch(exchange) {
        case Exchange.NYSE:
            return getMessage(language, "exchange.nyse");
        case Exchange.Nasdaq:
            return getMessage(language, "exchange.nasdaq");
        case Exchange.JapanExchangeGroup:
            return getMessage(language, "exchange.japanexchangegroup");
        case Exchange.LondonStockExchange:
            return getMessage(language, "exchange.londonstockexchange");
        case Exchange.ShanghaiStockExchange:
            return getMessage(language, "exchange.shanghaistockexchange");
        case Exchange.HongKongStockExchange:
            return getMessage(language, "exchange.hongkongstockexchange");
        case Exchange.EuronextAmsterdam:
            return getMessage(language, "exchange.euronextamsterdam")
        case Exchange.EuronextBrussels:
            return getMessage(language, "exchange.euronextbrussels")
        case Exchange.EuronextDublin:
            return getMessage(language, "exchange.euronextdublin")
        case Exchange.EuronextLisbon:
            return getMessage(language, "exchange.euronextlisbon")
        case Exchange.EuronextOslo:
            return getMessage(language, "exchange.euronextoslo")
        case Exchange.EuronextParis:
            return getMessage(language, "exchange.euronextparis")
        case Exchange.TorontoStockExchange:
            return getMessage(language, "exchange.torontostockexchange")
        case Exchange.ShenzhenStockExchange:
            return getMessage(language, "exchange.shenzhenstockexchange")
        case Exchange.BombayStockExchange:
            return getMessage(language, "exchange.bombaystockexchange")
        case Exchange.IndiaNationalStockExchange:
            return getMessage(language, "exchange.indianationalstockexchange")
        case Exchange.Xetra:
            return getMessage(language, "exchange.xetra")
        case Exchange.SIXSwissExchange:
            return getMessage(language, "exchange.sixswissexchange")
        case Exchange.KoreaExchange:
            return getMessage(language, "exchange.koreaexchange")
    }
}

export function getTransactionType(language: Language, transactionType: TransactionType) {
    switch(transactionType) {
        case TransactionType.Buy:
            return getMessage(language, "transaction.buy");
        case TransactionType.Sell:
            return getMessage(language, "transaction.sell");
    }
}

export function getActionType(language: Language, actionType: ActionType) {
    switch(actionType) {
        case ActionType.Transaction:
            return getMessage(language, "action.transaction");
        case ActionType.Withdrawal:
            return getMessage(language, "action.withdrawal");
        case ActionType.OpenAccount:
            return getMessage(language, "action.openaccount");
        case ActionType.Deposit:
            return getMessage(language, "action.deposit");
        case ActionType.PaidDividend:
            return getMessage(language, "action.paiddividend");
    }
}

export function getCurrencySymbol(currency: CurrencyType): string {
    switch (currency) {
        case CurrencyType.EUR:
            return "€";
        case CurrencyType.GBP:
            return "£";
        case CurrencyType.USD:
            return "$";
        default:
            return "";
    }
}
