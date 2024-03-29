import { ContractParam } from "./repositores/ISquidDbRepository";

export interface Approval {
  approver: string;
  approvalTimestamp: Date;
}

export interface Rejection {
  rejector: string;
  rejectionTimestamp: Date;
}

export interface Arguments {
  args: ContractParam[] | null;
}

export interface TransactionProposed extends Arguments {
  approvalCount: number;
  approvals: Approval[];
  contractAddress: string;
  creationBlockNumber: number;
  creationTimestamp: Date;
  error: string | null;
  executionTxHash: string | null;
  id: string;
  lastUpdatedBlockNumber: number;
  lastUpdatedTimestamp: Date;
  proposalTxHash: string;
  proposer: string;
  rejectionCount: number;
  rejections: Rejection[];
  selector: string;
  methodName: string | null;
  status: string;
  txId: string;
  value: string;
  rawArgs: string | null;
  typename: string;
}

export interface TransferProposed {
  creationBlockNumber: number;
  creationTimestamp: Date;
  from: string;
  id: string;
  to: string;
  tokenAddress: string;
  tokenDecimals: string;
  transferType: string;
  value: string;
  typename: string;
}

export type FullTxProposed = TransactionProposed & TransferProposed;
