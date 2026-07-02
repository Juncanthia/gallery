'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/core/badge';
import { Button } from '@/components/core/button';
import { Input } from '@/components/core/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/core/table';

export type InvoiceStatus = 'paid' | 'pending' | 'refunded' | 'overdue';

export interface Invoice {
  id: string;
  date: string;
  description?: string;
  amount: number;
  status?: InvoiceStatus;
}

const demoInvoices: Invoice[] = [
  { id: 'INV-2024-001', date: '2024-06-15', description: 'Pro Plan — Monthly', amount: 29.99, status: 'paid' },
  { id: 'INV-2024-002', date: '2024-07-15', description: 'Pro Plan — Monthly', amount: 29.99, status: 'paid' },
  { id: 'INV-2024-003', date: '2024-08-15', description: 'Pro Plan — Monthly', amount: 29.99, status: 'pending' },
  { id: 'INV-2024-004', date: '2024-08-20', description: 'Enterprise Add-on', amount: 99, status: 'refunded' },
];

const statusLabel: Record<InvoiceStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  refunded: 'Refunded',
  overdue: 'Overdue',
};

export interface BillingHistoryProps {
  data?: {
    invoices?: Invoice[];
  };
  actions?: {
    onViewInvoice?: (invoiceId: string) => void;
    onDownload?: (invoiceId: string) => void;
  };
  appearance?: {
    currency?: string;
    showFilters?: boolean;
  };
  control?: {
    isLoading?: boolean;
    errorMessage?: string;
  };
}

export function BillingHistory({ data, actions, appearance, control }: BillingHistoryProps) {
  const invoices = data?.invoices ?? demoInvoices;
  const { currency = 'USD', showFilters = true } = appearance ?? {};
  const { isLoading = false, errorMessage } = control ?? {};

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');

  const formatter = useMemo(
    () => new Intl.NumberFormat(undefined, { style: 'currency', currency }),
    [currency],
  );

  const filtered = invoices.filter((invoice) => {
    const matchesQuery =
      !query ||
      invoice.id.toLowerCase().includes(query.toLowerCase()) ||
      invoice.description?.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-card p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Billing History</h2>
          <p className="text-sm text-muted-foreground">Review your invoices and payment status.</p>
        </div>
        {showFilters ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Search invoices"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              disabled={isLoading}
            >
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading invoices...
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.description ?? '—'}</TableCell>
                <TableCell>{formatter.format(invoice.amount)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{statusLabel[invoice.status ?? 'pending']}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      htmlType="button"
                      size="small"
                      variant="outlined"
                      onClick={() => actions?.onViewInvoice?.(invoice.id)}
                    >
                      View
                    </Button>
                    <Button
                      htmlType="button"
                      size="small"
                      variant="text"
                      onClick={() => actions?.onDownload?.(invoice.id)}
                    >
                      Download
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
