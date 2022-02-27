<script lang="ts">
    import type { Bond, Option, Security, Share, ETF, Transaction } from "../core/action/Transaction";
    import { SecurityType } from "../core/action/Transaction";
    import { actions, lang } from "../stores";
    import { exchanges } from "../core/action/Transaction";
    import { transactionTypes, securityTypes } from "../core/action/Transaction";
    import { currencyTypes } from "../core/Money";
    import {
        getExchange,
        getMessage,
        getSecurityType,
        getTransactionType
    } from "../core/i18n/language";
    import TransactionShareContent from "./TransactionShareContent.svelte";
    import TransactionBondContent from "./TransactionBondContent.svelte";
    import TransactionETFContent from "./TransactionETFContent.svelte";
    import TransactionOptionContent from "./TransactionOptionContent.svelte";

    export let action: Transaction;
    export let id: number;

    let totalValueNumber = action.value[1] / 100;
    
    const storedSecuritiesDataByType: { [securityType: SecurityType]: Security } = {
        // Defaults
        [SecurityType.Share]: <Share> {
            type: SecurityType.Share,
            isin: "",
        },
        [SecurityType.ETF]: <ETF> {
            type: SecurityType.ETF,
            isin: "",
        },
        [SecurityType.Option]: <Option> {
            type: SecurityType.Option,
            isin: "",
        },
        [SecurityType.Bond]: <Bond> {
            type: SecurityType.Bond,
            maturity: Date.now() + 31536000000, // matures in 1 year
        },
        // Replace default security data with actual current security data
        [action.security.type]: action.security,
    };

    function change(newProperties: Partial<Transaction>) {
        actions.change(action, newProperties);
    }

    function changeSecurity<TSecurity extends Security>(newProperties: Partial<TSecurity>) {
        const security = action.security;
        actions.change(action, {
            security: {
                ...security,
                ...newProperties,
            },
        });
        // store data so we can retain the input element values when we switch security type, better user experience
        storedSecuritiesDataByType[security.type] = {
            ...security,
            ...newProperties,
        };
    }
</script>

<div class="input transaction-type">
    <label for="transaction-type-{id}">{getMessage($lang, "ui.type")}</label>
    <select id="transaction-type-{id}" value={action.transactionType} on:change={e => change({ transactionType: Number(e.target.value) })}>
        {#each transactionTypes as transactionType}
            <option value={transactionType}>{getTransactionType($lang, transactionType)}</option>
        {/each}
    </select>
</div>

<div class="input security-type">
    <label for="security-type-{id}">{getMessage($lang, "ui.security")}</label>
    <select id="security-type-{id}" value={action.security.type} on:change={e => change({ security: storedSecuritiesDataByType[e.target.value] })}>
        {#each securityTypes as securityType}
            <option value={securityType}>{getSecurityType($lang, securityType)}</option>
        {/each}
    </select>
</div>

{#if action.security.type === SecurityType.Share}
    <TransactionShareContent {id} change={changeSecurity} securityData={storedSecuritiesDataByType[SecurityType.Share]} />
{:else if action.security.type === SecurityType.Bond}
    <TransactionBondContent {id} change={changeSecurity} securityData={storedSecuritiesDataByType[SecurityType.Bond]} />
{:else if action.security.type === SecurityType.ETF}
    <TransactionETFContent {id} change={changeSecurity} securityData={storedSecuritiesDataByType[SecurityType.ETF]} />
{:else if action.security.type === SecurityType.Option}
    <TransactionOptionContent {id} change={changeSecurity} securityData={storedSecuritiesDataByType[SecurityType.Option]} />
{/if}

<div class="input exchange">
    <label for="exchange-{id}">{getMessage($lang, "ui.exchange")}</label>
    <select id="exchange-{id}" value={action.exchange} on:change={e => change({ exchange: Number(e.target.value) })}>
        {#each exchanges as exchange}
            <option value={exchange}>{getExchange($lang, exchange)}</option>
        {/each}
    </select>
</div>

<div class="input total-value">
    <label for="total-value-{id}">{getMessage($lang, "ui.totalvalue")}</label>
    <input type="number" id="total-value-{id}" placeholder="0.00" value={totalValueNumber} on:input={e => change({ value: [action.value[0], Number(e.target.value) * 100] })} />
</div>

<div class="input quantity">
    <label for="quantity-{id}">{getMessage($lang, "ui.quantity")}</label>
    <input type="number" id="quantity-{id}" placeholder="0" value={action.quantity} on:input={e => change({ quantity: Number(e.target.value) })} />
</div>

<div class="input currency">
    <label for="currency-{id}">{getMessage($lang, "ui.currency")}</label>
    <select id="currency-{id}" value={action.value[0]} on:change={e => change({ currency: [Number(e.target.value), action.value[1]] })}>
        {#each currencyTypes as currency}
            <option value={currency}>{currency}</option>
        {/each}
    </select>
</div>
