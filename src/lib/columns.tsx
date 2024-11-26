import type { Runner } from '@/lib/client';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Runner>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'metrics.cpu', header: 'CPU' },
  { accessorKey: 'metrics.ram', header: 'RAM' },
];
