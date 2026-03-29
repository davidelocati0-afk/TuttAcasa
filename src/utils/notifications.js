export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result;
}

export function sendLocalNotification(title, body, tag) {
  if (Notification.permission !== 'granted') return;
  const lastKey = `notif-${tag}`;
  const lastSent = localStorage.getItem(lastKey);
  const today = new Date().toDateString();
  if (lastSent === today) return;

  new Notification(title, {
    body,
    icon: '/icons/icon-192.png',
    tag,
    vibrate: [200, 100, 200],
  });
  localStorage.setItem(lastKey, today);
}

export async function registerPushSubscription(supabase, userId, householdId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    const registration = await navigator.serviceWorker.ready;
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidKey) return null;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    });

    await supabase.from('push_subscriptions').upsert({
      user_id: userId,
      household_id: householdId,
      subscription: subscription.toJSON(),
      device_name: navigator.userAgent.substring(0, 100),
    });

    return subscription;
  } catch (err) {
    console.error('Push subscription failed:', err);
    return null;
  }
}
