<script lang="ts">
    import type { Share, Transaction } from "../core/action/Transaction";
    import { actions, lang } from "../stores";
    import { getMessage } from "../core/i18n/language";

    export let change: (newProperties: Partial<Share>) => void;
    export let securityData: Share;
    export let id: number;
</script>

<div class="input isin">
    <label for="isin-{id}">{getMessage($lang, "ui.isin")}</label>
    <input type="text" id="isin-{id}" placeholder="IE00BK5BQT80" value={securityData.isin} on:input={e => change({ isin: e.target.value })} />
</div>
