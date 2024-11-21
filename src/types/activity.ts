interface ActivityDetails {
  fundId: string;
  fundName?: string;
  from?: string;
  to?: string;
  amount?: string;
  newBalance?: string;
  status?: boolean;
}

export interface Activity {
  type: 'created' | 'deposit' | 'withdrawal' | 'status';
  timestamp: number;
  transactionHash: string;
  details: ActivityDetails;
  transactionStatus: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
}

  export interface FilterOptions {
    type?: Activity['type'][];
    dateRange?: {
      start: Date | null;
      end: Date | null;
    };
    searchTerm?: string;
  }