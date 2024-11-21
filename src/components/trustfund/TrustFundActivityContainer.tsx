import { useState, useMemo, useEffect } from 'react';
import { useAllTrustFundEvents } from '../../hooks/useAllTrustFundEvents';
import { usePagination } from '../../hooks/usePagination';
import { CopyButton } from '../../components/CopyButton';
import { TransactionStatus } from '../../components/TransactionStatus';
import { Activity, FilterOptions } from "../../types/activity";
import { shortenAddress, getBlockExplorerUrl, formatAmount } from '../../utils/format';
import { ethers } from 'ethers';
import { formatTimestamp } from '../../utils/formatters';

export const TrustFundActivityContainer = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    type: undefined,
    dateRange: { start: null, end: null },
    searchTerm: '',
  });

  const events = useAllTrustFundEvents();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!events) return;
  
    const transformedActivities: Activity[] = [
      // Transform created events
      ...events.created.map((event): Activity => ({
        type: 'created',
        timestamp: event.blockTimestamp,
        transactionHash: event.transactionHash,
        transactionStatus: 'confirmed',
        details: {
          fundId: event.fundId.toString(),
          fundName: event.fundName,
          from: event.trustee,
          to: event.beneficiary,
          amount: ethers.formatEther(event.targetAmount)
        },
        blockNumber: event.blockNumber
      })),
  
      // Transform deposit events
      ...events.deposits.map((event): Activity => ({
        type: 'deposit',
        timestamp: event.blockTimestamp,
        transactionHash: event.transactionHash,
        transactionStatus: 'confirmed',
        details: {
          fundId: event.fundId.toString(),
          from: event.depositor,
          amount: ethers.formatEther(event.amount),
          newBalance: ethers.formatEther(event.newBalance)
        },
        blockNumber: event.blockNumber
      })),
  
      // Transform withdrawal events
      ...events.withdrawals.map((event): Activity => ({
        type: 'withdrawal',
        timestamp: event.blockTimestamp,
        transactionHash: event.transactionHash,
        transactionStatus: 'confirmed',
        details: {
          fundId: event.fundId.toString(),
          to: event.beneficiary,
          amount: ethers.formatEther(event.amount)
        },
        blockNumber: event.blockNumber
      })),
  
      // Transform status change events
      ...events.statusChanges.map((event): Activity => ({
        type: 'status',
        timestamp: event.blockTimestamp,
        transactionHash: event.transactionHash,
        transactionStatus: 'confirmed',
        details: {
          fundId: event.fundId.toString(),
          status: event.isActive
        },
        blockNumber: event.blockNumber
      }))
    ];
  
    // Sort activities by block number and timestamp, most recent first
    const sortedActivities = transformedActivities.sort((a, b) => {
      if (a.blockNumber && b.blockNumber && a.blockNumber !== b.blockNumber) {
        return b.blockNumber - a.blockNumber;
      }
      return b.timestamp - a.timestamp;
    });
    
    setActivities(sortedActivities);
  }, [events]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesType = !filters.type?.length || filters.type.includes(activity.type);
      const matchesDate = 
        (!filters.dateRange?.start || activity.timestamp >= filters.dateRange.start.getTime()) &&
        (!filters.dateRange?.end || activity.timestamp <= filters.dateRange.end.getTime());
      const matchesSearch = !filters.searchTerm || 
        activity.details.fundId.includes(filters.searchTerm) ||
        activity.details.fundName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        activity.transactionHash.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return matchesType && matchesDate && matchesSearch;
    });
  }, [activities, filters]);

  const { paginatedItems, currentPage, setCurrentPage, totalPages } = usePagination(filteredActivities);

  const FilterHeader = () => (
    <div className="mb-4 flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl text-white">Transaction History</h3>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
        </button>
      </div>

      {isFiltersOpen && (
        <div className="p-4 bg-gray-800 rounded-lg space-y-3">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Transaction Type</label>
              <select
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                value={filters.type?.[0] || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  type: e.target.value ? [e.target.value as Activity['type']] : undefined
                }))}
              >
                <option value="">All Types</option>
                <option value="created">Created</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="status">Status Change</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Search</label>
              <input
                type="text"
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                placeholder="Search by ID, name, or hash..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  searchTerm: e.target.value
                }))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderActivityIcon = (type: Activity['type']) => {
    const iconClasses = "h-4 w-4 text-white";
    const containerClasses = "w-8 h-8 rounded-full flex items-center justify-center";
    
    const icons = {
      created: {
        bg: "bg-green-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        )
      },
      deposit: {
        bg: "bg-blue-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1h6v1H7V6zm6 3H7v1h6V9zm-6 3h6v1H7v-1z" />
          </svg>
        )
      },
      withdrawal: {
        bg: "bg-yellow-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 2H8.828a2 2 0 00-1.414.586L6.293 3.707A1 1 0 015.586 4H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        )
      },
      status: {
        bg: "bg-purple-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )
      }
    };
  
    return (
      <div className={`${containerClasses} ${icons[type].bg}`}>
        {icons[type].icon}
      </div>
    );
  };
  
  // Add the main info rendering function
  const renderActivityMainInfo = (activity: Activity) => {
    const getActivityTitle = () => {
      switch (activity.type) {
        case 'created':
          return `New Trust Fund Created: ${activity.details.fundName}`;
        case 'deposit':
          return `Deposit to Fund #${activity.details.fundId}`;
        case 'withdrawal':
          return `Withdrawal from Fund #${activity.details.fundId}`;
        case 'status':
          return `Fund #${activity.details.fundId} Status Changed`;
        default:
          return 'Unknown Activity';
      }
    };
  
    return (
      <div className="space-y-0.5">
        <p className="text-sm text-white font-medium">
          {getActivityTitle()}
        </p>
        {activity.details.amount && (
          <p className="text-sm text-gray-400">
            Amount: {formatAmount(activity.details.amount)}
          </p>
        )}
      </div>
    );
  };

  const ActivityCard = ({ activity }: { activity: Activity }) => {
    const isExpanded = expandedActivity === activity.transactionHash;

    const getActivityColor = (type: Activity['type']) => {
      switch (type) {
        case 'created':
          return 'border-green-500/20 hover:border-green-500/40';
        case 'deposit':
          return 'border-blue-500/20 hover:border-blue-500/40';
        case 'withdrawal':
          return 'border-yellow-500/20 hover:border-yellow-500/40';
        case 'status':
          return 'border-purple-500/20 hover:border-purple-500/40';
        default:
          return 'border-gray-500/20';
      }
    };

    return (
      <div 
        className={`
          border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer
          ${getActivityColor(activity.type)}
          ${isExpanded ? 'bg-gray-800/50' : 'hover:bg-gray-800/30'}
        `}
        onClick={() => setExpandedActivity(isExpanded ? null : activity.transactionHash)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {renderActivityIcon(activity.type)}
            <div className="space-y-1">
              {renderActivityMainInfo(activity)}
              
              {/* Transaction Hash and Status */}
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <a 
                  href={getBlockExplorerUrl(activity.transactionHash, 'tx')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 truncate max-w-[180px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {shortenAddress(activity.transactionHash)}
                </a>
                <CopyButton 
                  text={activity.transactionHash}
                  onClick={(e) => e.stopPropagation()}
                />
                <TransactionStatus status={activity.transactionStatus} />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <span className="text-xs text-gray-400">
            {formatTimestamp(activity.timestamp)}
            </span>
            <svg 
              className={`w-4 h-4 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="space-y-2">
              {activity.details.fundName && (
                <DetailRow label="Fund Name" value={activity.details.fundName} />
              )}
              {activity.details.fundId && (
                <DetailRow label="Fund ID" value={`#${activity.details.fundId}`} />
              )}
              {activity.details.from && (
                <DetailRow 
                  label="From" 
                  value={activity.details.from}
                  isAddress
                />
              )}
              {activity.details.to && (
                <DetailRow 
                  label="To" 
                  value={activity.details.to}
                  isAddress
                />
              )}
              {activity.details.amount && (
                <DetailRow 
                  label="Amount" 
                  value={formatAmount(activity.details.amount)}
                  className="text-white font-medium"
                />
              )}
              {activity.blockNumber && (
                <DetailRow label="Block Number" value={activity.blockNumber.toString()} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const DetailRow = ({ 
    label, 
    value, 
    isAddress = false,
    className = ''
  }: {
    label: string;
    value: string;
    isAddress?: boolean;
    className?: string;
  }) => (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-400">{label}:</span>
      <div className="flex items-center space-x-2">
        {isAddress ? (
          <>
            <a 
              href={getBlockExplorerUrl(value, 'address')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {shortenAddress(value)}
            </a>
            <CopyButton text={value} />
          </>
        ) : (
          <span className={`text-sm ${className || 'text-gray-300'}`}>{value}</span>
        )}
      </div>
    </div>
  );

  const Pagination = () => (
    <div className="mt-4 flex justify-between items-center">
      <span className="text-sm text-gray-400">
        Showing {paginatedItems.length} of {filteredActivities.length} activities
      </span>
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full border-2 border-[#3E3E3E] rounded-xl p-5">
      <FilterHeader />

      <div className="overflow-y-auto h-[500px] space-y-4 custom-scrollbar">
        {paginatedItems.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No activities found
          </div>
        ) : (
          <>
            {paginatedItems.map((activity) => (
              <ActivityCard 
                key={activity.transactionHash} 
                activity={activity} 
              />
            ))}
          </>
        )}
      </div>

      <Pagination />
    </div>
  );
};