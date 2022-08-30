import { defineStore } from 'pinia'

export enum NotificationTypes {
  ERROR,
  INFO,
  SUCCESS,
  LOADER,
}

export interface NotificationType {
  type: NotificationTypes
  message?: string
}

interface NotificationState {
  notifications: NotificationType[]
}

export const useNotification = defineStore({
  id: 'notification',
  state: () =>
    ({
      notifications: [],
    } as NotificationState),
  actions: {
    addNotification(type: NotificationTypes, message?: string) {
      this.notifications.push({ type, message })
    },
  },
})
