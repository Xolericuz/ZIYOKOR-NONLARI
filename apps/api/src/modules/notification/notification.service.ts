import { Injectable } from '@nestjs/common';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}

const notifications: Notification[] = [];

@Injectable()
export class NotificationService {
  create(dto: {
    userId: string;
    title: string;
    message: string;
    type: string;
  }): Notification {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: dto.userId,
      title: dto.title,
      message: dto.message,
      type: dto.type,
      read: false,
      createdAt: new Date(),
    };
    notifications.push(notification);
    return notification;
  }

  findByUser(userId: string): Notification[] {
    return notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
