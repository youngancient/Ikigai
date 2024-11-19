export const TRUSTFUND_CONTRACT_ADDRESS =
  process.env.VITE_TRUSTFUND_ADDRESS ||
  "0x924698555d528356DF5f6ECdAA39a0904a707b1a";

export const TRUSTFUND_ABI = [
  {
    inputs: [],
    name: "FundAlreadyWithdrawn",
    type: "error",
  },
  {
    inputs: [],
    name: "FundInactive",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDeposit",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFundId",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFundParameters",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTargetDate",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedAccess",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawalBeforeTargetDate",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawalNotAllowed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "fundName",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "trustee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetDate",
        type: "uint256",
      },
    ],
    name: "FundCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "FundDeposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    name: "FundStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "withdrawalTime",
        type: "uint256",
      },
    ],
    name: "FundWithdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "fundName",
        type: "string",
      },
      {
        internalType: "string",
        name: "purpose",
        type: "string",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "targetAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "targetDate",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "category",
        type: "string",
      },
    ],
    name: "createFund",
    outputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "fundIds",
        type: "uint256[]",
      },
    ],
    name: "getBatchFundDetails",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "fundName",
            type: "string",
          },
          {
            internalType: "string",
            name: "purpose",
            type: "string",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "targetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "targetDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentBalance",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "trustee",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isWithdrawn",
            type: "bool",
          },
        ],
        internalType: "struct TrustFund.Fund[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
    ],
    name: "getFundBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
    ],
    name: "getFundDetails",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "fundName",
            type: "string",
          },
          {
            internalType: "string",
            name: "purpose",
            type: "string",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "targetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "targetDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentBalance",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "trustee",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isWithdrawn",
            type: "bool",
          },
        ],
        internalType: "struct TrustFund.Fund",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
    ],
    name: "getTimeRemaining",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalFunds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "trustee",
        type: "address",
      },
    ],
    name: "getTrusteeFunds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
    ],
    name: "isTargetReached",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "isTrustee",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
    ],
    name: "isWithdrawable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "setFundStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fundId",
        type: "uint256",
      },
    ],
    name: "withdrawFund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
