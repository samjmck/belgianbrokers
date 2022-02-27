import { ActionType } from "./ActionType";
import { Money } from "../Money";

export interface Deposit {
    type: ActionType.Deposit;
    value: Money;
}
