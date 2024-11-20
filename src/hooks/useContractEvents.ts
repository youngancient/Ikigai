import { useEffect, useState } from "react";
import { type EventLog, type Result } from "ethers";
import { useTrustFundContract } from "./useContracts";
import type {
  FundCreatedEvent,
  FundDepositEvent,
  FundStatusChangedEvent,
  FundWithdrawnEvent,
} from "../types/trustfund";

interface ParsedEventLog extends EventLog {
  args: Result & {
    fundId: bigint;
    fundName?: string;
    trustee?: string;
    beneficiary?: string;
    targetAmount?: bigint;
    targetDate?: bigint;
    depositor?: string;
    amount?: bigint;
    newBalance?: bigint;
    isActive?: boolean;
    withdrawalTime?: bigint;
  };
}

export function useTrustFundEvents(fundId?: bigint) {
  const contract = useTrustFundContract();
  const [events, setEvents] = useState<{
    created: FundCreatedEvent[];
    deposits: FundDepositEvent[];
    statusChanges: FundStatusChangedEvent[];
    withdrawals: FundWithdrawnEvent[];
  }>({
    created: [],
    deposits: [],
    statusChanges: [],
    withdrawals: [],
  });

  useEffect(() => {
    if (!contract || !fundId) return;

    const fetchEvents = async () => {
      try {
        const createdFilter = contract.filters.FundCreated(fundId);
        const createdLogs = await contract.queryFilter(createdFilter);
        const parsedCreatedEvents = createdLogs
          .filter((log): log is ParsedEventLog => "args" in log)
          .map((log) => ({
            fundId: log.args.fundId,
            fundName: log.args.fundName!,
            trustee: log.args.trustee!,
            beneficiary: log.args.beneficiary!,
            targetAmount: log.args.targetAmount!,
            targetDate: log.args.targetDate!,
          }));

        const depositFilter = contract.filters.FundDeposit(fundId);
        const depositLogs = await contract.queryFilter(depositFilter);
        const parsedDepositEvents = depositLogs
          .filter((log): log is ParsedEventLog => "args" in log)
          .map((log) => ({
            fundId: log.args.fundId,
            depositor: log.args.depositor!,
            amount: log.args.amount!,
            newBalance: log.args.newBalance!,
            transactionHash: log.transactionHash,
          }));

        const statusFilter = contract.filters.FundStatusChanged(fundId);
        const statusLogs = await contract.queryFilter(statusFilter);
        const parsedStatusEvents = statusLogs
          .filter((log): log is ParsedEventLog => "args" in log)
          .map((log) => ({
            fundId: log.args.fundId,
            isActive: log.args.isActive!,
          }));

        const withdrawalFilter = contract.filters.FundWithdrawn(fundId);
        const withdrawalLogs = await contract.queryFilter(withdrawalFilter);
        const parsedWithdrawalEvents = withdrawalLogs
          .filter((log): log is ParsedEventLog => "args" in log)
          .map((log) => ({
            fundId: log.args.fundId,
            beneficiary: log.args.beneficiary!,
            amount: log.args.amount!,
            withdrawalTime: log.args.withdrawalTime!,
            transactionHash: log.transactionHash,
          }));

        setEvents({
          created: parsedCreatedEvents,
          deposits: parsedDepositEvents,
          statusChanges: parsedStatusEvents,
          withdrawals: parsedWithdrawalEvents,
        });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();

    const handleFundCreated = (
      fundId: bigint,
      fundName: string,
      trustee: string,
      beneficiary: string,
      targetAmount: bigint,
      targetDate: bigint
    ) => {
      setEvents((prev) => ({
        ...prev,
        created: [
          ...prev.created,
          {
            fundId,
            fundName,
            trustee,
            beneficiary,
            targetAmount,
            targetDate,
          },
        ],
      }));
    };

    const handleFundDeposit = (
      fundId: bigint,
      depositor: string,
      amount: bigint,
      newBalance: bigint
    ) => {
      setEvents((prev) => ({
        ...prev,
        deposits: [
          ...prev.deposits,
          {
            fundId,
            depositor,
            amount,
            newBalance,
          },
        ],
      }));
    };

    const handleStatusChanged = (fundId: bigint, isActive: boolean) => {
      setEvents((prev) => ({
        ...prev,
        statusChanges: [
          ...prev.statusChanges,
          {
            fundId,
            isActive,
          },
        ],
      }));
    };

    const handleFundWithdrawn = (
      fundId: bigint,
      beneficiary: string,
      amount: bigint,
      withdrawalTime: bigint
    ) => {
      setEvents((prev) => ({
        ...prev,
        withdrawals: [
          ...prev.withdrawals,
          {
            fundId,
            beneficiary,
            amount,
            withdrawalTime,
          },
        ],
      }));
    };

    contract.on("FundCreated", handleFundCreated);
    contract.on("FundDeposit", handleFundDeposit);
    contract.on("FundStatusChanged", handleStatusChanged);
    contract.on("FundWithdrawn", handleFundWithdrawn);

    return () => {
      contract.off("FundCreated", handleFundCreated);
      contract.off("FundDeposit", handleFundDeposit);
      contract.off("FundStatusChanged", handleStatusChanged);
      contract.off("FundWithdrawn", handleFundWithdrawn);
    };
  }, [contract, fundId]);

  return events;
}
