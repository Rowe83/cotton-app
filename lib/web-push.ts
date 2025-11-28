import { createPushSubscription, deletePushSubscriptionByEndpoint, checkPushSubscriptionExists } from './push-subscriptions'
import { getCurrentUser } from './auth'

// VAPID keys - these should be set in environment variables
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''

// Register service worker for push notifications
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js')
    return registration
  }
  throw new Error('Service Worker not supported')
}

// Subscribe to push notifications
export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  try {
    const registration = await registerServiceWorker()

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })

    return subscription
  } catch (error) {
    console.error('Error subscribing to push notifications:', error)
    return null
  }
}

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async (): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
      }
    }
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error)
  }
}

// Save push subscription to database
export const savePushSubscription = async (subscription: PushSubscription): Promise<void> => {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const subscriptionData = {
    user_id: user.id,
    endpoint: subscription.endpoint,
    p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
    auth: arrayBufferToBase64(subscription.getKey('auth')!),
  }

  // Check if subscription already exists
  const exists = await checkPushSubscriptionExists(subscription.endpoint)
  if (!exists) {
    await createPushSubscription(subscriptionData)
  }
}

// Remove push subscription from database
export const removePushSubscription = async (endpoint: string): Promise<void> => {
  await deletePushSubscriptionByEndpoint(endpoint)
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Utility function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
