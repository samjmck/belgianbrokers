<script lang="ts">
    import type { Bond } from "../core/action/Transaction";
    import { lang } from "../stores";
    import { getMessage } from "../core/i18n/language";

    export let change: (newProperties: Partial<Bond>) => void;
    export let securityData: Bond;
    export let id: number;

    const date = new Date(securityData.maturity);
    const dateValue = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay() + 1}`;
</script>

<div class="input maturity">
    <label for="maturity-{id}">{getMessage($lang, "ui.maturity")}</label>
    <input type="date" id="maturity-{id}" placeholder="2022/9/2" value={dateValue} on:input={e => change({ maturity: Date.parse(e.target.value) })} />
</div>
