/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowLeft,
  Languages,
  BarChart3,
  PenTool,
  ShieldCheck,
  Calendar,
  Mic,
  Wallet,
  User,
  Layers,
  RefreshCcw,
  FileText,
  Download,
  PauseCircle,
  PlayCircle,
  Zap,
  Lock,
  Key,
  Info,
  Terminal,
  Save,
  MessageSquare,
  X,
  CreditCard,
  Bitcoin,
  CheckCircle2,
  HelpCircle,
  Clock,
  Gift,
  Cloud,
  Building,
  Code,
  Globe,
  Twitter,
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AGENTS, PLANS, SKILLS } from './constants';
import { Agent, Plan, Skill } from './types';

const IconMap: Record<string, React.ElementType> = {
  Languages,
  BarChart3,
  PenTool,
  ShieldCheck,
  Calendar,
  Mic
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'agents'>('store');
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('advance');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'selection' | 'processing' | 'success'>('selection');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [orderBumps, setOrderBumps] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<string>("23:59:59");

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      
      const difference = midnight.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      } else {
        setTimeLeft("00:00:00");
      }
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const pricingRef = React.useRef<HTMLDivElement>(null);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Sub-menu states for Agent Management
  const [activeSubMenu, setActiveSubMenu] = useState<Record<string, 'vps' | null>>({});

  const toggleSkill = (id: string, index: number) => {
    const planLimits: Record<string, number> = {
      basic: 3,
      advance: 5,
      pro: 6
    };
    const limit = planLimits[selectedPlan] || 3;

    // Check if skill is allowed based on plan
    if (selectedPlan === 'basic' && index >= 3) return;
    if (selectedPlan === 'advance' && index >= 5) return;

    setSelectedSkills(prev => {
      if (prev.includes(id)) {
        return prev.filter(s => s !== id);
      }
      if (prev.length >= limit) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const basePrice = PLANS.find(p => p.id === selectedPlan)?.price || 0;
  const bumpPrice = (selectedPlan === 'advance' && orderBumps['advance']) ? 50 : (selectedPlan === 'pro' && orderBumps['pro']) ? 90 : 0;
  const totalPrice = basePrice + bumpPrice;

  // Reset skills if plan changes and exceeds limit or violates index restriction
  React.useEffect(() => {
    const planLimits: Record<string, number> = {
      basic: 3,
      advance: 5,
      pro: 6
    };
    const limit = planLimits[selectedPlan] || 3;
    
    setSelectedSkills(prev => {
      let filtered = prev;
      if (selectedPlan === 'basic') {
        filtered = filtered.filter(id => SKILLS.findIndex(s => s.id === id) < 3);
      } else if (selectedPlan === 'advance') {
        filtered = filtered.filter(id => SKILLS.findIndex(s => s.id === id) < 5);
      }
      
      if (filtered.length > limit) {
        return filtered.slice(0, limit);
      }
      return filtered;
    });
  }, [selectedPlan]);

  // Helper component to handle payment simulation without breaking hooks
  const PaymentProcessor = ({ step, setStep }: { step: string, setStep: (s: any) => void }) => {
    React.useEffect(() => {
      if (step === 'processing') {
        const timer = setTimeout(() => setStep('success'), 2000);
        return () => clearTimeout(timer);
      }
    }, [step, setStep]);
    return null;
  };

  const renderStore = () => (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Flash Sale Banner */}
      <div className="sticky top-0 z-[60] bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-4 text-center shadow-lg">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Zap size={14} className="fill-white" />
            FLASH SALE: Get up to $1000 Free API Credits when you deploy today!
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase opacity-80">Offer ends in:</span>
            <span className="font-mono font-black text-sm bg-black/20 px-2 py-0.5 rounded">{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Store Header */}
      <header className="hidden md:flex bg-white border-b border-outline px-4 py-4 items-center justify-between sticky top-[40px] sm:top-[32px] z-50">
        <div className="flex items-center gap-2">
          <div className="bg-black p-1.5">
            <Layers className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-bold tracking-tight uppercase">Super Agent Store</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('store')}
            className={`${activeTab === 'store' ? 'text-primary' : 'text-slate-500'} hover:text-primary transition-colors`}
          >
            Store
          </button>
          <button 
            onClick={() => setActiveTab('agents')}
            className={`${activeTab === 'agents' ? 'text-primary' : 'text-slate-500'} hover:text-primary transition-colors`}
          >
            My Agents
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="bg-black text-white px-4 py-2 flex items-center gap-2 hover:bg-slate-800 transition-colors text-xs font-bold">
            <Wallet size={14} />
            Connect Wallet
          </button>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="bg-black text-white py-12 md:py-16 px-4 md:px-8 border-b-4 border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Zap size={300} />
          </div>
          <div className="max-w-7xl mx-auto w-full relative z-10 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tighter uppercase">
                Deploy OpenClaw Agent <br />
                <span className="text-primary">in 60 Seconds</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl font-medium">
                Zero coding required. No Docker setup. No terminal headaches. 
                One-click deployment for your autonomous AI workforce.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={scrollToPricing}
                  className="bg-primary text-white px-10 py-5 font-black text-xl hover:bg-orange-600 transition-all brutalist-shadow active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tight"
                >
                  View Pricing
                </button>
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="bg-white text-black px-10 py-5 font-black text-xl hover:bg-slate-100 transition-all brutalist-shadow active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tight"
                >
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-12 md:py-16 px-4 md:px-8 bg-white border-b border-outline">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">THE UNFAIR ADVANTAGE</h3>
              <div className="h-2 w-24 bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-black brutalist-shadow mb-8 rounded-3xl overflow-hidden">
              {/* Manual Setup */}
              <div className="p-10 border-b md:border-b-0 md:border-r-4 border-black bg-slate-50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-red-500 p-2 text-white">
                    <X size={24} />
                  </div>
                  <h4 className="text-2xl font-black uppercase">DIY SETUP</h4>
                </div>
                <ul className="space-y-6">
                  {[
                    'Hours of coding & Docker errors',
                    'Expensive, unoptimized VPS costs',
                    'Managing multiple API keys & limits',
                    'Zero UI, terminal management only'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <div className="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
                      <span className="font-bold text-sm uppercase tracking-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Our Platform */}
              <div className="p-10 bg-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-green-500 p-2 text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-2xl font-black uppercase">SUPER AGENT</h4>
                </div>
                <ul className="space-y-6">
                  {[
                    '60-second instant deployment',
                    'Pre-configured, auto-scaling infrastructure',
                    'Built-in Wholesale API (No limits)',
                    'Precision Brutalist Management UI'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-black">
                      <div className="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
                      <span className="font-black text-sm uppercase tracking-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4 USPs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white border-4 border-black brutalist-shadow rounded-2xl flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-black text-white w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cloud size={16} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tighter leading-tight">ENTERPRISE INFRASTRUCTURE</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Powered by Google Cloud VMs. We don't use cheap servers. Expect 99.9% uptime and maximum AI processing speed.
                </p>
              </div>
              
              <div className="p-4 bg-white border-4 border-black brutalist-shadow rounded-2xl flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-black text-white w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap size={16} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tighter leading-tight">BUILT-IN WHOLESALE API</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Backed by RouterKey.ai. Get dedicated API transmission lines. No credit cards needed for OpenAI/Claude. Just deploy and run.
                </p>
              </div>

              <div className="p-4 bg-white border-4 border-black brutalist-shadow rounded-2xl flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-black text-white w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Code size={16} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tighter leading-tight">ZERO-CODE AUTOMATION</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Skip the learning curve. Our agents are pre-packaged with skills. Select your modules and let the AI generate revenue while you sleep.
                </p>
              </div>

              <div className="p-4 bg-white border-4 border-black brutalist-shadow rounded-2xl flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-black text-white w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe size={16} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tighter leading-tight">GLOBAL BUSINESS SUPPORT</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Scaling fast? We assist our top-tier clients with Singapore/US entity incorporation for seamless global payments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section (Original UI) */}
        <section ref={pricingRef} className="py-12 md:py-16 px-4 md:px-8 bg-surface">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Select Your Plan</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest">Scale your AI workforce with ease</p>
            </div>

            {/* Step 1: Plans */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-black text-white w-8 h-8 flex items-center justify-center text-sm font-black">1</span>
                CHOOSE INFRASTRUCTURE
              </h3>
              
              <p className="text-center italic text-slate-500 text-sm mb-10 max-w-2xl mx-auto font-medium">
                "All plans include a pre-configured VPS + Built-in API Key. No OpenAI account or credit card required. Ready to run instantly."
              </p>

              <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-8 md:pb-0 hide-scrollbar">
                {PLANS.map((plan) => {
                  const isAdvance = plan.id === 'advance';
                  const isPro = plan.id === 'pro';
                  const isBasic = plan.id === 'basic';

                  let bonusTitle = "";
                  let bonusSub = "";
                  let bonusBg = "";
                  let bumpPrefix = "";
                  let bumpHighlight = "";
                  let bumpSuffix = "";
                  let bumpPriceVal = 0;
                  let bumpTitle = "";

                  if (isBasic) {
                    bonusTitle = "$90 API";
                    bonusSub = "($30 unlocked per active month)";
                    bonusBg = "bg-slate-50 border-slate-200";
                  } else if (isAdvance) {
                    bonusTitle = "$300 API";
                    bonusSub = "($100 unlocked per active month)";
                    bonusBg = "bg-orange-50 border-orange-200";
                    bumpTitle = "API BOOSTER";
                    bumpPrefix = "Get an ";
                    bumpHighlight = "EXTRA $300 API credit";
                    bumpSuffix = " INSTANTLY.";
                    bumpPriceVal = 50;
                  } else if (isPro) {
                    bonusTitle = "$1000 API";
                    bonusSub = "($200 unlocked per active month)";
                    bonusBg = "bg-emerald-50 border-emerald-200";
                    bumpTitle = "WHALE BOOSTER";
                    bumpPrefix = "Get an ";
                    bumpHighlight = "EXTRA $1000 API credit";
                    bumpSuffix = " INSTANTLY.";
                    bumpPriceVal = 90;
                  }

                  return (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`min-w-[85vw] md:min-w-0 snap-center md:snap-align-none relative p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col min-h-[44px] ${
                        selectedPlan === plan.id 
                          ? 'border-primary bg-white shadow-2xl scale-105 z-10' 
                          : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-xl'
                      }`}
                    >
                      {isAdvance && (
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md z-10">
                          Most Popular
                        </span>
                      )}
                      <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter">{plan.name}</h4>
                      <div className="mb-6">
                        <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                        <span className="text-slate-500 font-bold text-sm">/mo</span>
                      </div>

                      {/* Redesigned Bonus Box */}
                      <div className={`mb-8 p-6 rounded-2xl border relative overflow-hidden ${bonusBg}`}>
                        <div className="relative z-10 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-500">
                            🎁 TOTAL BONUS
                          </p>
                          <p className={`text-4xl font-black tracking-tighter mb-1 ${isAdvance ? 'text-orange-600' : isPro ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {bonusTitle}
                          </p>
                          <p className="text-[10px] font-medium text-slate-500 italic">
                            {bonusSub}
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-4 mb-10 flex-1">
                        {plan.features.map((f, i) => (
                          <li key={i} className="text-sm font-medium text-slate-600 flex items-start gap-3">
                            <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Order Bump */}
                      {(isAdvance || isPro) && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOrderBumps(prev => ({ ...prev, [plan.id]: !prev[plan.id] }));
                          }}
                          className={`mb-6 p-4 rounded-xl border-2 border-dashed transition-all min-h-[44px] ${
                            orderBumps[plan.id] 
                              ? 'bg-primary/5 border-primary' 
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                              orderBumps[plan.id] ? 'bg-primary border-primary' : 'bg-white border-slate-300'
                            }`}>
                              {orderBumps[plan.id] && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                            <p className="text-[10px] font-bold leading-tight">
                              <span className="text-primary font-black">+${bumpPriceVal} {bumpTitle}:</span> {bumpPrefix}
                              <span className="text-primary font-black">{bumpHighlight}</span>
                              {bumpSuffix}
                            </p>
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan.id);
                          setIsLeadModalOpen(true);
                        }}
                        className={`w-full py-4 rounded-xl font-bold text-sm transition-all min-h-[44px] ${
                        selectedPlan === plan.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}>
                        {selectedPlan === plan.id ? 'SELECTED' : 'SELECT PLAN'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Enterprise Banner */}
              <div className="mt-16 w-full bg-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                {/* Subtle gradient overlay for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none" />
                
                {/* Left Content */}
                <div className="flex-1 relative z-10">
                  <h4 className="text-3xl md:text-4xl font-black text-yellow-400 uppercase tracking-tighter mb-2">
                    GLOBAL ENTERPRISE
                  </h4>
                  <p className="text-slate-300 font-medium mb-6 text-sm md:text-base">
                    Dedicated AI infrastructure for scaling businesses.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-white font-medium text-sm">
                      <Cloud size={18} className="text-yellow-400" />
                      Up to 200GB RAM (Google Cloud VM)
                    </li>
                    <li className="flex items-center gap-3 text-white font-medium text-sm">
                      <Zap size={18} className="text-yellow-400" />
                      Dedicated API Line (99.9% SLA)
                    </li>
                    <li className="flex items-center gap-3 text-white font-medium text-sm">
                      <Building size={18} className="text-yellow-400" />
                      25% Off for Singapore/US Startups
                    </li>
                  </ul>
                </div>

                {/* Right Content */}
                <div className="flex-shrink-0 text-center md:text-right flex flex-col items-center md:items-end w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-700 pt-8 md:pt-0 md:pl-12 relative z-10">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">
                    Custom solutions starting at
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">$4,990</span>
                    <span className="text-slate-400 font-bold text-sm ml-1">/mo</span>
                  </div>
                  <button className="w-full md:w-auto bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40">
                    Book Strategy Call
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Skills */}
            <div className="mb-20">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <span className="bg-black text-white w-8 h-8 flex items-center justify-center text-sm font-black">2</span>
                ADD AGENT SKILLS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SKILLS.map((skill, index) => {
                  const Icon = IconMap[skill.icon];
                  const isSelected = selectedSkills.includes(skill.id);
                  
                  let isDisabled = false;
                  if (selectedPlan === 'basic' && index >= 3) isDisabled = true;
                  if (selectedPlan === 'advance' && index >= 5) isDisabled = true;

                  return (
                    <div 
                      key={skill.id}
                      onClick={() => !isDisabled && toggleSkill(skill.id, index)}
                      className={`p-5 border-4 flex items-center justify-between transition-all ${
                        isDisabled 
                          ? 'opacity-30 cursor-not-allowed border-outline bg-slate-100 grayscale' 
                          : isSelected 
                            ? 'border-primary bg-white brutalist-shadow -translate-x-1 -translate-y-1 cursor-pointer' 
                            : 'border-black bg-white hover:border-primary cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 border-2 border-black ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight leading-none">{skill.name}</p>
                        </div>
                      </div>
                      {!isDisabled && (
                        <div className={`w-6 h-6 border-2 border-black flex items-center justify-center ${isSelected ? 'bg-primary' : 'bg-white'}`}>
                          {isSelected && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 px-4 md:px-8 bg-white border-t border-black">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Frequently Asked Questions</h3>
              <div className="h-2 w-24 bg-primary mx-auto"></div>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Do I need my own OpenAI/Claude API keys?",
                  a: "No! All plans come with built-in API access (Powered by RouterKey.ai) and massive Bonus Credits. You don't need an OpenAI account or an international credit card. However, if you prefer to use your own API keys (Bring-Your-Own-Key), our advanced dashboard fully supports it."
                },
                {
                  q: "I don't know how to code. Can I still use this?",
                  a: "Absolutely! Super Agent is a 100% Zero-Code platform. We handle the complex VPS provisioning and Docker setups in the background. You manage your AI workforce through a clean, intuitive web dashboard—just like using a social media app."
                },
                {
                  q: "What happens when my Bonus API Credit runs out?",
                  a: "You can easily top-up your balance directly inside your dashboard at wholesale rates. We use a transparent Pay-As-You-Go model. Your agents will simply pause if you run out of credits, and we will NEVER auto-charge your credit card without your permission."
                },
                {
                  q: "Is my data and campaign strategy secure?",
                  a: "100% Secure. Each AI Agent runs on a dedicated, isolated Google Cloud Virtual Machine. We do not share resources, and your data is protected with 256-bit encryption. Your prompts and strategies remain strictly yours."
                }
              ].map((faq, i) => (
                <div key={i} className="border-4 border-black brutalist-shadow bg-white rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-lg font-black uppercase tracking-tight">{faq.q}</span>
                    <ChevronRight className={`transition-transform duration-300 ${openFaqIndex === i ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t-2 border-black"
                      >
                        <div className="p-6 text-slate-600 font-medium">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Checkout Bar */}
      <footer className="fixed bottom-[72px] md:bottom-0 left-0 right-0 glass-nav p-4 z-40 border-t-4 border-black bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Total Amount</p>
            <p className="text-3xl font-black tracking-tighter">${totalPrice}/mo</p>
          </div>
          <button 
            onClick={() => setIsLeadModalOpen(true)}
            className="bg-black text-white px-8 md:px-12 py-4 md:py-5 font-black text-lg md:text-xl hover:bg-slate-800 transition-all brutalist-shadow active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tight min-h-[44px]"
          >
            BUY NOW
          </button>
        </div>
      </footer>
    </div>
  );

  const renderAgents = () => (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="hidden md:flex bg-white border-b border-outline px-4 md:px-8 py-4 items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-black p-1.5">
            <Layers className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-bold tracking-tight uppercase">Super Agent Management</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => setActiveTab('store')} className="text-slate-500 hover:text-primary transition-colors">Store</button>
          <button onClick={() => setActiveTab('agents')} className="text-primary hover:text-primary transition-colors">My Agents</button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-surface-container-low transition-colors">
            <User size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 pb-24">
        {/* Tutorial Section */}
        <section className="mb-10 bg-black text-white p-6 brutalist-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <HelpCircle size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
              <Zap className="text-primary" size={20} />
              Setup Guide & Tutorial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <span className="w-5 h-5 border border-primary flex items-center justify-center">1</span>
                  IDENTITY
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Fill in your <span className="text-white">Telegram Owner ID</span> and <span className="text-white">Bot Token</span> in the Essential Configuration section.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <span className="w-5 h-5 border border-primary flex items-center justify-center">2</span>
                  BRAIN
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Select your preferred <span className="text-white">Neural Model</span> (GPT-4, Claude, etc.) to define the agent's intelligence level.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <span className="w-5 h-5 border border-primary flex items-center justify-center">3</span>
                  SECURITY
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Go to <span className="text-white">VPS Settings</span> and use <span className="text-white">Change Pass</span> to secure your virtual server environment.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <span className="w-5 h-5 border border-primary flex items-center justify-center">4</span>
                  ADVANCED
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Use <span className="text-white">Advanced Configuration</span> for fine-tuning API parameters like Temperature and Retries.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Active Agents</h2>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search agents..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-outline focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <button className="p-2 border border-outline bg-white hover:bg-surface-container-low transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {AGENTS.map((agent) => (
            <div 
              key={agent.id}
              className={`bg-white border border-outline transition-all ${expandedAgentId === agent.id ? 'brutalist-shadow' : ''}`}
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-3 md:w-32">
                  <div className={`w-2 h-2 rounded-full ${agent.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm font-medium text-slate-600">{agent.status}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold tracking-tight">{agent.name}</h3>
                </div>

                <div className="grid grid-cols-2 md:flex md:items-center gap-8 md:gap-12">
                  <div className="border-l border-outline pl-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Latency</p>
                    <p className="text-lg font-bold">{agent.latency}</p>
                  </div>
                  <div className="border-l border-outline pl-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Tokens Remaining</p>
                    <p className="text-lg font-bold">{agent.tokensRemaining}</p>
                  </div>
                  <div className="border-l border-outline pl-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">VPS Expiry</p>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className={agent.daysRemaining < 7 ? 'text-red-500' : 'text-green-500'} />
                      <p className={`text-lg font-bold ${agent.daysRemaining < 7 ? 'text-red-500' : 'text-black'}`}>
                        {agent.daysRemaining} Days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button 
                    onClick={() => setExpandedAgentId(expandedAgentId === agent.id ? null : agent.id)}
                    className={`px-6 py-2 text-sm font-bold border border-black transition-all ${
                      expandedAgentId === agent.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-surface-container-low'
                    }`}
                  >
                    {expandedAgentId === agent.id ? 'Close' : 'Manage'}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedAgentId === agent.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-outline bg-surface-container-low"
                  >
                    <div className="p-6 space-y-6">
                      {/* Performance Graphs */}
                      <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white border border-outline p-6">
                          <h4 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <BarChart3 size={14} className="text-primary" />
                            Token Consumption (k)
                          </h4>
                          <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={agent.performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '0px', color: '#fff' }}
                                  itemStyle={{ color: '#f97316' }}
                                />
                                <Line type="stepAfter" dataKey="tokens" stroke="#000" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Essential Configuration */}
                      <div className="bg-white border border-outline p-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                          <div className="flex-1 space-y-6">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={14} className="text-primary" />
                                Model Selection
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {['GPT-4', 'Claude 3', 'Gemini Pro', 'Llama 3'].map((model) => (
                                  <button 
                                    key={model}
                                    className={`px-4 py-2 text-xs font-bold border transition-all ${
                                      agent.model.includes(model) 
                                        ? 'bg-black text-white border-black' 
                                        : 'bg-white border-outline hover:border-slate-400'
                                    }`}
                                  >
                                    {model}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                  <Key size={10} />
                                  Bot Token
                                </label>
                                <input 
                                  type="text" 
                                  placeholder="712345678:AA..." 
                                  className="w-full px-3 py-2 border border-outline text-xs focus:border-primary outline-none font-mono" 
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                  <MessageSquare size={10} />
                                  Telegram Owner ID
                                </label>
                                <input 
                                  type="text" 
                                  placeholder="123456789" 
                                  className="w-full px-3 py-2 border border-outline text-xs focus:border-primary outline-none font-mono" 
                                />
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-1/3 border-l border-outline pl-0 lg:pl-8">
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Quick Actions</h4>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-outline text-[10px] font-bold uppercase hover:bg-surface-container-low transition-colors">
                                  <RefreshCcw size={12} />
                                  Reset
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-outline text-[10px] font-bold uppercase hover:bg-surface-container-low transition-colors">
                                  <FileText size={12} />
                                  Logs
                                </button>
                              </div>

                              {/* VPS Action */}
                              <div className="relative">
                                <button 
                                  onClick={() => setActiveSubMenu(prev => ({ ...prev, [agent.id]: activeSubMenu[agent.id] === 'vps' ? null : 'vps' }))}
                                  className={`w-full flex items-center justify-center gap-2 py-2 border transition-colors text-[10px] font-bold uppercase ${
                                    activeSubMenu[agent.id] === 'vps' ? 'bg-black text-white border-black' : 'border-outline hover:bg-surface-container-low'
                                  }`}
                                >
                                  <Lock size={12} />
                                  VPS Settings
                                </button>
                                <AnimatePresence>
                                  {activeSubMenu[agent.id] === 'vps' && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: -5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -5 }}
                                      className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-black p-1 grid grid-cols-2 gap-1 shadow-lg"
                                    >
                                      <button className="flex items-center justify-center gap-1 py-1.5 bg-surface-container-low hover:bg-slate-200 text-[9px] font-bold uppercase">
                                        <Info size={10} />
                                        Info VPS
                                      </button>
                                      <button className="flex items-center justify-center gap-1 py-1.5 bg-surface-container-low hover:bg-slate-200 text-[9px] font-bold uppercase">
                                        <RefreshCcw size={10} />
                                        Change Pass
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-outline flex flex-col md:flex-row items-center justify-end gap-2">
                          <button className="w-full md:w-auto bg-black text-white px-8 py-3 text-sm font-bold hover:bg-slate-800 transition-colors brutalist-shadow">
                            Top-up Tokens
                          </button>
                          <button 
                            onClick={() => setIsAdvancedModalOpen(true)}
                            className="w-full md:w-auto bg-white border border-black px-8 py-3 text-sm font-bold hover:bg-surface-container-low transition-colors"
                          >
                            Advanced Configuration
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* REWARDS & EARN SECTION */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-16 mb-24">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
            <Gift className="text-emerald-500" size={28} />
            Rewards & Earn
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quest Card 1 */}
            <div className="bg-white border-4 border-black rounded-2xl p-6 brutalist-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-500">
                  <Twitter size={24} className="text-blue-500" />
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-300">
                  $20 API Credit
                </span>
              </div>
              <h4 className="text-lg font-black uppercase tracking-tight mb-2">🐦 Connect X & Spread the Word</h4>
              <p className="text-sm text-slate-600 font-medium mb-6 flex-1">
                Change your X bio and tag our project. Credits are added to your balance and require an active VPS to use.
              </p>
              <button className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all brutalist-shadow active:translate-x-1 active:translate-y-1 active:shadow-none">
                Verify & Claim
              </button>
            </div>

            {/* Quest Card 2 */}
            <div className="bg-white border-4 border-black rounded-2xl p-6 brutalist-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center border-2 border-primary">
                  <Gift size={24} className="text-primary" />
                </div>
                <span className="bg-orange-100 text-primary text-[10px] font-black uppercase px-3 py-1 rounded-full border border-orange-300">
                  $15 Voucher
                </span>
              </div>
              <h4 className="text-lg font-black uppercase tracking-tight mb-2">🤝 Gift a Friend</h4>
              <p className="text-sm text-slate-600 font-medium mb-2">
                You've been active for 15 days! You earned a $15 Discount Voucher.
              </p>
              <p className="text-xs text-primary font-bold mb-6 flex-1 italic">
                Rule: You cannot use this code yourself. Give it to a friend for their first deployment!
              </p>
              <button className="w-full bg-white border-2 border-black text-black py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all brutalist-shadow active:translate-x-1 active:translate-y-1 active:shadow-none">
                Copy Gift Code
              </button>
            </div>

            {/* Quest Card 3 */}
            <div className="bg-white border-4 border-black rounded-2xl p-6 brutalist-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-500">
                  <Wallet size={24} className="text-emerald-600" />
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-300">
                  $10 Cash / User
                </span>
              </div>
              <h4 className="text-lg font-black uppercase tracking-tight mb-2">💸 Earn Unlimited Cash</h4>
              <p className="text-sm text-slate-600 font-medium mb-4 flex-1">
                Get $10 in withdrawable cash for every new user who signs up with your link and deploys an agent.
              </p>
              <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-3 mb-4 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 truncate mr-2">https://openclaw.ai/ref/user123</span>
              </div>
              <button className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all brutalist-shadow active:translate-x-1 active:translate-y-1 active:shadow-none">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <>
      {activeTab === 'store' ? renderStore() : activeTab === 'agents' ? renderAgents() : null}
      
      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 bg-white/90 backdrop-blur border-t border-outline h-[72px] md:hidden flex justify-around items-center px-2">
        <button 
          onClick={() => setActiveTab('store')}
          className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] ${activeTab === 'store' ? 'text-primary' : 'text-slate-500'}`}
        >
          <Layers size={24} />
          <span className="text-[10px] font-bold mt-1">Store</span>
        </button>
        <button 
          onClick={() => setActiveTab('agents')}
          className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] ${activeTab === 'agents' ? 'text-primary' : 'text-slate-500'}`}
        >
          <Zap size={24} />
          <span className="text-[10px] font-bold mt-1">My Agents</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center w-full h-full min-h-[44px] text-slate-500"
        >
          <User size={24} />
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>
      </nav>

      {/* Lead Capture Modal */}
      <AnimatePresence>
        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white border-4 border-black rounded-2xl p-8 brutalist-shadow overflow-hidden"
            >
              <button 
                onClick={() => setIsLeadModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              {(selectedPlan === 'advance' || selectedPlan === 'pro') ? (
                <>
                  <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
                  <div className="mb-6 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500">
                      <Gift size={32} className="text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-emerald-600">🎁 YOU UNLOCKED A $10 DISCOUNT!</h3>
                    <p className="text-sm text-slate-600 font-medium">
                      Enter your email to claim your voucher and receive your Agent setup instructions. This discount will be applied to your checkout instantly.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Enter your best email..." 
                      className="w-full p-4 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button 
                      onClick={() => {
                        setIsLeadModalOpen(false);
                        setIsPaymentModalOpen(true);
                      }}
                      className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black text-lg uppercase tracking-widest hover:bg-emerald-600 transition-all brutalist-shadow active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      Claim $10 & Checkout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
                  <div className="mb-6 text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                      <Zap size={32} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Almost there! 🚀</h3>
                    <p className="text-sm text-slate-600 font-medium">
                      Enter your email to receive your Agent setup instructions and management link.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Enter your best email..." 
                      className="w-full p-4 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button 
                      onClick={() => {
                        setIsLeadModalOpen(false);
                        setIsPaymentModalOpen(true);
                      }}
                      className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg uppercase tracking-widest hover:bg-orange-600 transition-all brutalist-shadow active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (paymentStep !== 'processing') setIsPaymentModalOpen(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white border-2 border-black p-8 brutalist-shadow"
            >
              {paymentStep === 'selection' && (
                <>
                  <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Checkout</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Select Payment Method</p>
                  
                  <div className="space-y-3 mb-8">
                    <button 
                      onClick={() => setPaymentStep('processing')}
                      className="w-full flex items-center justify-between p-4 border-2 border-outline hover:border-black transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} />
                        <span className="font-bold text-sm uppercase">Credit / Debit Card</span>
                      </div>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setPaymentStep('processing')}
                      className="w-full flex items-center justify-between p-4 border-2 border-outline hover:border-black transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Bitcoin size={20} />
                        <span className="font-bold text-sm uppercase">Crypto Wallet</span>
                      </div>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setPaymentStep('processing')}
                      className="w-full flex items-center justify-between p-4 border-2 border-outline hover:border-black transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Wallet size={20} />
                        <span className="font-bold text-sm uppercase">Apple / Google Pay</span>
                      </div>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="border-t border-outline pt-6 flex items-center justify-between">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Total Due</span>
                    <span className="text-xl font-bold">${totalPrice}</span>
                  </div>
                </>
              )}

              {paymentStep === 'processing' && (
                <div className="py-12 flex flex-col items-center text-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-6"
                  />
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Processing Payment</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Please do not close this window</p>
                  
                  {/* Simulate success after 2 seconds */}
                  <PaymentProcessor step={paymentStep} setStep={setPaymentStep} />
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-500 flex items-center justify-center text-white mb-6 brutalist-shadow">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Payment Successful!</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Your agent is being provisioned</p>
                  
                  <button 
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      setPaymentStep('selection');
                      setActiveTab('agents');
                    }}
                    className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors brutalist-shadow"
                  >
                    Go to Management
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advanced Configuration Modal */}
      <AnimatePresence>
        {isAdvancedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdvancedModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white border-2 border-black p-8 brutalist-shadow"
            >
              <button 
                onClick={() => setIsAdvancedModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-surface-container-low transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="bg-black p-2">
                  <Terminal className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Advanced Configuration</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">OpenClaw Engine Settings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">API Base URL</label>
                  <input type="text" defaultValue="https://api.openai.com/v1" className="w-full px-3 py-2 border border-outline text-sm focus:border-primary outline-none font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">API Key</label>
                  <input type="password" defaultValue="sk-••••••••••••••••" className="w-full px-3 py-2 border border-outline text-sm focus:border-primary outline-none font-mono" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">System Instruction</label>
                  <textarea 
                    rows={3}
                    defaultValue="You are a helpful AI agent designed to assist with complex tasks and data analysis." 
                    className="w-full px-3 py-2 border border-outline text-sm focus:border-primary outline-none font-mono resize-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Temperature</label>
                  <input type="number" defaultValue="0.7" step="0.1" className="w-full px-3 py-2 border border-outline text-sm focus:border-primary outline-none font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Max Retries</label>
                  <input type="number" defaultValue="3" className="w-full px-3 py-2 border border-outline text-sm focus:border-primary outline-none font-mono" />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsAdvancedModalOpen(false)}
                  className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  Save Configuration
                </button>
                <button 
                  onClick={() => setIsAdvancedModalOpen(false)}
                  className="px-8 border border-black font-bold uppercase tracking-widest hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Trust & Security Footer */}
      <div className="w-full bg-slate-900 border-t-4 border-black py-4 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-yellow-400 font-black text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
            POWERED BY INDUSTRY LEADERS & SECURED CHECKOUT
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <span className="flex items-center gap-1"><Cloud size={12} /> Google Cloud</span>
            <span className="flex items-center gap-1"><Zap size={12} /> OpenAI</span>
            <span className="flex items-center gap-1"><Code size={12} /> Anthropic</span>
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Stripe Verified</span>
            <span className="flex items-center gap-1"><Lock size={12} /> 256-bit SSL</span>
          </div>
        </div>
      </div>

      {/* SaaS Footer */}
      <footer className="bg-gray-950 pt-16 pb-36 px-8 mt-auto">
        <div className="max-w-6xl mx-auto">
          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Column 1: Brand & Info */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-2xl font-black uppercase tracking-tighter">SUPER AGENT</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering global businesses with autonomous AI agents. Deploy in seconds, scale infinitely.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                📍 10 Anson Road, International Plaza, Singapore.
              </p>
            </div>

            {/* Column 2: Resources */}
            <div className="flex flex-col gap-4">
              <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-2">RESOURCES</h5>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation (Notion)</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">API Reference</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a>
            </div>

            {/* Column 3: Company */}
            <div className="flex flex-col gap-4">
              <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-2">COMPANY</h5>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Sales</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Affiliate Program</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">System Status</a>
            </div>

            {/* Column 4: Connect */}
            <div className="flex flex-col gap-4">
              <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-2">CONNECT</h5>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                <Twitter size={16} /> X (Twitter)
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                <MessageSquare size={16} /> Discord Community
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                <Github size={16} /> GitHub
              </a>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              © 2026 Super Agent. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-black border-4 border-white rounded-2xl brutalist-shadow overflow-hidden"
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>
              <div className="w-full aspect-video">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/QriVht7UabA?autoplay=1&rel=0" 
                  title="Super Agent Demo" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
