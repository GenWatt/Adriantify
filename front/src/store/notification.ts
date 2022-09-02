import { defineStore } from 'pinia'
import { v4 } from 'uuid'

export enum NotificationTypes {
  ERROR,
  INFO,
  SUCCESS,
}

export interface NotificationType {
  type: NotificationTypes
  message: string
  seen: boolean
  _id: string
  hide: boolean
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
    addNotification(notification: Omit<NotificationType, '_id'>) {
      const notificationWithId: NotificationType = { ...notification, _id: v4() }
      this.notifications = [...this.notifications, notificationWithId]
    },
    addNotifications(notifications: Omit<NotificationType, '_id'>[]) {
      const notificationsWithId: NotificationType[] = notifications.map((notification) => ({
        ...notification,
        _id: v4(),
      }))
      this.notifications = [...this.notifications, ...notificationsWithId]
    },
    removeNotification(id: string) {
      this.notifications = this.notifications.filter((notification) => notification._id !== id)
    },
    addQuickNotifaction(notification: Omit<NotificationType, '_id' | 'seen' | 'hide'>) {
      const notificationWithData: NotificationType = { ...notification, _id: v4(), seen: false, hide: false }
      this.notifications = [...this.notifications, notificationWithData]
    },
    setHide(id: string, isHide: boolean) {
      this.notifications = this.notifications.map((notification) =>
        notification._id === id ? { ...notification, hide: isHide } : notification
      )
    },
    setSeen(id: string, isSeen: boolean) {
      this.notifications = this.notifications.map((notification) =>
        notification._id === id ? { ...notification, seen: isSeen } : notification
      )
    },
  },
  getters: {
    getNotHide(state) {
      return state.notifications.filter((notification) => !notification.hide)
    },
  },
})
