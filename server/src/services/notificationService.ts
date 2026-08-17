import { Notification } from '../models/OtherModels';

export const notificationService = {
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'BOOKING_UPDATE' | 'PAYMENT_RECEIPT' | 'VERIFICATION' | 'SYSTEM',
    linkUrl?: string
  ) {
    try {
      const notification = await Notification.create({
        user: userId,
        title,
        message,
        type,
        linkUrl,
      });
      return notification;
    } catch (error) {
      console.warn('[NotificationService] Failed to record notification:', error);
      return null;
    }
  },
};
