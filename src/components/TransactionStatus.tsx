import { Activity } from "../types/activity";

interface TransactionStatusProps {
    status: Activity['transactionStatus'];
  }
  
  export const TransactionStatus = ({ status }: TransactionStatusProps) => {
    const getStatusColor = () => {
      switch (status) {
        case 'confirmed':
          return 'bg-green-500';
        case 'pending':
          return 'bg-yellow-500 animate-pulse';
        case 'failed':
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    };
  
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="text-xs capitalize text-gray-400">{status}</span>
      </div>
    );
  };