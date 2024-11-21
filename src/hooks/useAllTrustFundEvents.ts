import { useEffect, useState } from 'react';
import { type EventLog, type Log, type Result } from 'ethers';
import { useTrustFundContract } from './useContracts';
import type { 
  FundCreatedEvent, 
  FundDepositEvent,
  FundStatusChangedEvent,
  FundWithdrawnEvent 
} from '../types/trustfund';

interface EventTransaction {
  transactionHash: string;
  blockNumber: number;
  blockTimestamp: number;
}

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

export function useAllTrustFundEvents() {
  const contract = useTrustFundContract();
  const [events, setEvents] = useState<{
    created: (FundCreatedEvent & EventTransaction)[];
    deposits: (FundDepositEvent & EventTransaction)[];
    statusChanges: (FundStatusChangedEvent & EventTransaction)[];
    withdrawals: (FundWithdrawnEvent & EventTransaction)[];
  }>({
    created: [],
    deposits: [],
    statusChanges: [],
    withdrawals: []
  });

  useEffect(() => {
    if (!contract) return;

    const fetchEvents = async () => {
      try {
        // Create filters without fundId parameter
        const createdFilter = contract.filters.FundCreated();
        const depositFilter = contract.filters.FundDeposit();
        const statusFilter = contract.filters.FundStatusChanged();
        const withdrawalFilter = contract.filters.FundWithdrawn();

        // Fetch all events
        const [createdLogs, depositLogs, statusLogs, withdrawalLogs] = await Promise.all([
          contract.queryFilter(createdFilter),
          contract.queryFilter(depositFilter),
          contract.queryFilter(statusFilter),
          contract.queryFilter(withdrawalFilter)
        ]);

        const processCreatedEvent = async (log: EventLog | Log): Promise<FundCreatedEvent & EventTransaction> => {
          const event = log as ParsedEventLog;
          const block = await event.getBlock();
          return {
            fundId: event.args.fundId,
            fundName: event.args.fundName!,
            trustee: event.args.trustee!,
            beneficiary: event.args.beneficiary!,
            targetAmount: event.args.targetAmount!,
            targetDate: event.args.targetDate!,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            blockTimestamp: block.timestamp
          };
        };

        const processDepositEvent = async (log: EventLog | Log): Promise<FundDepositEvent & EventTransaction> => {
          const event = log as ParsedEventLog;
          const block = await event.getBlock();
          return {
            fundId: event.args.fundId,
            depositor: event.args.depositor!,
            amount: event.args.amount!,
            newBalance: event.args.newBalance!,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            blockTimestamp: block.timestamp
          };
        };

        const processStatusEvent = async (log: EventLog | Log): Promise<FundStatusChangedEvent & EventTransaction> => {
          const event = log as ParsedEventLog;
          const block = await event.getBlock();
          return {
            fundId: event.args.fundId,
            isActive: event.args.isActive!,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            blockTimestamp: block.timestamp
          };
        };

        const processWithdrawalEvent = async (log: EventLog | Log): Promise<FundWithdrawnEvent & EventTransaction> => {
          const event = log as ParsedEventLog;
          const block = await event.getBlock();
          return {
            fundId: event.args.fundId,
            beneficiary: event.args.beneficiary!,
            amount: event.args.amount!,
            withdrawalTime: event.args.withdrawalTime!,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            blockTimestamp: block.timestamp
          };
        };

        // Process all events with their details
        const [
          processedCreatedEvents,
          processedDepositEvents,
          processedStatusEvents,
          processedWithdrawalEvents
        ] = await Promise.all([
          Promise.all(createdLogs.map(processCreatedEvent)),
          Promise.all(depositLogs.map(processDepositEvent)),
          Promise.all(statusLogs.map(processStatusEvent)),
          Promise.all(withdrawalLogs.map(processWithdrawalEvent))
        ]);

        setEvents({
          created: processedCreatedEvents,
          deposits: processedDepositEvents,
          statusChanges: processedStatusEvents,
          withdrawals: processedWithdrawalEvents
        });
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();

    // Event handlers for real-time updates
    const handleFundCreated = async (...args: any[]) => {
      const event = args[args.length - 1] as EventLog;
      const block = await event.getBlock();
      
      const newEvent: FundCreatedEvent & EventTransaction = {
        fundId: args[0],
        fundName: args[1],
        trustee: args[2],
        beneficiary: args[3],
        targetAmount: args[4],
        targetDate: args[5],
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        blockTimestamp: block.timestamp
      };

      setEvents(prev => ({
        ...prev,
        created: [...prev.created, newEvent]
      }));
    };

    const handleFundDeposit = async (...args: any[]) => {
      const event = args[args.length - 1] as EventLog;
      const block = await event.getBlock();

      const newEvent: FundDepositEvent & EventTransaction = {
        fundId: args[0],
        depositor: args[1],
        amount: args[2],
        newBalance: args[3],
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        blockTimestamp: block.timestamp
      };

      setEvents(prev => ({
        ...prev,
        deposits: [...prev.deposits, newEvent]
      }));
    };

    const handleStatusChanged = async (...args: any[]) => {
      const event = args[args.length - 1] as EventLog;
      const block = await event.getBlock();

      const newEvent: FundStatusChangedEvent & EventTransaction = {
        fundId: args[0],
        isActive: args[1],
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        blockTimestamp: block.timestamp
      };

      setEvents(prev => ({
        ...prev,
        statusChanges: [...prev.statusChanges, newEvent]
      }));
    };

    const handleFundWithdrawn = async (...args: any[]) => {
      const event = args[args.length - 1] as EventLog;
      const block = await event.getBlock();

      const newEvent: FundWithdrawnEvent & EventTransaction = {
        fundId: args[0],
        beneficiary: args[1],
        amount: args[2],
        withdrawalTime: args[3],
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        blockTimestamp: block.timestamp
      };

      setEvents(prev => ({
        ...prev,
        withdrawals: [...prev.withdrawals, newEvent]
      }));
    };

    // Set up event listeners
    contract.on('FundCreated', handleFundCreated);
    contract.on('FundDeposit', handleFundDeposit);
    contract.on('FundStatusChanged', handleStatusChanged);
    contract.on('FundWithdrawn', handleFundWithdrawn);

    // Cleanup function
    return () => {
      contract.off('FundCreated', handleFundCreated);
      contract.off('FundDeposit', handleFundDeposit);
      contract.off('FundStatusChanged', handleStatusChanged);
      contract.off('FundWithdrawn', handleFundWithdrawn);
    };
  }, [contract]);

  return events;
}