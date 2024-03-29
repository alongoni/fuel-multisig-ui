import { createContext, useCallback, useContext, useState } from "react";

import { createNotImplementedWarning } from "@/utils/error";

export interface AppNotification {
  id: number;
  message: string;
  type?: "default" | "info" | "success" | "error" | "warning";
}

export function isAppNotification(obj: unknown): obj is AppNotification {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "message" in obj &&
    typeof (obj as AppNotification).id === "number" &&
    typeof (obj as AppNotification).message === "string" &&
    ((obj as AppNotification).type === undefined ||
      typeof (obj as AppNotification).type === "string")
  );
}

type NotificationWithoutId = Omit<AppNotification, "id">;

export interface AppNotificationRepository {
  appNotifications: AppNotification[];
  addNotification(notification: NotificationWithoutId): void;
  removeNotification(id: number): void;
}

const AppNotificationContext = createContext<AppNotificationRepository>({
  appNotifications: [],
  addNotification: () => createNotImplementedWarning("addNotification"),
  removeNotification: (_id: number) =>
    createNotImplementedWarning("removeNotification"),
});

export function AppNotificationsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appNotifications, setAppNotifications] = useState<AppNotification[]>(
    []
  );

  const addNotification = useCallback((notification: NotificationWithoutId) => {
    const newNotification: AppNotification = {
      ...notification,
      id: new Date().getTime(),
    };
    setAppNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setAppNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== id)
    );
  }, []);

  return (
    <AppNotificationContext.Provider
      value={{ appNotifications, addNotification, removeNotification }}
    >
      {children}
    </AppNotificationContext.Provider>
  );
}

export const useAppNotificationContext = () =>
  useContext(AppNotificationContext);
