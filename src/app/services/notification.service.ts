import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
    const notification: Notification = {
      id: `notification-${Date.now()}`,
      message,
      type,
      timestamp: new Date()
    };

    this.notifications.update(notifications => [...notifications, notification]);

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      this.remove(notification.id);
    }, 3000);
  }

  remove(id: string) {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  getNotifications() {
    return this.notifications.asReadonly();
  }
}