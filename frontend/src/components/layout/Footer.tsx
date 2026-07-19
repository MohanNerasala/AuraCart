import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-charcoal">
                Aura<span className="text-accent">Cart</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium tech & lifestyle products. Designed for the modern minimalist.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-4">Shop</h4>
            <ul className="space-y-3">
              {['Audio', 'Wearables', 'Footwear', 'Bags', 'Desk Accessories'].map((item) => (
                <li key={item}>
                  <Link to={`/products?category=${item.toLowerCase()}`} className="text-sm text-gray-500 hover:text-charcoal transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Careers', 'Press', 'Sustainability'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 hover:text-charcoal transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-4">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'Returns', 'Shipping', 'Contact'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 hover:text-charcoal transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2026 AuraCart. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <span key={item} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
