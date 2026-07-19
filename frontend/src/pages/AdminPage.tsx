import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, Users, TrendingUp, Edit, Trash2, Eye } from 'lucide-react';

const STATS = [
  { label: 'Total Revenue', value: '₹48,250', change: '+12.5%', icon: DollarSign, color: 'bg-green-50 text-green-600' },
  { label: 'Total Orders', value: '234', change: '+8.2%', icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
  { label: 'Total Products', value: '20', change: '+2', icon: Package, color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Active Users', value: '1,847', change: '+15.3%', icon: Users, color: 'bg-purple-50 text-purple-600' },
];

const RECENT_ORDERS = [
  { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', total: 749, status: 'DELIVERED', date: '2026-07-15' },
  { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', total: 499, status: 'SHIPPED', date: '2026-07-14' },
  { id: 'ORD-003', customer: 'Mike Johnson', email: 'mike@example.com', total: 398, status: 'PENDING', date: '2026-07-13' },
  { id: 'ORD-004', customer: 'Emily Davis', email: 'emily@example.com', total: 279, status: 'CONFIRMED', date: '2026-07-12' },
  { id: 'ORD-005', customer: 'Alex Wilson', email: 'alex@example.com', total: 199, status: 'CANCELLED', date: '2026-07-11' },
];

const PRODUCTS_LIST = [
  { name: 'AuraSound Pro Max', category: 'Audio', price: 549, stock: 50, status: 'Active' },
  { name: 'AuraWatch Ultra', category: 'Wearables', price: 799, stock: 40, status: 'Active' },
  { name: 'AuraStep Velocity', category: 'Footwear', price: 279, stock: 90, status: 'Active' },
  { name: 'AuraPack Pro', category: 'Bags', price: 249, stock: 65, status: 'Active' },
  { name: 'AuraKey Mechanical', category: 'Desk Accessories', price: 199, stock: 70, status: 'Active' },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
  Active: 'bg-green-50 text-green-700',
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  return (
    <div className="min-h-screen bg-off-white">
      <div className="page-container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-charcoal tracking-tight flex items-center gap-3">
            <LayoutDashboard size={28} /> Admin Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage your store, products, and orders</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 w-fit border border-gray-100">
          {(['overview', 'products', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-charcoal text-white'
                  : 'text-gray-500 hover:text-charcoal'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={18} />
                    </div>
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5">
                      <TrendingUp size={12} /> {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-charcoal">Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-semibold text-accent hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Order</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Customer</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Total</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ORDERS.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-charcoal">{order.id}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-charcoal">{order.customer}</p>
                          <p className="text-[11px] text-gray-400">{order.email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-charcoal">₹{order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-charcoal">All Products</h2>
              <button className="btn-premium btn-primary text-xs py-2 px-4">+ Add Product</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Product</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Category</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Price</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Stock</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS_LIST.map((product) => (
                    <tr key={product.name} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-charcoal">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-charcoal">₹{product.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[product.status]}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Eye size={14} className="text-gray-400" /></button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit size={14} className="text-gray-400" /></button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} className="text-red-400" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-charcoal">All Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Order</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Customer</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Total</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Date</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-charcoal">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-charcoal">₹{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <select className="text-[11px] font-bold px-2 py-1 rounded-lg border border-gray-200 bg-white cursor-pointer focus:outline-none">
                          {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                            <option key={s} value={s} selected={s === order.status}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Eye size={14} className="text-gray-400" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
