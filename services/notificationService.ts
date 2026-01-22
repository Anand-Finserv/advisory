/**
 * Service to handle browser Push Notifications for Anand Finserv
 */

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notifications');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const defaultOptions: NotificationOptions = {
    icon: 'https://cdn-icons-png.flaticon.com/512/2534/2534015.png', // Generic trading icon
    badge: 'https://cdn-icons-png.flaticon.com/512/2534/2534015.png',
    silent: false,
    ...options
  };

  try {
    return new Notification(title, defaultOptions);
  } catch (e) {
    console.error('Failed to show notification', e);
  }
};

export const notifyNewSignal = (symbol: string, type: string, entry: number) => {
  showNotification(`🚨 New Signal: ${symbol}`, {
    body: `${type} @ ₹${entry}. Tap to view research analysis and targets.`,
    tag: 'new-signal'
  });
};

export const notifyBreakingNews = (headline: string) => {
  showNotification('📰 Market Breaking News', {
    body: headline,
    tag: 'breaking-news'
  });
};
