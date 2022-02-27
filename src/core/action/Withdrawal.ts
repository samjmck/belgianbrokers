import { ActionType } from "./ActionType";
import { Money } from "../Money";

export interface Withdrawal {
    type: ActionType.Withdrawal;
    value: Money;
}
