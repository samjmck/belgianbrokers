import { Action } from "../action/Action";
import { Fee } from "../Fee";
import { TimedAction, TimedFee } from "../sim/SimulatedAction";

export enum BrokerName {
    Argenta,
    Belfius,
    BinckBank,
    BNPParibasFortis,
    Bolero,
    DEGIROBEBasic,
    DeutscheBank,
    Keytrade,
    LYNX,
}
export const brokerNames: number[] = [
    BrokerName.Argenta,
    BrokerName.Belfius,
    BrokerName.BinckBank,
    BrokerName.BNPParibasFortis,
    BrokerName.Bolero,
    BrokerName.DEGIROBEBasic,
    BrokerName.DeutscheBank,
    BrokerName.Keytrade,
    BrokerName.LYNX,
];

export abstract class Broker {

    abstract readonly name: BrokerName;

    protected abstract calculateActionFees(action: Action): Fee[];

    calculateFees(actions: Action[]): Map<Action, Fee[]> {
        const fees = new Map<Action, Fee[]> ();
        for(const action of actions) {
            fees.set(action, this.calculateActionFees(action));
        }
        return fees;
    }

    calculateSimulatedFees(timedActions: TimedAction[]): Map<TimedAction, TimedFee[]> {
        const simulatedFees = new Map<TimedAction, TimedFee[]> ();
        for(const timedAction of timedActions) {
            const fees = this.calculateActionFees(timedAction.action);
            const simulatedActionFees: TimedFee[] = [];
            for(const fee of fees) {
                simulatedActionFees.push({
                    fee,
                    time: timedAction.time,
                });
            }
            simulatedFees.set(timedAction, simulatedActionFees);
        }
        return simulatedFees;
    }

}
