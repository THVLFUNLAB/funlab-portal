import AdminDashboardClient from './DashboardClient'

export const metadata = {
  title: 'Admin Operations Center | Funlab',
}

export default function AdminDashboardPage() {
  // Giao diện gọi thẳng Client Component. Việc check Auth Clearance đã có `middleware.ts` làm lính canh gác vòng ngoài.
  return <AdminDashboardClient />
}
