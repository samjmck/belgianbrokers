export enum CurrencyType {
    USD = "USD",
    GBP = "GBP",
    EUR = "EUR",
    CAD = "CAD",
    RUB = "RUB",
    HUF = "HUF",
    PLN = "PLN",
    CHF = "CHF",
    SEK = "SEK",
    NOK = "NOK",
    JPY = "JPY",
    CNH = "CNH",
    HKD = "HKD",
    SGD = "SGD",
    AUD = "AUD",
    MXN = "MXN",
}
export const currencyTypes: CurrencyType[] = [
    CurrencyType.USD,
    CurrencyType.GBP,
    CurrencyType.EUR,
    CurrencyType.CAD,
    CurrencyType.RUB,
    CurrencyType.HUF,
    CurrencyType.PLN,
    CurrencyType.CHF,
    CurrencyType.SEK,
    CurrencyType.NOK,
    CurrencyType.JPY,
    CurrencyType.CNH,
    CurrencyType.HKD,
    CurrencyType.SGD,
    CurrencyType.AUD,
    CurrencyType.MXN,
];

export type Money = [currency: CurrencyType, value: number];

const exchangeRates: Map<CurrencyType, Map<CurrencyType, number>> = new Map();

async function initExchangeRates(selectedCurrencyTypes: CurrencyType[]) {
    for(const currencyType of selectedCurrencyTypes) {
        const response = await fetch(`https://fx-worker.samjmck.workers.dev/${currencyType}`);
        const json = await response.json();
        const exchangeRateMap = new Map<CurrencyType, number>();
        exchangeRates.set(currencyType, exchangeRateMap);
        for(const currencyCode in json) {
            exchangeRateMap.set(<CurrencyType> currencyCode, json[currencyCode]);
        }
    }
}

initExchangeRates([CurrencyType.EUR, CurrencyType.GBP, CurrencyType.USD]);

export function convertCurrency(money: Money, toCurrency: CurrencyType): number {
    const exchangeRate = exchangeRates.get(money[0])?.get(toCurrency);
    if(exchangeRate === undefined) {
        console.warn(`no exchange rate found for ${money[0]}${toCurrency}`);
        return money[1];
    }
    return money[1] * exchangeRate;
}

export function lessThanOrEqual(first: Money, second: Money): boolean {
    return convertCurrency(first, second[0]) <= second[1];
}

export function largerThanOrEquals(first: Money, second: Money): boolean {
    return convertCurrency(first, second[0]) >= second[1];
}

export function lessThan(first: Money, second: Money): boolean {
    return convertCurrency(first, second[0]) < second[1];
}

export function largerThan(first: Money, second: Money): boolean {
    return convertCurrency(first, second[0]) > second[1];
}

export function add(first: Money, second: Money): Money {
    const sum: Money = [...first];
    sum[1] += convertCurrency(second, first[0]);
    return sum;
}

export function multiply(first: Money, value: number): Money {
    return [first[0], first[1] * value];
}
