import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input, SearchInput } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox, Radio, Toggle } from '../components/ui/FormControls';
import { Badge, VerificationBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Rating } from '../components/ui/Rating';
import { Divider } from '../components/ui/Divider';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Dropdown, Tooltip } from '../components/ui/OverlayControls';
import { Tabs } from '../components/ui/Tabs';
import { Pagination } from '../components/ui/Pagination';
import { Alert, Toast } from '../components/ui/FeedbackComponents';
import { EmptyState, Skeleton } from '../components/ui/StateComponents';
import { StatusIndicator, ServiceLabel, ProviderMeta, PriceDisplay } from '../components/ui/DomainPrimitives';
import { DateSelector, TimeSlot, CalendarPrimitives } from '../components/ui/BookingPrimitives';
import { 
  ShieldCheck, Wrench, Sparkles, Send, MoreVertical, 
  MapPin, UserCheck, Heart, ArrowRight
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  // Form states
  const [searchValue, setSearchValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('option1');
  const [toggleActive, setToggleActive] = useState(true);
  const [interactiveRating, setInteractiveRating] = useState(4.5);
  const [selectedDate, setSelectedDate] = useState('2026-08-18');
  const [selectedSlot, setSelectedSlot] = useState('slot-1');
  const [currentPage, setCurrentPage] = useState(1);

  const mockDates = [
    { dateString: '2026-08-18', dayName: 'Tue', dayNumber: 18, monthName: 'Aug' },
    { dateString: '2026-08-19', dayName: 'Wed', dayNumber: 19, monthName: 'Aug' },
    { dateString: '2026-08-20', dayName: 'Thu', dayNumber: 20, monthName: 'Aug' },
    { dateString: '2026-08-21', dayName: 'Fri', dayNumber: 21, monthName: 'Aug' },
    { dateString: '2026-08-22', dayName: 'Sat', dayNumber: 22, monthName: 'Aug', isAvailable: false },
    { dateString: '2026-08-23', dayName: 'Sun', dayNumber: 23, monthName: 'Aug' },
  ];

  const mockTimeSlots = [
    { id: 'slot-1', timeLabel: '09:00 AM - 11:00 AM', period: 'MORNING' as const },
    { id: 'slot-2', timeLabel: '11:00 AM - 01:00 PM', period: 'MORNING' as const },
    { id: 'slot-3', timeLabel: '02:00 PM - 04:00 PM', period: 'AFTERNOON' as const },
    { id: 'slot-4', timeLabel: '04:00 PM - 06:00 PM', period: 'AFTERNOON' as const, isAvailable: false },
    { id: 'slot-5', timeLabel: '06:00 PM - 08:00 PM', period: 'EVENING' as const },
  ];

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* Hero Header Section */}
      <section className="bg-bone border-b border-mist py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <Breadcrumb 
              items={[
                { label: 'System Foundation', href: '#' },
                { label: 'Design System & Component Showcase', isCurrent: true }
              ]} 
              className="mb-4"
            />
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-mineral mb-2">
              Production Architecture Phase
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink font-normal leading-tight mb-4">
              Good work starts with the right hands.
            </h1>
            <p className="text-sm md:text-base text-charcoal-muted leading-relaxed font-sans mb-6">
              Welcome to the official <strong>Trusted Hands</strong> Design System & Component Library. Built with an editorial human touch, restrained brand tokens, accessible controls, and domain primitives for local service excellence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="cta" onClick={() => setToastOpen(true)} leftIcon={<Sparkles className="w-4 h-4" />}>
                Trigger Toast Alert
              </Button>
              <Button variant="secondary" onClick={() => setModalOpen(true)}>
                Inspect Modal Primitive
              </Button>
              <Button variant="outline" onClick={() => setDrawerOpen(true)}>
                Open Drawer Panel
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 py-12">
        <Container>
          
          {/* Navigation Tabs */}
          <Tabs
            tabs={[
              { id: 'overview', label: 'Design Tokens & Palette' },
              { id: 'typography', label: 'Editorial Typography' },
              { id: 'buttons', label: 'Buttons & Controls' },
              { id: 'inputs', label: 'Forms & Inputs' },
              { id: 'badges', label: 'Badges & Avatars' },
              { id: 'domain', label: 'Marketplace Primitives' },
              { id: 'booking', label: 'Booking & Slots' },
              { id: 'overlays', label: 'Modals & Drawers' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-10"
          />

          {/* TAB 1: DESIGN TOKENS & COLOR PALETTE */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-serif text-ink mb-2">Modern Editorial Color Palette System</h2>
                <p className="text-xs text-charcoal-muted max-w-2xl">
                  Refined editorial palette: Warm Porcelain background (#F5F1E8), Soft White cards (#FCFAF5), Burnished Copper accents (#B85C45), Mulberry Ink headings (#3A2432), Lichen Green trust badges (#718A78), and Near Black typography (#202624).
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Near Black */}
                <div className="p-4 rounded-md bg-ink text-parchment shadow-subtle border border-slate flex flex-col justify-between h-32">
                  <div>
                    <span className="font-serif text-lg">Near Black</span>
                    <p className="text-[11px] opacity-80 mt-0.5">Primary Typography</p>
                  </div>
                  <span className="font-mono text-xs text-sage-light">#202624</span>
                </div>

                {/* Mulberry Ink */}
                <div className="p-4 rounded-md bg-slate text-white shadow-subtle flex flex-col justify-between h-32">
                  <div>
                    <span className="font-serif text-lg">Mulberry Ink</span>
                    <p className="text-[11px] opacity-80 mt-0.5">Hero Headings & Footer</p>
                  </div>
                  <span className="font-mono text-xs text-white/90">#3A2432</span>
                </div>

                {/* Burnished Copper */}
                <div className="p-4 rounded-md bg-brand text-white shadow-subtle flex flex-col justify-between h-32">
                  <div>
                    <span className="font-serif text-lg">Burnished Copper</span>
                    <p className="text-[11px] opacity-80 mt-0.5">Primary Accent & CTAs</p>
                  </div>
                  <span className="font-mono text-xs text-white/90">#B85C45</span>
                </div>

                {/* Lichen Green */}
                <div className="p-4 rounded-md bg-sage text-white shadow-subtle flex flex-col justify-between h-32">
                  <div>
                    <span className="font-serif text-lg">Lichen Green</span>
                    <p className="text-[11px] opacity-80 mt-0.5">Trust & Verification</p>
                  </div>
                  <span className="font-mono text-xs text-white/90">#718A78</span>
                </div>

                {/* Warm Porcelain */}
                <div className="p-4 rounded-md bg-parchment text-charcoal shadow-subtle border border-mist flex flex-col justify-between h-32">
                  <div>
                    <span className="font-serif text-lg">Warm Porcelain</span>
                    <p className="text-[11px] text-charcoal-subtle mt-0.5">Main Page Background</p>
                  </div>
                  <span className="font-mono text-xs text-charcoal-muted">#F5F1E8</span>
                </div>

                {/* Soft White */}
                <div className="p-4 rounded-md bg-bone text-charcoal shadow-subtle border border-mist flex flex-col justify-between h-32">
                  <div>
                    <span className="font-serif text-lg">Soft White</span>
                    <p className="text-[11px] text-charcoal-subtle mt-0.5">Cards & Surfaces</p>
                  </div>
                  <span className="font-mono text-xs text-charcoal-muted">#FCFAF5</span>
                </div>

                {/* Stone Grey */}
                <div className="p-4 rounded-md bg-charcoal text-parchment shadow-subtle flex flex-col justify-between h-32">
                  <div>
                    <span className="font-serif text-lg">Stone Grey</span>
                    <p className="text-[11px] opacity-80 mt-0.5">Secondary Typography</p>
                  </div>
                  <span className="font-mono text-xs text-sage-light">#5F6661</span>
                </div>

                {/* Warm Mist */}
                <div className="p-4 rounded-md bg-mist text-charcoal shadow-subtle flex flex-col justify-between h-32">
                  <div>
                    <span className="font-serif text-lg">Warm Mist</span>
                    <p className="text-[11px] text-charcoal-subtle mt-0.5">Subtle Borders</p>
                  </div>
                  <span className="font-mono text-xs text-charcoal-muted">#D8D4CA</span>
                </div>
              </div>

              {/* Radius Scale */}
              <div className="pt-6 border-t border-mist">
                <h3 className="text-xl font-serif text-ink mb-4">Restrained Border Radius Scale</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 font-sans text-xs">
                  <div className="p-4 bg-bone border border-mist rounded-sm text-center">
                    <span className="font-bold text-ink block">6px (sm)</span>
                    <span className="text-charcoal-subtle">Controls & Badges</span>
                  </div>
                  <div className="p-4 bg-bone border border-mist rounded text-center">
                    <span className="font-bold text-ink block">8px (DEFAULT)</span>
                    <span className="text-charcoal-subtle">Buttons & Inputs</span>
                  </div>
                  <div className="p-4 bg-bone border border-mist rounded-md text-center">
                    <span className="font-bold text-ink block">10px (md)</span>
                    <span className="text-charcoal-subtle">Cards & Panels</span>
                  </div>
                  <div className="p-4 bg-bone border border-mist rounded-lg text-center">
                    <span className="font-bold text-ink block">12px (lg)</span>
                    <span className="text-charcoal-subtle">Modals & Containers</span>
                  </div>
                  <div className="p-4 bg-bone border border-mist rounded-xl text-center">
                    <span className="font-bold text-ink block">14px (xl)</span>
                    <span className="text-charcoal-subtle">Large Image Containers</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDITORIAL TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-8 max-w-4xl font-sans">
              <div>
                <h2 className="text-2xl font-serif text-ink mb-2">Typography & Editorial Contrast</h2>
                <p className="text-xs text-charcoal-muted">
                  DM Serif Display for headlines + Manrope for clear interface body text. High contrast, human tone, no generic tech SaaS copy.
                </p>
              </div>

              <div className="p-8 bg-bone rounded-lg border border-mist space-y-6">
                <div>
                  <span className="text-xs font-semibold text-mineral uppercase tracking-wider block mb-1">Display / Hero Headline</span>
                  <h1 className="text-4xl sm:text-5xl font-serif text-ink font-normal leading-tight">
                    Craftsmanship in every home, delivered by trusted hands.
                  </h1>
                </div>

                <Divider />

                <div>
                  <span className="text-xs font-semibold text-mineral uppercase tracking-wider block mb-1">Section Heading (H2)</span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-ink font-normal">
                    Verified professionals who take pride in real work.
                  </h2>
                </div>

                <Divider />

                <div>
                  <span className="text-xs font-semibold text-mineral uppercase tracking-wider block mb-1">Card / Sub-Heading (H3)</span>
                  <h3 className="text-xl font-serif text-ink font-normal">
                    Master Electrician & Residential Specialist
                  </h3>
                </div>

                <Divider />

                <div>
                  <span className="text-xs font-semibold text-mineral uppercase tracking-wider block mb-1">Body Text (Manrope 15px)</span>
                  <p className="text-base text-charcoal leading-relaxed">
                    Every professional on Trusted Hands undergoes rigorous identity confirmation, local trade certificate inspection, and active insurance verification. We believe that booking local expertise should feel as reassuring as getting a personal recommendation from a trusted neighbour.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUTTONS & CONTROLS */}
          {activeTab === 'buttons' && (
            <div className="space-y-8 font-sans">
              <div>
                <h2 className="text-2xl font-serif text-ink mb-2">Button Architecture & States</h2>
                <p className="text-xs text-charcoal-muted">
                  Restrained heights, medium radius, high-contrast hover & loading states. No giant pill buttons.
                </p>
              </div>

              <div className="p-6 bg-bone rounded-lg border border-mist space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary Deep Ink</Button>
                  <Button variant="cta">CTA Mineral Green</Button>
                  <Button variant="secondary">Secondary Bone</Button>
                  <Button variant="outline">Outline Border</Button>
                  <Button variant="text">Text Link</Button>
                  <Button variant="danger">Warm Clay Action</Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">Small (32px)</Button>
                  <Button variant="primary" size="md">Medium (40px)</Button>
                  <Button variant="primary" size="lg">Large (48px)</Button>
                  <Button variant="cta" isLoading>Loading State</Button>
                  <Button variant="secondary" disabled>Disabled State</Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                  <Button variant="cta" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Book Professional
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FORMS & INPUTS */}
          {activeTab === 'inputs' && (
            <div className="space-y-8 font-sans max-w-3xl">
              <div>
                <h2 className="text-2xl font-serif text-ink mb-2">Form Controls & Inputs</h2>
                <p className="text-xs text-charcoal-muted">
                  Clear labels, subtle borders, focused rings, helpful validation error states.
                </p>
              </div>

              <div className="p-6 bg-bone rounded-lg border border-mist space-y-6">
                <SearchInput
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClear={() => setSearchValue('')}
                  placeholder="Search electricians, plumbers, or tutors near you..."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    label="Full Legal Name" 
                    placeholder="e.g. Vikramaditya Singh" 
                    helperText="As printed on government ID"
                  />
                  <Input 
                    label="Phone Number" 
                    placeholder="+91 98765 43210" 
                    leftIcon={<MapPin className="w-4 h-4 text-mist-dark" />}
                  />
                </div>

                <Input 
                  label="Email Address" 
                  value="invalid-email-address" 
                  error="Please enter a valid email address." 
                  readOnly
                />

                <Select
                  label="Service Trade Category"
                  placeholder="Select a verified trade..."
                  options={[
                    { value: 'electrical', label: 'Electrical & Power Repairs' },
                    { value: 'carpentry', label: 'Custom Carpentry & Woodwork' },
                    { value: 'cleaning', label: 'Deep Home Cleaning' },
                    { value: 'painting', label: 'Interior & Exterior Painting' },
                  ]}
                />

                <Divider />

                <div className="flex flex-wrap gap-8 items-start">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase text-charcoal-muted block">Checkbox Options</span>
                    <Checkbox
                      label="Identity Verification Completed"
                      description="Government photo ID confirmed"
                      checked={checkboxChecked}
                      onChange={(e) => setCheckboxChecked(e.target.checked)}
                    />
                    <Checkbox label="Send SMS Booking Updates" />
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase text-charcoal-muted block">Radio Selection</span>
                    <Radio
                      name="sample-radio"
                      label="Standard Rate (₹650/hr)"
                      checked={radioValue === 'option1'}
                      onChange={() => setRadioValue('option1')}
                    />
                    <Radio
                      name="sample-radio"
                      label="Emergency Rate (₹950/hr)"
                      checked={radioValue === 'option2'}
                      onChange={() => setRadioValue('option2')}
                    />
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase text-charcoal-muted block">Toggle Switch</span>
                    <Toggle
                      checked={toggleActive}
                      onChange={setToggleActive}
                      label="Provider Availability"
                      description="Accepting new instant bookings"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BADGES & AVATARS */}
          {activeTab === 'badges' && (
            <div className="space-y-8 font-sans">
              <div>
                <h2 className="text-2xl font-serif text-ink mb-2">Badges, Verification & Avatars</h2>
                <p className="text-xs text-charcoal-muted">
                  Domain verification indicators, status tags, and avatar fallbacks.
                </p>
              </div>

              <div className="p-6 bg-bone rounded-lg border border-mist space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-charcoal-muted">System Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="ink">Deep Ink</Badge>
                    <Badge variant="slate">Forest Slate</Badge>
                    <Badge variant="mineral">Mineral Green</Badge>
                    <Badge variant="sage">Soft Sage</Badge>
                    <Badge variant="clay">Warm Clay Accent</Badge>
                    <Badge variant="parchment">Parchment Surface</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-charcoal-muted">Verification Indicators</h4>
                  <div className="flex flex-wrap gap-3">
                    <VerificationBadge type="identity" />
                    <VerificationBadge type="background" />
                    <VerificationBadge type="insured" />
                    <VerificationBadge type="master" />
                  </div>
                </div>

                <Divider />

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-charcoal-muted">Avatars & Online States</h4>
                  <div className="flex items-center gap-4">
                    <Avatar name="Rajesh Kumar" size="sm" isOnline={true} />
                    <Avatar name="Anita Sharma" size="md" isOnline={true} />
                    <Avatar name="Vikram Crafts" size="lg" isOnline={false} />
                    <Avatar name="Trusted Master" size="xl" isOnline={true} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-charcoal-muted">Rating Component</h4>
                  <div className="flex flex-wrap items-center gap-6">
                    <Rating value={4.8} reviewCount={124} size="md" />
                    <Rating 
                      value={interactiveRating} 
                      interactive 
                      onChange={setInteractiveRating} 
                      size="lg" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DOMAIN PRIMITIVES */}
          {activeTab === 'domain' && (
            <div className="space-y-8 font-sans">
              <div>
                <h2 className="text-2xl font-serif text-ink mb-2">Marketplace Domain Primitives</h2>
                <p className="text-xs text-charcoal-muted">
                  Pre-configured card elements for local providers, booking statuses, and service pricing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Provider Card Primitive */}
                <div className="p-6 bg-bone rounded-lg border border-mist flex gap-4">
                  <Avatar name="Arjun Vishwakarma" size="lg" isOnline={true} />
                  <div className="flex-1 space-y-2">
                    <ServiceLabel category="Master Carpentry & Furniture" />
                    <ProviderMeta
                      name="Arjun Vishwakarma"
                      headline="Custom Hardwood Furniture & Fitted Cabinetry Specialist"
                      location="Bandra West, Mumbai &bull; 8 km away"
                      rating={4.9}
                      reviewCount={86}
                      isVerified={true}
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <VerificationBadge type="identity" size="sm" />
                      <VerificationBadge type="insured" size="sm" />
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-mist">
                      <PriceDisplay amount={750} unit="hour" size="md" />
                      <Button variant="cta" size="sm">Book Slot</Button>
                    </div>
                  </div>
                </div>

                {/* Booking Status Card Primitive */}
                <div className="p-6 bg-bone rounded-lg border border-mist space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-charcoal-subtle">#TH-BK-8902</span>
                    <StatusIndicator status="CONFIRMED" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-ink">Complete Home Electrical Safety Inspection</h4>
                    <p className="text-xs text-charcoal-subtle mt-0.5">Scheduled for Tue, Aug 18 &bull; 09:00 AM - 11:00 AM</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-mist text-xs">
                    <span className="text-charcoal-muted">Total Paid</span>
                    <PriceDisplay amount={1200} unit="fixed" size="sm" />
                  </div>
                </div>
              </div>

              {/* Feedback States */}
              <div className="space-y-3">
                <Alert variant="info" title="Verification Requirement Notice">
                  All providers must upload valid government photo ID and trade certification before receiving booking requests.
                </Alert>
                <Alert variant="success" title="Booking Confirmed Successfully">
                  Your appointment with Arjun Vishwakarma has been scheduled. Payment is held in secure escrow.
                </Alert>
              </div>
            </div>
          )}

          {/* TAB 7: BOOKING & SLOTS */}
          {activeTab === 'booking' && (
            <div className="space-y-8 font-sans max-w-4xl">
              <div>
                <h2 className="text-2xl font-serif text-ink mb-2">Booking Primitives & Slot Selectors</h2>
                <p className="text-xs text-charcoal-muted">
                  Interactive date scroller, time slot grid, and calendar primitives.
                </p>
              </div>

              <div className="p-6 bg-bone rounded-lg border border-mist space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">
                    1. Select Preferred Service Date
                  </h4>
                  <DateSelector
                    dates={mockDates}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                </div>

                <Divider />

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">
                    2. Select Arrival Time Slot
                  </h4>
                  <TimeSlot
                    slots={mockTimeSlots}
                    selectedSlotId={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                  />
                </div>

                <Divider />

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">
                    3. Calendar Month Primitive
                  </h4>
                  <CalendarPrimitives currentMonthName="August 2026">
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {['M','T','W','T','F','S','S'].map((day, i) => (
                        <span key={i} className="font-semibold text-charcoal-subtle py-1">{day}</span>
                      ))}
                      {Array.from({ length: 31 }).map((_, i) => (
                        <button
                          key={i}
                          className={`py-1.5 rounded-sm hover:bg-parchment ${i + 1 === 18 ? 'bg-mineral text-white font-bold' : 'text-charcoal'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </CalendarPrimitives>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: OVERLAYS, MODALS & STATES */}
          {activeTab === 'overlays' && (
            <div className="space-y-8 font-sans">
              <div>
                <h2 className="text-2xl font-serif text-ink mb-2">Modals, Drawers & Empty States</h2>
                <p className="text-xs text-charcoal-muted">
                  Accessible popups, side drawers, contextual dropdowns, and empty loading indicators.
                </p>
              </div>

              <div className="p-6 bg-bone rounded-lg border border-mist space-y-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="cta" onClick={() => setModalOpen(true)}>
                    Open Confirmation Modal
                  </Button>

                  <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                    Open Filter Drawer
                  </Button>

                  <Dropdown
                    trigger={
                      <Button variant="outline" rightIcon={<MoreVertical className="w-4 h-4" />}>
                        Options Menu
                      </Button>
                    }
                    items={[
                      { label: 'View Profile', icon: <UserCheck className="w-4 h-4" /> },
                      { label: 'Save to Favorites', icon: <Heart className="w-4 h-4" /> },
                      { label: 'Report Profile', danger: true },
                    ]}
                  />

                  <Tooltip content="Identity and background verified by Trusted Hands">
                    <span className="inline-flex items-center gap-1 text-xs text-mineral font-semibold cursor-help">
                      <ShieldCheck className="w-4 h-4" /> Hover for Tooltip
                    </span>
                  </Tooltip>
                </div>

                <Divider />

                <EmptyState
                  title="No Service Professionals Found"
                  description="We couldn't find any verified electricians matching your exact search filters in this area."
                  actionLabel="Reset Search Filters"
                  onAction={() => alert('Search filters reset!')}
                  icon={<Wrench className="w-6 h-6 text-mineral" />}
                />

                <Divider />

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Skeleton Loading Primitive</h4>
                  <Skeleton height="h-6" width="w-1/3" />
                  <Skeleton height="h-4" width="w-3/4" />
                  <Skeleton height="h-24" width="w-full" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-mist">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />
          </div>

        </Container>
      </main>

      {/* Interactive Modal Demo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Service Booking"
        subtitle="Review booking details before locking in arrival slot"
        footer={
          <>
            <Button variant="text" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" onClick={() => { setModalOpen(false); setToastOpen(true); }}>
              Confirm & Pay ₹1,200
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-charcoal-muted leading-relaxed">
            You are booking <strong>Arjun Vishwakarma</strong> for <strong>Complete Home Electrical Safety Inspection</strong> on <strong>Tuesday, Aug 18 (09:00 AM - 11:00 AM)</strong>.
          </p>
          <div className="p-3 bg-parchment rounded border border-mist space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Service Fee:</span>
              <span>₹1,000</span>
            </div>
            <div className="flex justify-between text-charcoal-subtle">
              <span>Platform Protection & Escrow:</span>
              <span>₹200</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Interactive Drawer Demo */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filter Service Professionals"
      >
        <div className="space-y-6">
          <Select
            label="Service Trade"
            options={[
              { value: 'all', label: 'All Verified Trades' },
              { value: 'electrician', label: 'Electricians' },
              { value: 'carpenter', label: 'Carpenters' },
            ]}
          />
          <Input label="Max Hourly Rate (₹)" placeholder="e.g. 1000" />
          <Checkbox label="Only Show Instantly Available Today" />
          <Button variant="cta" fullWidth onClick={() => setDrawerOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </Drawer>

      {/* Interactive Toast Demo */}
      {toastOpen && (
        <Toast
          message="Booking Confirmed!"
          description="Your request has been sent to the professional."
          variant="success"
          onClose={() => setToastOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
};
