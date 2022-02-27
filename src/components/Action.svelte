<script lang="ts">
    import type { Action } from "../core/action/Action";
    import { actions, lang } from "../stores";
    import { ActionType } from "../core/action/ActionType";
    import TransactionContent from "./TransactionContent.svelte";
    import { getActionType, getMessage } from "../core/i18n/language";

    export let action: Action;
    export let actionNumber: number;
    export let actionId: number;

    // Not reactive, so does not change after element has been created
    const id = actionId;

    function remove() {
        actions.remove(action);
    }

    function change(newProperties: Partial<Action>) {
        actions.change(action, newProperties);
    }
</script>

<div class="action">
    <div class="action-header">
        <span class="title">{getActionType($lang, action.type)} #{actionNumber}</span>
        <button class="remove-action containerless" on:click|preventDefault={remove}>{getMessage($lang, "ui.removetransaction")}</button>
    </div>

    <div class="action-content">
        {#if action.type === ActionType.Transaction}
        <TransactionContent {action} {id} />
        {:else if action.type === ActionType.Withdrawal}

        {:else if action.type === ActionType.OpenAccount}

        {:else if action.type === ActionType.Deposit}

        {/if}
    </div>
</div>

<style>
    .action {
        margin: 0 0.8em;
        padding: 1em 0;
        border-bottom: 2px solid #E3E3E3;
    }

    .action-header {
        font-size: 1.2em;
        margin-bottom: 0.5em;
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .action-header .title {
        font-family: "Roboto Mono", monospace;
        font-weight: 500;
    }

    .action-header .remove-action {
        margin-left: auto;
        font-size: 0.8em;
    }

    .action-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .frequency {
        max-width: 5em;
    }
</style>
