import React from 'react';
import { BarChart3, Download, FileSpreadsheet } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/ui/Button';

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-mist pb-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-crimson" /> Data Reports & CSV Exports
        </h2>
        <p className="text-xs text-charcoal-muted mt-1">
          Generate, filter, and export marketplace transactional and user data for accounting and auditing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bone border border-mist rounded-xl p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-crimson/10 text-crimson">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Booking & Transaction Report</h3>
              <p className="text-xs text-charcoal-muted">Complete audit trail of all customer bookings, prices, and status changes.</p>
            </div>
          </div>
          <Button variant="cta" size="sm" onClick={() => adminService.exportData('bookings')} className="text-xs w-full">
            <Download className="w-4 h-4 mr-2" /> Download Booking Report (CSV)
          </Button>
        </div>

        <div className="bg-bone border border-mist rounded-xl p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-seafoam/20 text-seafoam">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Provider Master Directory</h3>
              <p className="text-xs text-charcoal-muted">Export provider verification statuses, ratings, rates, and earnings.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => adminService.exportData('providers')} className="text-xs w-full">
            <Download className="w-4 h-4 mr-2" /> Download Provider Directory (CSV)
          </Button>
        </div>

        <div className="bg-bone border border-mist rounded-xl p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-burgundy/10 text-burgundy">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Customer User Base Report</h3>
              <p className="text-xs text-charcoal-muted">Export registered customer contacts, join dates, and account statuses.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => adminService.exportData('customers')} className="text-xs w-full">
            <Download className="w-4 h-4 mr-2" /> Download Customer Report (CSV)
          </Button>
        </div>

        <div className="bg-bone border border-mist rounded-xl p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-900">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Reviews & Moderation Log</h3>
              <p className="text-xs text-charcoal-muted">Export ratings, reviews, and administrative moderation actions.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => adminService.exportData('reviews')} className="text-xs w-full">
            <Download className="w-4 h-4 mr-2" /> Download Reviews Report (CSV)
          </Button>
        </div>
      </div>
    </div>
  );
};
