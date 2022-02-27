import { Withdrawal } from "./Withdrawal";
import { OpenAccount } from "./OpenAccount";
import { Transaction } from "./Transaction";
import { Deposit } from "./Deposit";
import { PaidDividend } from "./PaidDividend";

// Each `Action` has a `type` property of type `ActionType` which allows you to determine the
// type of the action at runtime
// as well as a `time` property which gives the time at which the action was taken
export type Action =
    Withdrawal |
    OpenAccount |
    Transaction |
    Deposit |
    PaidDividend;
