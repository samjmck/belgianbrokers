<script lang="ts">
    import Broker from "./Broker.svelte";

    import { brokers } from "../stores";
    import { BrokerName } from "../core/broker/Broker";

    const brokerLogoSources: { [brokerName: BrokerName]: { type, srcset, src }[] } = {
        [BrokerName.Bolero]: [
            {
                type: "image/svg",
                src: "assets/broker-logos/bolero-logo.svg",
                srcset: "assets/broker-logos/bolero-logo.svg 1x",
            },
        ],
        [BrokerName.BNPParibasFortis]: [
            {
                type: "image/png",
                src: "assets/broker-logos/bnpparibasfortis-logo.svg",
                srcset: "assets/broker-logos/bnpparibasfortis-logo.svg 1x",
            },
        ],
        [BrokerName.Argenta]: [
            {
                type: "image/png",
                src: "assets/broker-logos/argenta-logo.svg",
                srcset: "assets/broker-logos/argenta-logo.svg 1x",
            },
        ],
        [BrokerName.DEGIROBEBasic]: [
            {
                type: "image/png",
                src: "assets/broker-logos/degiro-logo.svg",
                srcset: "assets/broker-logos/degiro-logo.svg 1x",
            },
        ],
        [BrokerName.LYNX]: [
            {
                type: "image/svg",
                src: "assets/broker-logos/lynx-logo.svg",
                srcset: "assets/broker-logos/lynx-logo.svg 1x",
            },
        ],
    };
</script>

<div class="brokers">
    {#each $brokers as broker}
        <Broker {broker} logoSources={brokerLogoSources[broker.name]} />
    {/each}
</div>

<style>
    div.brokers {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        background-color: #FEFEFE;
        filter: drop-shadow(-1px 0px 1px rgba(0, 0, 0, 0.05));
        height: 100vh;
        overflow: auto;
    }
</style>
