declare var EXCHANGERATE_API_KEY: string;
declare var bbroker: KVNamespace;

enum CurrencyType {
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
    // CNH = "CNH",
    HKD = "HKD",
    SGD = "SGD",
    AUD = "AUD",
    MXN = "MXN",
}
const currencyTypes: string[] = [
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
    // CurrencyType.CNH,
    CurrencyType.HKD,
    CurrencyType.SGD,
    CurrencyType.AUD,
    CurrencyType.MXN,
];

interface FixerResponse {
    conversion_rates: { [currencyType: string]: number };
}


addEventListener("scheduled", event => {
    event.waitUntil(handleScheduled(event));
});

async function handleScheduled(event: ScheduledEvent) {
    for(const currencyType of currencyTypes) {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/${currencyType}`);
        await bbroker.put(`exchangerate-api-response:currency-type#${currencyType}`, await response.json());
    }
}

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event));
});

async function handleRequest(event: FetchEvent) {
    const lastSlashIndex = event.request.url.lastIndexOf("/");
    const currencyType = event.request.url.slice(lastSlashIndex + 1);
    const fixerResponse = await bbroker.get<FixerResponse>(`exchangerate-api-response:currency-type#${currencyType}`, { type: "json" });
    if(fixerResponse === null) {
        return new Response("could not get response");
    }

    return new Response(JSON.stringify(fixerResponse.conversion_rates), {
        headers: {
            "Content-Type": "json/application",
        },
    });
}
