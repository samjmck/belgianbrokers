<script lang="ts">
    import { getMessage, getActionType } from "../core/i18n/language";
    import { actionNumbers, actions, lang } from "../stores";

    export let opened;

    function closeWindow() {
        opened = false;
    }
</script>

<div class="simulator-container" class:opened>
    <div class="simulator-window">
        <div class="simulator-header">
            <span class="title">{getMessage($lang, "ui.simulator")}</span>
            <button on:click|preventDefault={closeWindow}>{getMessage($lang, "ui.close")}</button>
        </div>
        <div class="simulator-content">
            <div class="timed-actions">
                {#each $actions as action (action)}
                    <span class="title-action">{getActionType($lang, action.type)} #{$actionNumbers.get(action)}</span>
                    <input type="date" name="start-time" />
                    <input type="date" name="end-time" />
                    <input type="number" name="period" />
                {/each}
            </div>
            <div class="simulation">

            </div>
        </div>
    </div>
</div>

<style>
    div.simulator-container {
        padding: 2em;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        background-color: rgba(0, 0, 0, .2);
        display: none;
    }
    .opened {
        display: none;
    }
    div.simulator-window {
        width: 100%;
        height: 100%;
        background-color: #FEFEFE;
        border-radius: 0.3em;
        margin: 0.75em;
    }

    div.simulator-header {
        display: flex;
        position: absolute;
        flex-direction: row;
        align-items: center;
        padding: 0.6em 0.8em;
        border-bottom: 2px solid #E3E3E3;
        width: 100%;
    }

    div.simulator-header span.title {
        font-weight: bold;
        letter-spacing: 0.02em;
        font-size: 1.75em;
        margin-right: 0.5em;
    }

    div.simulator-header span.meta {
        margin-left: auto;
        color: #8E8E8E;
    }

    div.simulator-header span.count {
        color: #272727;
        font-weight: bold;
        margin-right: 0.05em;
    }
</style>
