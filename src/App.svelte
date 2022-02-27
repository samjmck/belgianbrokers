<script lang="ts">
    import Actions from "./components/Actions.svelte";
    import Brokers from "./components/Brokers.svelte";
</script>

<div class="windows">
    <Actions />
    <Brokers />
</div>

<style>
    div.windows {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }
</style>
