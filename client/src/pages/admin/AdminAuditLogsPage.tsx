import React, { useEffect, useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AuditLog } from '../../types';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [actionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  useEffect(() => {
    fetchLogs(1);
  }, [actionFilter, entityFilter]);

  const fetchLogs = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await adminService.getAuditLogs(actionFilter, entityFilter, page, 15);
      setLogs(res.data || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-mist pb-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-crimson" /> Administrative Audit Log Registry
        </h2>
        <p className="text-xs text-charcoal-muted mt-1">
          Complete, tamper-evident record of state-changing administrative operations and security decisions
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-bone border border-mist p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-charcoal-muted">Filter Entity:</span>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 bg-parchment border border-mist rounded-lg text-xs focus:outline-none focus:border-crimson font-medium text-ink"
          >
            <option value="">All Entity Types</option>
            <option value="PROVIDER">PROVIDER</option>
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="BOOKING">BOOKING</option>
            <option value="PAYMENT">PAYMENT</option>
            <option value="REVIEW">REVIEW</option>
            <option value="CMS">CMS</option>
            <option value="SETTINGS">SETTINGS</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading audit log entries...</div>
      ) : logs.length === 0 ? (
        <div className="bg-bone border border-mist p-8 rounded-xl text-center text-xs text-charcoal-muted">
          No audit logs found matching criteria.
        </div>
      ) : (
        <div className="bg-bone border border-mist rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-parchment text-charcoal font-semibold border-b border-mist uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Action Trigger</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Audit Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/60">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-parchment/60 transition-colors">
                  <td className="py-3.5 px-4 text-charcoal-muted whitespace-nowrap font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-ink">
                    {typeof log.admin === 'object' ? log.admin.name || log.adminEmail : log.adminEmail || 'Admin'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-crimson text-[11px]">{log.action}</td>
                  <td className="py-3.5 px-4 font-bold text-charcoal">
                    <span className="px-2 py-0.5 rounded bg-mist/60 text-ink text-[10px] uppercase">
                      {log.entityType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-charcoal">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-between items-center text-xs text-charcoal-muted pt-2">
          <span>Page {pagination.page} of {pagination.pages} ({pagination.total} audit logs)</span>
        </div>
      )}
    </div>
  );
};
