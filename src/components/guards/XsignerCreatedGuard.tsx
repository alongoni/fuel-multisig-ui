import router from "next/router";
import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";

import { ROUTES } from "@/config/routes";
import { useLocalDbContext } from "@/context/uselocalDbContext";
import { usePolkadotContext } from "@/context/usePolkadotContext";
import { useGetXsignerSelected } from "@/hooks/xsignerSelected/useGetXsignerSelected";
import { useSetXsignerSelected } from "@/hooks/xsignerSelected/useSetXsignerSelected";
import { getErrorMessage } from "@/utils/error";

import { useAppNotificationContext } from "../AppToastNotification/AppNotificationsContext";

interface Props extends PropsWithChildren {
  fallback: ReactElement | null;
}

function isARouteAllowedWithoutAccount(route: string): boolean | undefined {
  return route === ROUTES.New || route === ROUTES.Load;
}

export function XsignerCreatedGuard({ children, fallback = null }: Props) {
  const { xSignerSelected } = useGetXsignerSelected();
  const { setXsigner } = useSetXsignerSelected();
  const { network: networkId, accountConnected } = usePolkadotContext();
  const { signatoriesAccountRepository } = useLocalDbContext();
  const { addNotification } = useAppNotificationContext();
  const isMounted = useRef(false);
  const allowNoAccount = isARouteAllowedWithoutAccount(router.route);

  useEffect(() => {
    if (
      !networkId ||
      !accountConnected ||
      isMounted.current ||
      xSignerSelected ||
      xSignerSelected === undefined ||
      allowNoAccount
    )
      return;

    const fetchXsignersByWallet = async () => {
      try {
        const localMultisigs =
          await signatoriesAccountRepository?.findSignatoriesByOwner(
            accountConnected.address,
            networkId
          );
        if (localMultisigs.length > 0) {
          setXsigner(localMultisigs[0]);
        } else {
          throw Error("No xsigners account were found");
        }
      } catch (err) {
        const error = getErrorMessage(err);
        addNotification({
          message: error,
          type: "error",
        });
        router.replace(ROUTES.Welcome);
      }
    };

    fetchXsignersByWallet();
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, [
    accountConnected,
    addNotification,
    allowNoAccount,
    networkId,
    setXsigner,
    signatoriesAccountRepository,
    xSignerSelected,
  ]);

  if (!xSignerSelected && !allowNoAccount) {
    return fallback;
  }

  return children;
}
