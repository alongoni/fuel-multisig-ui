import gql from "graphql-tag";

import {
  ITxQueueRepository,
  MyQueryResponse,
  MyQueryVariables,
} from "@/domain/repositores/ITxQueueRepository";
import { FullTxProposed } from "@/domain/TransactionProposed";

import { GraphClient } from "./GraphClient";
import { rawToFullTxProposed } from "./transformers/toTransactionProposed";

const FETCH_QUEUE = gql`
  query TxQueue($address: String!) {
    transactions(
      where: { multisig: { addressSS58_eq: $address }, status_eq: PROPOSED }
      orderBy: creationTimestamp_DESC
    ) {
      approvalCount
      approvals {
        approvalBlockNumber
        approvalTimestamp
        approver
        id
      }
      args
      contractAddress
      creationBlockNumber
      creationTimestamp
      error
      executionTxHash
      externalTransactionData {
        args
        creationTimestamp
        id
        inUse
        methodName
      }
      id
      lastUpdatedBlockNumber
      lastUpdatedTimestamp
      proposalTxHash
      proposer
      rejectionCount
      rejections {
        id
        rejectionBlockNumber
        rejectionTimestamp
        rejector
      }
      selector
      status
      txId
      value
    }
  }
`;

export class TxQueueRepository implements ITxQueueRepository {
  constructor(private client: GraphClient) {}

  async getQueue(address: string): Promise<FullTxProposed[] | null> {
    const client = this.client.getCurrentApolloClient();
    const { data } = await client.query<MyQueryResponse, MyQueryVariables>({
      query: FETCH_QUEUE,
      variables: { address },
      fetchPolicy: "network-only",
    });
    return data?.transactions.map((transactions) =>
      rawToFullTxProposed(transactions)
    );
  }
}
