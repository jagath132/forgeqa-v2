'use client';

import React, { useState } from 'react';
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight
} from 'lucide-react';

export const PricingPageV2: React.FC = () => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Free (Solo)',
      price: currency === 'INR' ? '₹0' : '$0',
      period: '/month',
      desc: 'For individual QA testers learning and validating test automation.',
      features: [
        '1 User',
        '500 Test Cases',
        '50 AI Runs / month',
        'Basic API Testing Client',
        'Basic Bug Tracking',
        '100 MB Automation Storage',
        'Community Support'
      ],
      cta: 'Current Plan',
      highlighted: false
    },
    {
      name: 'Pro Tester',
      price: currency === 'INR' ? (annual ? '₹1,039' : '₹1,299') : (annual ? '$15' : '$19'),
      period: '/month',
      desc: 'For professional QA engineers replacing Postman, Jira, and TestRail.',
      features: [
        '1 User',
        '10,000 Test Cases',
        '1,000 AI Runs / month',
        'Full REST/GraphQL/WebSocket API Client',
        'Kanban Bug Tracker + AI RCA',
        '5 GB Cloud Automation Storage',
        'Performance & k6 Load Testing',
        '100 min/mo Cross-Browser Testing',
        'GitHub Actions Integration',
        'Priority Email Support'
      ],
      cta: 'Upgrade to Pro',
      highlighted: true
    },
    {
      name: 'QA Team',
      price: currency === 'INR' ? (annual ? '₹2,799' : '₹3,499') : (annual ? '$39' : '$49'),
      period: '/month',
      desc: 'Complete all-in-one suite for engineering teams (up to 10 testers).',
      features: [
        'Up to 10 Users included',
        'Unlimited Test Cases',
        '5,000 AI Runs / month',
        'OWASP Security Scanner',
        '50 GB Cloud Automation Storage',
        '1,000 min/mo Cross-Browser Testing',
        'All CI/CD Integrations (GitHub, GitLab, Jenkins)',
        'Slack & Teams Alert Dispatcher',
        'Traceability Matrix & PRD Parser',
        'Dedicated Chat Support'
      ],
      cta: 'Start 14-Day Team Trial',
      highlighted: false
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'Dedicated cloud or on-premise installation for high-scale QA orgs.',
      features: [
        'Unlimited Users',
        'Unlimited AI Runs & Storage',
        'Single Sign-On (SAML / Okta)',
        'Private Cloud / On-Premise Runner',
        'SOC 2 Type II & VAPT Reports',
        'Custom Webhooks & SLA (99.99%)',
        'Dedicated Solutions Architect'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16 pt-4">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          ONE SUBSCRIPTION. EVERY TESTING TOOL.
        </span>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Replace 8+ Fragmented QA Tools & Save 80%+
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Stop paying separate bills for TestRail, Jira, Postman, BrowserStack, and JMeter.
          One predictable plan for your entire QA department.
        </p>

        {/* Currency & Annual Toggle */}
        <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#171B24] border border-white/8">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-lg transition ${currency === 'INR' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400'}`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg transition ${currency === 'USD' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400'}`}
            >
              USD ($)
            </button>
          </div>

          <button
            onClick={() => setAnnual(!annual)}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <span className={`w-4 h-4 rounded-full border ${annual ? 'bg-amber-500 border-amber-500' : 'border-gray-500'}`} />
            <span>Annual Billing <strong className="text-teal-400 font-mono">(20% OFF / 2 Mos Free)</strong></span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
              p.highlighted
                ? 'bg-[#171B24] border-2 border-amber-500 shadow-2xl shadow-amber-500/20 scale-[1.02]'
                : 'bg-[#11141B] border border-white/8 hover:border-white/15'
            }`}
          >
            {p.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] tracking-wider uppercase font-mono shadow-md">
                MOST POPULAR
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">{p.name}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed min-h-[36px]">{p.desc}</p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-extrabold font-mono text-white">{p.price}</span>
                <span className="text-xs text-gray-400 font-mono">{p.period}</span>
              </div>

              <div className="pt-4 border-t border-white/8 space-y-2.5 text-xs">
                {p.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-gray-300 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition shadow-md ${
                  p.highlighted
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {p.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};