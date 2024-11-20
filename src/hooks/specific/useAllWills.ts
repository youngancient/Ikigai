// import { useCallback, useEffect, useState } from "react";
// import { useWillContract } from "../useContracts";
// import { useAppKitAccount } from "@reown/appkit/react";
// import { toast } from "react-toastify";
// import { Contract, Interface } from "ethers";
// import WILL_ABI from "../../ABI/will.json";
// import { ErrorDecoder } from "ethers-decode-error";
// import useRunners from "../useRunners";


// const multiCallABI = [
//     "function tryAggregate(bool requireSuccess, (address target, bytes callData)[] calls) returns ((bool success, bytes returnData)[] returnData)",
//   ];
  
 

//   interface IWill {
//     id: BigInt;
//     owner: string;
//     name: string;
//     lastActivity: BigInt;
//     isActive: boolean;
//     etherAllocation: BigInt;
//     gracePeriod: BigInt;
//     activityThreshold: BigInt;
//     deadManSwitchTriggered: boolean;
//     deadManSwitchTimestamp: BigInt;
//   }
//   export const useWill = () => {
//     const [wills, setWills] = useState<IWill | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
  
//     const { address } = useAppKitAccount();
//     const readOnlyWillRegistry = useWillContract();

//     const { readOnlyProvider } = useRunners();

//     const errorDecoder = ErrorDecoder.create();

//     const fetchBlockTimestamp = async () => {
//         try {
//           const latestBlock = await readOnlyProvider.getBlock("latest");
//           return latestBlock ? latestBlock.timestamp : null;
//         } catch (error) {
//           console.log("error fetching block timestamp: ", error);
//         }
//       };

//     const fetchWill = useCallback(async () => {
//       if (!readOnlyWillRegistry) {
//         setWills(null);
//         return;
//       }
//       if (!address) {
//         setWills(null);
//         return;
//       }
//       try {
//         setIsLoading(true);
//         const _will = await readOnlyWillRegistry.wills(address);
//         console.log(_will);
//         setWill(_will);
//       } catch (error) {
//         setWill(null);
//         console.log(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }, [readOnlyWillRegistry, address]);
  
//     const fetchWills = useCallback(
//         async () => {
//             if (!readOnlyWillRegistry) {
//                 setWills(null);
//                 return;
//               }
//               if (!address) {
//                 setWills(null);
//                 return;
//               }
//           const multicallContract = new Contract(
//             import.meta.env.VITE_MULTICALL_ADDRESS,
//             multiCallABI,
//             readOnlyProvider
//           );
    
//           // if (!address) return;
//           // contract interface
    
//           const iface = new Interface(WILL_ABI);
    
//           try {
//             setIsLoading(true);
          
//             const willNo = await readOnlyWillRegistry.wills(address);
    
//             // we subtract 1 from the length
//             const willIdArray = Array.from(
//               { length: willNo - 1 },
//               (_, i) => i + 1
//             );
    
//             const calls = proposalIdArray.map((id) => ({
//               target: import.meta.env.VITE_CONTRACT_ADDRESS,
//               callData: iface.encodeFunctionData("proposals", [id]),
//             }));
    
//             const responses = await multicallContract.tryAggregate.staticCall(
//               true,
//               calls
//             );
//             const decodedResults = responses.map((response) =>
//               iface.decodeFunctionResult("proposals", response.returnData)
//             );
    
//             // using multiCall to call contract function
//             const isVotedCalls = proposalIdArray.map((id) => ({
//               target: import.meta.env.VITE_CONTRACT_ADDRESS,
//               callData: iface.encodeFunctionData("hasVoted", [address, id]),
//             }));
//             const isVotedResponses =
//               await multicallContract.tryAggregate.staticCall(true, isVotedCalls);
//             const decodedIsVotedResults = isVotedResponses.map((response) =>
//               iface.decodeFunctionResult("hasVoted", response.returnData)
//             );
    
//             // using eventFilters
//             // const votedFilter = readOnlyProposalContract.filters.Voted(null,address);
//             // const votedEvents = await readOnlyProposalContract.queryFilter(votedFilter);
//             // console.log(votedEvents);
//             const blockTime = await fetchBlockTimestamp();
    
//             console.log("block time: ", blockTime);
    
//             const data = decodedResults.map((proposalStruct, index) => ({
//               id: proposalIdArray[index],
//               description: proposalStruct.description,
//               amount: proposalStruct.amount,
//               minRequiredVote: proposalStruct.minVotesToPass,
//               voteCount: Number(proposalStruct.voteCount),
//               deadline: proposalStruct.votingDeadline,
//               executed: proposalStruct.executed,
//               isVoted: decodedIsVotedResults[index][0],
//               isDeadlinePassed: blockTime > Number(proposalStruct.votingDeadline),
//             }));
    
//             // console.log(data);
    
//             setAllProposals(data);
//           } catch (error) {
//             const decodedError = await errorDecoder.decode(error);
//             toast.error(decodedError.reason);
//           } finally{
//             setIsLoading(false);
//           }
//         },
//         [readOnlyWillRegistry, address],
//         readOnlyProvider
//       );
    
//       useEffect(() => {
//         fetchAllProposals();
//       }, [fetchAllProposals]);
  
//     return { will, isLoading };
//   };