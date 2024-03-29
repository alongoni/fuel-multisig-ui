import Image from "next/image";
import * as React from "react";

import { useNameAddressBookContext } from "@/context/NameInAddressBookContext";
import {
  isXsignerOrCustomContract,
  TransactionProposedItemUi,
} from "@/domain/TransactionProposedItemUi";
import { TX_TYPE } from "@/hooks/transactions/const";
import { formatDate, truncateAddress } from "@/utils/formatString";

import { LoadingSkeleton } from "../common/LoadingSkeleton";
import {
  ListItemtyled,
  StyledBox,
  StyledStack,
  StyledValueBox,
} from "./styled";

interface Props {
  data: TransactionProposedItemUi;
  owners: number;
}

export const TxQueueWidgetItem = ({ data, owners }: Props) => {
  const date = formatDate(data.creationTimestamp);
  const { to, approvalCount, type, img, methodName } = data;
  const { nameConnectedOrAddressBookOrSigners } = useNameAddressBookContext();
  const nameFound = to && nameConnectedOrAddressBookOrSigners(to);

  if (!data.type) {
    return (
      <ListItemtyled>
        <StyledBox sx={{ width: "100%", minHeight: "2.8rem" }}>
          <LoadingSkeleton />
        </StyledBox>
      </ListItemtyled>
    );
  }

  return (
    <ListItemtyled>
      <StyledBox sx={{ width: "100%" }}>
        <StyledBox>
          <Image
            src={img}
            alt="Arrow receive"
            priority
            width={30}
            height={30}
          />
          <StyledStack>
            <span>
              {isXsignerOrCustomContract(type) && methodName
                ? methodName
                : type}
            </span>
            <span>{date}</span>
            <p>
              {data.txMsg}
              {": "}
              {nameFound
                ? `${nameFound} (${truncateAddress(to, 3)})`
                : truncateAddress(to, 12)}
            </p>
          </StyledStack>
        </StyledBox>
        <StyledValueBox>
          {type === TX_TYPE.RECEIVE ? `+` : "-"}
          {`${data.valueAmount}`}
          <span>
            {approvalCount}/{owners}
          </span>
        </StyledValueBox>
      </StyledBox>
    </ListItemtyled>
  );
};
