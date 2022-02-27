<script lang="ts">
    import type { Option } from "../core/action/Transaction";

    export let change: (newProperties: Partial<Option>) => void;
    export let securityData: Option;
    export let id: number;
</script>
