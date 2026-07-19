import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock } from 'lucide-react';
// import { Link } from 'react-router-dom';

const MOCK_ORDERS = [
  {
    id: 'ORD-001', status: 'DELIVERED', totalAmount: 748.00, createdAt: '2026-07-15',
    items: [{ productName: 'AuraWatch Ultra', productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', quantity: 1, unitPrice: 749 }],
  },
  {
    id: 'ORD-002', status: 'SHIPPED', totalAmount: 499.00, createdAt: '2026-07-12',
    items: [{ productName: 'AuraSound Pro Max', productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', quantity: 1, unitPrice: 499 }],
  },
  {
    id: 'ORD-003', status: 'PENDING', totalAmount: 398.00, createdAt: '2026-07-10',
    items: [
      { productName: 'AuraKey Mechanical', productImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200', quantity: 1, unitPrice: 179 },
      { productName: 'AuraPack Pro', productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200', quantity: 1, unitPrice: 219 },
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="page-container py-8 md:py-12 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight mb-2">My Orders</h1>
          <p className="text-sm text-gray-400 mb-8">Track and manage your orders</p>
        </motion.div>

        <div className="space-y-4">
          {MOCK_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    <Package size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{order.id}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {order.createdAt}
                    </p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">{item.productName}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-charcoal">Total: ₹{order.totalAmount.toFixed(2)}</p>
                <button className="text-xs font-semibold text-accent flex items-center gap-1 hover:underline">
                  View Details <ChevronRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
