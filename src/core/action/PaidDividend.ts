import { ActionType } from "./ActionType";
import { Money } from "../Money";

export interface PaidDividend {
    type: ActionType.PaidDividend;
    value: Money;
}
