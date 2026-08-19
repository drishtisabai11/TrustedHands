import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { FAQ } from '../../../types';
import Button from '../../../components/ui/Button';

export const FaqCMSPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'GENERAL' as any,
    order: 1,
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getFAQs();
      setFaqs(data || []);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'GENERAL', order: faqs.length + 1 });
    setShowModal(true);
  };

  const handleOpenEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer, category: faq.category, order: faq.order });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await adminService.updateFAQ(editingFaq.id || (editingFaq as any)._id, formData);
      } else {
        await adminService.createFAQ(formData);
      }
      setShowModal(false);
      loadFAQs();
    } catch (err: any) {
      alert(err.message || 'FAQ action failed');
    }
  };

  const handleDelete = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;
    try {
      await adminService.deleteFAQ(faqId);
      loadFAQs();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <Link to="/admin/content" className="text-xs font-semibold text-crimson hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to CMS Overview
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-crimson" /> Frequently Asked Questions (FAQ) Manager
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Create, edit, reorder, and publish marketplace support questions across customer and provider topics
          </p>
        </div>

        <Button variant="cta" size="sm" onClick={handleOpenCreate} className="text-xs">
          <Plus className="w-4 h-4 mr-1" /> Add FAQ Item
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading FAQ registry...</div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id || (faq as any)._id} className="bg-bone border border-mist rounded-xl p-5 space-y-2 shadow-subtle">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-mint text-ink uppercase tracking-wider">
                    {faq.category}
                  </span>
                  <h4 className="font-serif text-base font-bold text-ink mt-1.5">{faq.question}</h4>
                </div>

                <div className="flex items-center gap-2 text-xs shrink-0">
                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="p-1.5 bg-parchment border border-mist rounded hover:border-crimson"
                  >
                    <Edit2 className="w-4 h-4 text-charcoal" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id || (faq as any)._id)}
                    className="p-1.5 bg-crimson/10 text-crimson rounded hover:bg-crimson hover:text-parchment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-charcoal leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bone border border-mist rounded-xl shadow-modal w-full max-w-lg p-6 space-y-4 font-sans animate-in zoom-in-95">
            <h3 className="font-serif text-xl text-ink font-bold">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="BOOKINGS">BOOKINGS</option>
                  <option value="PAYMENTS">PAYMENTS</option>
                  <option value="VERIFICATION">VERIFICATION</option>
                  <option value="PROVIDERS">PROVIDERS</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="cta" size="sm">
                  {editingFaq ? 'Save FAQ' : 'Create FAQ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
