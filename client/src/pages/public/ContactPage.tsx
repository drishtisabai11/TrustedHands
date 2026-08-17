import React, { useEffect, useState } from 'react';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/FeedbackComponents';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* Header Banner */}
      <section className="bg-bone border-b border-mist py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Contact & Support', isCurrent: true },
              ]}
              className="mb-4"
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
              Customer & Partner Support
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink font-normal leading-tight mb-4">
              We are here to help.
            </h1>
            <p className="text-sm md:text-base text-charcoal-muted leading-relaxed font-sans">
              Have questions about booking a service, provider verification, or joining as a partner? Send us a message and our support team will respond promptly.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Form & Contact Info Section */}
      <main className="flex-1 py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact Form */}
            <div className="lg:col-span-7 bg-bone p-6 sm:p-8 rounded-lg border border-mist shadow-card space-y-6">
              <h3 className="font-serif text-2xl text-ink font-normal">Send a Direct Message</h3>

              {submitted ? (
                <Alert variant="success" title="Message Received">
                  Thank you for reaching out, {name}. Our support team has received your query regarding "{reason}" and will respond to {email} within 4 hours.
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Your Full Name"
                    placeholder="e.g. Vikramaditya Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Select
                    label="Reason for Inquiry"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    options={[
                      { value: 'general', label: 'General Inquiry / Platform Question' },
                      { value: 'booking', label: 'Booking Support / Schedule Reschedule' },
                      { value: 'provider', label: 'Provider Application & Verification' },
                      { value: 'payment', label: 'Payment or Refund Support' },
                    ]}
                  />

                  <div className="flex flex-col gap-1.5 font-sans">
                    <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message details here..."
                      className="w-full p-3.5 text-sm bg-bone text-charcoal placeholder-charcoal-subtle border border-mist rounded-md focus:outline-none focus:border-mineral focus:ring-1 focus:ring-mineral"
                      required
                    />
                  </div>

                  <Button type="submit" variant="cta" size="lg" leftIcon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Right Column: Support Placeholders */}
            <div className="lg:col-span-5 space-y-6 font-sans">
              <div className="p-6 bg-bone rounded-lg border border-mist space-y-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-mineral block">
                  Support Channels
                </span>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-mineral shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Support Email</span>
                    <span className="text-xs text-charcoal-subtle font-mono">support@trustedhands.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-mist">
                  <Phone className="w-5 h-5 text-mineral shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Toll-Free Helpline</span>
                    <span className="text-xs text-charcoal-subtle font-mono">+91 1800 202 7000 (Mon-Sat, 9AM-7PM)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-mist">
                  <MapPin className="w-5 h-5 text-mineral shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Operations Hub</span>
                    <span className="text-xs text-charcoal-subtle">
                      Trusted Hands Marketplace Operations, Bandra Kurla Complex, Mumbai, India
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick FAQ Box */}
              <div className="p-6 bg-parchment rounded-lg border border-mist space-y-3">
                <h4 className="font-serif text-lg text-ink font-normal">Need Quick Answers?</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Check our detailed FAQ directory for immediate answers regarding verification, cancellation policies, and provider onboarding.
                </p>
                <a href="/faq" className="inline-flex items-center gap-1 text-xs font-bold text-mineral hover:underline">
                  <MessageSquare className="w-3.5 h-3.5" /> Visit FAQ Directory
                </a>
              </div>
            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};
