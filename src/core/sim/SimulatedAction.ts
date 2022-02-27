import { Action } from "../action/Action";
import { Fee } from "../Fee";

export interface TimedAction {
    action: Action;
    time: number;
}

export interface TimedFee {
    fee: Fee;
    time: number;
}

// This interface needs to be able to express an action that is either
// - one off
// - repeatable e.g. once every month, once every two months
export interface SimulatedAction {
    action: Action;
    startTime: number;
    endTime: number; // when we stop the action
    period: number; // number of time between each action
}

export function simulatedActionToTimedActions(simulatedAction: SimulatedAction): TimedAction[] {
    const timedActions: TimedAction[] = [];
    for(let time = simulatedAction.startTime; time < simulatedAction.endTime; time += simulatedAction.period) {
        timedActions.push({
            action: {
                ...simulatedAction.action,
            },
            time,
        });
    }
    return timedActions;
}
