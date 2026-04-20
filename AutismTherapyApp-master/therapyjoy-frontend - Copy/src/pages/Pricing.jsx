import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const RAZORPAY_PLAN_MAP = {
  starter: 'starter',
  pro: 'monthly',
  premium: 'yearly',
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Pricing() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthly: 9.99,
      yearly: 99,
      description: 'Perfect for getting started',
      cta: 'Get Started',
      features: [
        'Unlimited emotion games',
        '5 therapy videos per month',
        'Basic mood tracking',
        'Mobile app access',
        'Community support',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      monthly: 24.99,
      yearly: 249,
      description: 'For serious wellness pursuit',
      cta: 'Start Pro',
      featured: true,
      features: [
        'Everything in Starter',
        'Unlimited therapy videos',
        'Advanced analytics',
        'Weekly therapist chat',
        'Personalized exercises',
        'Ad-free experience',
        'Priority support',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      monthly: 49.99,
      yearly: 499,
      description: 'Complete care experience',
      cta: 'Go Premium',
      features: [
        'Everything in Professional',
        ' 1-on-1 therapy sessions',
        'Nutrition guidance',
        'Sleep optimization',
        'Stress management coaching',
        'Family plan (up to 5)',
        '24/7 crisis support',
        'White-glove onboarding',
      ],
    },
  ];

  const handleSubscribe = async (planId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setPaymentMessage('');

    try {
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady) {
        throw new Error('Razorpay checkout failed to load.');
      }

      const backendPlanId = RAZORPAY_PLAN_MAP[planId] || 'starter';
      const order = await api.createOrder({ planId: backendPlanId });
      const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;

      if (!razorpayKeyId) {
        throw new Error('Missing REACT_APP_RAZORPAY_KEY_ID in the frontend environment.');
      }

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'TherapyJoy',
        description: `${planId} plan subscription`,
        order_id: order.orderId,
        prefill: {
          email: currentUser.email || '',
        },
        theme: {
          color: '#6C63FF',
        },
        handler: async function handleSuccess(response) {
          await api.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId: backendPlanId,
          });
          setPaymentMessage('Payment completed and verified successfully.');
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay checkout failed:', error);
      setPaymentMessage(error?.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header */}
      <motion.section style={{ textAlign: 'center', marginBottom: 48 }} variants={itemVariants}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, marginBottom: 12 }}>
          Simple, Transparent <span style={{ backgroundImage: 'linear-gradient(135deg, #6c63ff, #38bdf8)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pricing</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: 'rgba(15, 23, 42, 0.7)', marginBottom: 28, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Choose the perfect plan for your mental wellness journey. All plans include a 7-day free trial.
        </p>

        {/* Billing Toggle */}
        <motion.div variants={itemVariants} style={{ display: 'inline-flex', gap: 4, padding: '6px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(79, 70, 229, 0.15)', marginBottom: 36 }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: billingCycle === 'monthly' ? 'linear-gradient(135deg, #6c63ff, #7c3aed)' : 'transparent',
              color: billingCycle === 'monthly' ? 'white' : 'rgba(15, 23, 42, 0.7)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: '0.3s ease',
              fontSize: '14px',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: billingCycle === 'yearly' ? 'linear-gradient(135deg, #6c63ff, #7c3aed)' : 'transparent',
              color: billingCycle === 'yearly' ? 'white' : 'rgba(15, 23, 42, 0.7)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: '0.3s ease',
              fontSize: '14px',
            }}
          >
            Yearly <span style={{ marginLeft: 6, background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', padding: '2px 8px', borderRadius: '6px', fontSize: '12px' }}>Save 17%</span>
          </button>
        </motion.div>
      </motion.section>

      {paymentMessage ? (
        <div
          style={{
            marginBottom: 20,
            padding: '14px 16px',
            borderRadius: 16,
            background: 'rgba(108, 99, 255, 0.08)',
            border: '1px solid rgba(108, 99, 255, 0.18)',
            color: '#2E2768',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {paymentMessage}
        </div>
      ) : null}

      {/* Pricing Cards */}
      <motion.div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          marginBottom: 48,
        }}
        variants={containerVariants}
      >
        {plans.map((plan, i) => (
          <motion.div key={plan.id} variants={itemVariants}>
            <div className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              {plan.featured && <div className="pricing-badge">Recommended</div>}

              <div className="pricing-header">
                <div className="pricing-name">{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span className="pricing-amount">
                    ${billingCycle === 'monthly' ? plan.monthly : (plan.yearly / 12).toFixed(2)}
                  </span>
                  <span className="pricing-amount" style={{ fontSize: 14 }}>
                    /{billingCycle === 'monthly' ? 'month' : 'month*'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                    *Billed ${plan.yearly}/year
                  </div>
                )}
                <div className="pricing-description">{plan.description}</div>
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="pricing-feature">
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`pricing-cta ${plan.featured ? 'btn-primary' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Opening Checkout...' : currentUser ? plan.cta : 'Sign in to Subscribe'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <motion.section variants={itemVariants} style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, marginBottom: 32, textAlign: 'center' }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {[
            {
              q: 'Can I change my plan anytime?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.',
            },
            {
              q: 'Do you offer refunds?',
              a: 'We offer a 30-day money-back guarantee. If you are not satisfied, we will refund your subscription.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, debit cards, and digital wallets through our secure Razorpay integration.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes! All plans come with a 7-day free trial. No credit card required to start.',
            },
            {
              q: 'Do you offer student discounts?',
              a: 'Yes! Students get 50% off any plan with a valid student ID. Contact support@therapyjoy.com for details.',
            },
            {
              q: 'Can I share my account?',
              a: 'Our family plans support up to 5 members. Personal plans are for single-user accounts.',
            },
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              style={{
                padding: 20,
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(15, 23, 42, 0.10)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 8, color: '#1E1B4B' }}>
                {faq.q}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(15, 23, 42, 0.7)', lineHeight: 1.6 }}>
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        style={{ marginTop: 60 }}
        variants={itemVariants}
      >
        <h2 className="cta-title">Ready to transform your mental health?</h2>
        <p className="cta-subtitle">Join thousands of users who've found peace and clarity with TherapyJoy</p>
        <div className="cta-actions">
          <Button
            text="Start Free Trial"
            icon="play"
            onClick={() => navigate(currentUser ? '/game' : '/login')}
            variant="primary"
          />
          <Button
            text="Contact Sales"
            icon="doctor"
            onClick={() => {
              // Open email client or support page
              window.open('mailto:sales@therapyjoy.com');
            }}
            variant="ghost"
          />
        </div>
      </motion.section>
    </motion.div>
  );
}
