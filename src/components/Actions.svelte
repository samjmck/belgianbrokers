<script lang="ts">
    import Action from "./Action.svelte";
    import { actions, lang, actionNumbers } from "../stores";
    import { CurrencyType } from "../core/Money";
    import { Exchange, SecurityType, TransactionType } from "../core/action/Transaction";
    import { ActionType } from "../core/action/ActionType";
    import { getMessage } from "../core/i18n/language";

    let actionId = 0;
    function addAction() {
        actions.add({
            type: ActionType.Transaction,
            exchange: Exchange.EuronextAmsterdam,
            transactionType: TransactionType.Buy,
            security: {
                type: SecurityType.Share,
                isin: "",
            },
            quantity: 1,
            value: [CurrencyType.EUR, 1_00],
        });
        actionId++;
    }
</script>

<div class="actions">
    <div class="actions-header">
        <span class="title">{getMessage($lang, "ui.transactions")}</span>
        <button on:click|preventDefault={addAction}>{getMessage($lang, "ui.newtransaction")}</button>
        <span class="meta"><span class="count">{$actions.length}</span> {$actions.length === 1 ? getMessage($lang, "ui.transaction", false) : getMessage($lang, "ui.transactions", false)}</span>
    </div>

    <div class="actions-content">
        {#each $actions as action (action)}
            <Action {action} {actionId} actionNumber={$actionNumbers.get(action)} />
        {/each}
    </div>
</div>

<style>
    div.actions {
        background-color: #FEFEFE;
        border-radius: 0.3em;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        border: 1px solid #E3E3E3;
        width: 850px;
        margin: 0.75em;
        height: 95vh;
        overflow-y: scroll;
        position: relative;
    }

    div.actions-header {
        display: flex;
        position: absolute;
        flex-direction: row;
        align-items: center;
        padding: 0.6em 0.8em;
        border-bottom: 2px solid #E3E3E3;
        width: 100%;
    }

    div.actions-header span.title {
        font-weight: bold;
        letter-spacing: 0.02em;
        font-size: 1.75em;
        margin-right: 0.5em;
    }

    div.actions-header span.meta {
        margin-left: auto;
        color: #8E8E8E;
    }

    div.actions-header span.count {
        color: #272727;
        font-weight: bold;
        margin-right: 0.05em;
    }

    div.actions-content {
        margin-top: 3.2em;
    }
</style>
