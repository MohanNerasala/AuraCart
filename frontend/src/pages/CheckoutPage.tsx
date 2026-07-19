import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', notes: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setOrderPlaced(true);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center page-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-charcoal mb-3">Order Confirmed!</h1>
          <p className="text-sm text-gray-500 mb-8">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/orders" className="btn-premium btn-primary text-sm">View Orders</Link>
            <Link to="/products" className="btn-premium btn-secondary text-sm">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="page-container py-8 md:py-12 max-w-4xl mx-auto">
        {/* Back */}
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-charcoal tracking-tight mb-8">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i <= step ? 'bg-charcoal text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                i <= step ? 'text-charcoal' : 'text-gray-400'
              }`}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px ${i < step ? 'bg-charcoal' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                    <Truck size={20} /> Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Full Name</label>
                      <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-charcoal transition-colors" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Email</label>
                      <input name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-charcoal transition-colors" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-charcoal transition-colors" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Shipping Address</label>
                    <input name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-charcoal transition-colors" placeholder="123 Main Street, Apt 4B" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">City</label>
                      <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-charcoal transition-colors" placeholder="New York" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">State</label>
                      <input name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-charcoal transition-colors" placeholder="NY" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">ZIP</label>
                      <input name="zip" value={form.zip} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-charcoal transition-colors" placeholder="10001" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Order Notes (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-charcoal transition-colors resize-none" placeholder="Special instructions..." />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                    <CreditCard size={20} /> Payment Method
                  </h2>
                  <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                    <Lock size={32} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-charcoal mb-1">Secure Payment</p>
                    <p className="text-xs text-gray-400 mb-6">Payment integration placeholder. In production, Stripe or PayPal would be integrated here.</p>
                    <div className="flex gap-3 justify-center">
                      {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((m) => (
                        <div key={m} className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-xs font-medium text-gray-500">{m}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                    <CheckCircle size={20} /> Confirm Order
                  </h2>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium text-charcoal">{form.fullName || '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-charcoal">{form.email || '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Address</span>
                      <span className="font-medium text-charcoal text-right">{form.address}, {form.city}, {form.state} {form.zip}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Payment</span>
                      <span className="font-medium text-charcoal">Visa ****4242</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="btn-premium btn-secondary text-sm px-6">
                    <ArrowLeft size={16} /> Back
                  </button>
                )}
                <button onClick={handleSubmit} className="btn-premium btn-primary text-sm px-8 flex-1 justify-center">
                  {step === 2 ? 'Place Order' : 'Continue'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-off-white rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-charcoal mb-4">Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-charcoal">₹0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-charcoal">Total</span>
                    <span className="text-xl font-bold text-charcoal">₹0.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
