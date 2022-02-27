<script lang="ts">
    import type { Source } from "../util";
    import { Broker } from "../core/broker/Broker";
    import { actionNumbers, actions, currency, decimalSeparator, lang, thousandsSeparator } from "../stores";
    import type { Money } from "../core/Money";
    import { add, CurrencyType } from "../core/Money";
    import type { FormatMoneyHTMLParams } from "../core/i18n/language";
    import { formatMoneyHTML, getBrokerName, getMessage } from "../core/i18n/language";
    import type { Action } from "../core/action/Action";
    import type { Fee } from "../core/Fee";
    import { ActionType } from "../core/action/ActionType";
    import { Transaction } from "../core/action/Transaction";

    export let broker: Broker;
    export let logoSources: Source[];

    let formatMoneyParams: FormatMoneyHTMLParams;
    $: {
        formatMoneyParams = {
            language: $lang,
            decimalSeparator: $decimalSeparator,
            thousandsSeparator: $thousandsSeparator,
            currencySymbolClass: "money-currency",
            numberClass: "money-number",
            currencyCodeClass: "money-currency-code",
        };
    }

    function correctActions(actions: Action[], currencyType: CurrencyType): Action[] {
        let hasOpenAccount = false;
        let hasDeposit = false;
        let hasWithdrawal = false;
        let portfolioTotal: Money = [currencyType, 0];
        const newActions: Action[] = [];
        for(const action of actions) {
            if(action.type === ActionType.OpenAccount) {
                hasOpenAccount = true;
            } else if(action.type === ActionType.Deposit) {
                hasDeposit = true;
            } else if(action.type === ActionType.Withdrawal) {
                hasWithdrawal = true;
            }

            if(action.type === ActionType.Deposit) {
                portfolioTotal = add(portfolioTotal, action.value);
            }
            if(action.type === ActionType.PaidDividend) {
                portfolioTotal = add(portfolioTotal, action.value);
            }
        }

        if(!hasOpenAccount) {
            newActions.push({
                type: ActionType.OpenAccount,
            });
        }
        if(!hasDeposit) {
            newActions.push({
                type: ActionType.Deposit,
                value: portfolioTotal,
            });
        }
        if(!hasWithdrawal) {
            newActions.push({
                type: ActionType.Withdrawal,
                value: portfolioTotal,
            });
        }
        newActions.push(...actions);

        return newActions;
    }

    let transactionFees: Map<Transaction, Fee[]>;
    let totalTransactionFees: Map<Transaction, Money>;
    let otherFees: Map<Action, Fee[]>;
    let totalFee: Money;
    $: {
        transactionFees = new Map<Transaction, Fee[]>();
        totalTransactionFees = new Map<Transaction, Money>();
        otherFees = new Map<Action, Fee[]>();

        const correctedActions = correctActions($actions, $currency);
        const brokerFees = broker.calculateFees(correctedActions);
        for(const action of correctedActions) {
            const actionFees = brokerFees.get(action);
            if(actionFees !== undefined) {
                if(action.type === ActionType.Transaction) {
                    transactionFees.set(action, actionFees);
                } else {
                    otherFees.set(action, actionFees);
                }
            }
        }

        for(const transaction of transactionFees.keys()) {
            let totalTransactionFee: Money = [$currency, 0];
            for(const fee of transactionFees.get(transaction)) {
                totalTransactionFee = add(totalTransactionFee, fee.value);
            }
            totalTransactionFees.set(transaction, totalTransactionFee);
        }

        totalFee = [$currency, 0];
        for(const fees of brokerFees.values()) {
            for(const fee of fees) {
                totalFee = add(totalFee, fee.value);
            }
        }
    }
</script>

<div class="broker">
    <div class="broker-header">
        <div class="broker-logo">
            <picture>
                {#each logoSources as { type, srcset, src }}
                    <source {type} {srcset} {src} />
                {/each}
                <img src={logoSources[0].src} alt="Logo for {getBrokerName($lang, broker.name)}" />
            </picture>
        </div>
        <div class="broker-total-fees fee">
            <span class="fee-name">{getMessage($lang, "ui.totalfees")}</span>
            <span class="fee-value">{@html formatMoneyHTML(totalFee, formatMoneyParams)}</span>
        </div>
    </div>
    <div class="broker-fees">
        {#if otherFees.size > 0}
            <div class="generic-fees">
            {#each [...otherFees.values()] as fees} <!-- Convert iterable to array with spread operator -->
                <ul class="action-fees">
                    {#each [...fees] as fee}
                    <li class="fee">
                        <span class="fee-name">{fee.getType($lang)}</span>
                        <span class="fee-value">{@html formatMoneyHTML(fee.value, formatMoneyParams)}</span>
                        <span class="fee-description">{fee.getCalculationDescription({ language: $lang, decimalSeparator: $decimalSeparator, thousandsSeparator: $thousandsSeparator })}</span>
                    </li>
                    {/each}
                </ul>
            {/each}
            </div>
        {/if}
        <div class="transactions-fees">
            {#each [...transactionFees.keys()] as transaction}
            <div class="transaction">
                <p class="transaction-title">{getMessage($lang, "ui.transaction")} #{$actionNumbers.get(transaction)}</p>
                <ul class="transaction-fees">
                    {#each [...transactionFees.get(transaction)] as fee}
                    <li class="fee">
                        <span class="fee-name">{fee.getType($lang)}</span>
                        <span class="fee-value">{@html formatMoneyHTML(fee.value, formatMoneyParams)}</span>
                        <span class="fee-description">{fee.getCalculationDescription({ language: $lang, decimalSeparator: $decimalSeparator, thousandsSeparator: $thousandsSeparator })}</span>
                    </li>
                    {/each}
                </ul>
                <div class="fee-total fee">
                    <span class="fee-name">{getMessage($lang, "ui.totalfee")}</span>
                    <span class="fee-value transaction-total-fee">{@html formatMoneyHTML(totalTransactionFees.get(transaction), formatMoneyParams)}</span>
                </div>
            </div>
            {/each}
        </div>
    </div>
</div>

<style>
    div.broker {
        min-width: 15em;
        border-left: 2px solid #E3E3E3
    }
    div.broker-header {
        padding: 0 0.4em 0.5em 0.4em;
        border-bottom: 2px solid #E3E3E3;
    }
    div.generic-fees {
        border-bottom: 2px solid #E3E3E3;
    }
    div.generic-fees, div.transactions-fees {
        padding: 0.4em;
    }
    div.broker-logo {
        margin: 1em 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        min-height: 3em;
    }
    :global(.fee) {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        cursor: default;
    }
    :global(.fee-name) {
        flex: 1;
        color: #959595;
    }
    :global(.fee):hover .fee-description {
        display: block;
    }
    :global(.fee-description) {
        display: none;
        position: absolute;
        top: 1.4em;
        z-index: 1;
        background-color: #FEFEFE;
        border-radius: 0.2em;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        color: #959595;
        padding: 0.3em;
    }
    p.transaction-title {
        font-family: "Roboto Mono", monospace;
        font-weight: 500;
        margin: 0.25em 0;
    }
    ul.action-fees, ul.transaction-fees {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    ul.transaction-fees {
        border-bottom: 2px solid #E3E3E3;
        margin-bottom: 0.2em;
    }
    ul.transaction-fees li {
        padding: 0.1em 0;
    }
    div.broker-total-fees span.fee-value {
        font-size: 1.2em;
    }
    div.transaction {
        margin: 0.8em 0;
    }
    div.fee-total span.fee-name {
        color: inherit;
    }
</style>
