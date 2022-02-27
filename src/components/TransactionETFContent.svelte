<script lang="ts">
    import type { ETF, Option, Transaction } from "../core/action/Transaction";
    import { actions, lang } from "../stores";
    import { getMessage } from "../core/i18n/language";
    import { Share } from "../core/action/Transaction";

    export let change: (newProperties: Partial<ETF>) => void;
    export let securityData: ETF;
    export let id: number;
</script>

<div class="input isin">
    <label for="isin-{id}">{getMessage($lang, "ui.isin")}</label>
    <input type="text" id="isin-{id}" placeholder="IE00BK5BQT80" value={securityData.isin} on:input={e => change({ isin: e.target.value })} />
</div>
