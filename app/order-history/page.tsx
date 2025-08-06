import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase';
import { fetchUserOrders, Order } from '@/actions/orders';
import CustomerOrderList from '@/components/CustomerOrderList';

export default async function OrderHistoryPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login'); // Redirect to login if not authenticated
  }

  const userId = session.user.id;
  const orders: Order[] = await fetchUserOrders(userId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 font-sarabun">ประวัติคำสั่งซื้อของคุณ</h1>
        <CustomerOrderList orders={orders} />
      </div>
    </div>
  );
}
