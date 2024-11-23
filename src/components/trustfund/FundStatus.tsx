interface FundStatusProps {
    isActive: boolean;
    targetDate: bigint;
    currentBalance: bigint;
    targetAmount: bigint;
  }
  
  export const FundStatus = ({
    isActive,
    targetDate,
    currentBalance,
    targetAmount,
  }: FundStatusProps) => {
    const now = Math.floor(Date.now() / 1000);
    const targetReached = currentBalance >= targetAmount;
    const dateReached = now >= Number(targetDate);
  
    let status = "In Progress";
    let statusColor = "text-blue-500";
  
    if (!isActive) {
      status = "Inactive";
      statusColor = "text-red-500";
    } else if (targetReached && dateReached) {
      status = "Ready for Withdrawal";
      statusColor = "text-green-500";
    } else if (targetReached) {
      status = "Target Reached";
      statusColor = "text-green-500";
    }
  
    return (
      <div className={`inline-flex items-center gap-2 ${statusColor}`}>
        <span className="w-2 h-2 rounded-full bg-current" />
        <span>{status}</span>
      </div>
    );
  };