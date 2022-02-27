import { Writable, writable } from "svelte/store";
import { CurrencyType } from "./core/Money";
import { Exchange, SecurityType, TransactionType } from "./core/action/Transaction";
import { ActionType } from "./core/action/ActionType";
import { Action } from "./core/action/Action";
import { Broker } from "./core/broker/Broker";
import { Bolero } from "./core/broker/Bolero";
import { Language } from "./core/i18n/language";
import { BNPParibasFortis } from "./core/broker/BNPParibasFortis";
import { Argenta } from "./core/broker/Argenta";
import { DEGIROBE } from "./core/broker/DEGIROBE";
import { LYNX } from "./core/broker/LYNX";

export const brokers = writable<Broker[]>([
    new Bolero(),
    new BNPParibasFortis(),
    new Argenta(),
    new DEGIROBE(),
    new LYNX(),
]);

export const currency = writable(CurrencyType.EUR);

// The reason why we don't combine these stores into one "locale" store is because that would mean we would
// have to, for example, rerender all pricing elements if the language changes, even though the only thing
// pricing elements would not use the lang property of the store
export const lang = writable(Language.English);
export const decimalSeparator = writable(",");
export const thousandsSeparator = writable(" ");

let actionNumber = 0;
export const actionNumbers = writable<Map<Action, number>>(new Map<Action, number>());

let updateLocalStorage = true;
// Why delay?
// localStorage.setItem is blocking, and could slow down the UI quite drastically if it is called often
// while the user is still typing
let previousTimeoutId: number;
function delayedLocalStorageUpdate(key: string, data: object) {
    if(!updateLocalStorage) {
        return;
    }
    if(previousTimeoutId !== undefined) {
        clearTimeout(previousTimeoutId);
    }
    previousTimeoutId = setTimeout(() => {
        window.localStorage.setItem(key, JSON.stringify(data));
    }, 1500);
}

type CustomActionStoreMethods = {
    change: (action: Action, newProperties: Partial<Action>) => void;
    add: (action: Action) => void;
    addMultiple: (actions: Action[]) => void;
    remove: (action: Action) => void;
}

function createActionsStore(): Writable<Action[]> & CustomActionStoreMethods {
    const { subscribe, set, update } = writable<Action[]>([]);

    return {
        subscribe,
        set,
        update,
        change: (action: Action, newProperties: Partial<Action>) => {
            update(actions => {
                Object.assign(action, newProperties);
                delayedLocalStorageUpdate("actions", actions);
                return actions;
            });
        },
        add: (action: Action) => {
            update(actions => {
                actions.push(action);
                actionNumbers.update(map => {
                    map.set(action, ++actionNumber);
                    return map;
                });
                delayedLocalStorageUpdate("actions", actions);
                return actions;
            });
        },
        addMultiple: (actions: Action[]) => {
            update(storeActions => {
                storeActions.push(...actions);
                actionNumbers.update(map => {
                    for (const action of actions) {
                        map.set(action, ++actionNumber);
                    }
                    return map;
                });
                delayedLocalStorageUpdate("actions", storeActions);
                return storeActions;
            });
        },
        remove: (action: Action) => {
            update(actions => {
                actions.splice(actions.indexOf(action), 1);
                actionNumbers.update(map => {
                    map.delete(action);
                    actionNumber = 0;
                    for (const [action] of map) {
                        map.set(action, ++actionNumber);
                    }
                    return map;
                });
                delayedLocalStorageUpdate("actions", actions);
                return actions;
            });
        },
    };
}

export const actions = createActionsStore();

const urlSearchParams = new URLSearchParams(window.location.search);
const data = urlSearchParams.get("d");

if(data !== null) {
    updateLocalStorage = false;
    actions.addMultiple(JSON.parse(atob(data)));
} else {
    const localStorageData = window.localStorage.getItem("actions");
    if(localStorageData !== null) {
        updateLocalStorage = false;
        actions.addMultiple(JSON.parse(localStorageData));
        updateLocalStorage = true;
    } else {
        const defaultActions: Action[] = [
            {
                type: ActionType.Transaction,
                exchange: Exchange.EuronextAmsterdam,
                transactionType: TransactionType.Buy,
                security: {
                    type: SecurityType.Share,
                    isin: "",
                },
                quantity: 150,
                value: [CurrencyType.EUR, 1500_00],
            },
            {
                type: ActionType.Transaction,
                exchange: Exchange.EuronextAmsterdam,
                transactionType: TransactionType.Buy,
                security: {
                    type: SecurityType.Share,
                    isin: "",
                },
                quantity: 1,
                value: [CurrencyType.EUR, 1_00],
            },
            {
                type: ActionType.Transaction,
                exchange: Exchange.NYSE,
                transactionType: TransactionType.Buy,
                security: {
                    type: SecurityType.Share,
                    isin: "",
                },
                quantity: 225,
                value: [CurrencyType.USD, 2750_00],
            },
            {
                type: ActionType.Transaction,
                exchange: Exchange.LondonStockExchange,
                transactionType: TransactionType.Buy,
                security: {
                    type: SecurityType.Share,
                    isin: "",
                },
                quantity: 400,
                value: [CurrencyType.GBP, 15000_00],
            },
            {
                type: ActionType.Transaction,
                exchange: Exchange.EuronextBrussels,
                transactionType: TransactionType.Buy,
                security: {
                    type: SecurityType.Share,
                    isin: "",
                },
                quantity: 200,
                value: [CurrencyType.EUR, 7000_00],
            },
        ];
        actions.addMultiple(defaultActions);
    }
}
