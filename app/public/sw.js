// Service worker MyDoctorIA — gestion des notifications push
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'MyDoctorIA', {
      body: data.body || 'Vous avez un rappel médical.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: { url: data.url || '/rappels' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/rappels'
  event.waitUntil(clients.openWindow(url))
})
