import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import type { DataTableProps } from '../../types';

// DataTable Component
function DataTable<T extends Record<string, any> & { id: string }>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);
  
  const handleSort = (columnKey: string) => {
    if (!columns.find(col => col.key === columnKey)?.sortable) return;
    
    setSortConfig(current => {
      if (!current || current.key !== columnKey) {
        return { key: columnKey, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key: columnKey, direction: 'desc' };
      }
      return null;
    });
  };
  
  const handleRowSelect = useCallback((row: T, checked: boolean) => {
    const rowId = row.id;
    const newSelectedRowIds = checked
      ? [...selectedRowIds, rowId]
      : selectedRowIds.filter(id => id !== rowId);
    
    setSelectedRowIds(newSelectedRowIds);
    onRowSelect?.(newSelectedRowIds);
  }, [selectedRowIds, onRowSelect]);
  
  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelectedRowIds = checked ? sortedData.map(row => row.id) : [];
    setSelectedRowIds(newSelectedRowIds);
    onRowSelect?.(newSelectedRowIds);
  }, [sortedData, onRowSelect]);
  
  const isRowSelected = useCallback((row: T) => {
    return selectedRowIds.includes(row.id);
  }, [selectedRowIds]);
  
  const allSelected = selectedRowIds.length === sortedData.length && sortedData.length > 0;
  const someSelected = selectedRowIds.length > 0 && selectedRowIds.length < sortedData.length;
  
  if (loading) {
    return (
      <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-gray-400 dark:text-gray-500 animate-spin" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">📄</div>
            <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none' : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                  role={column.sortable ? 'button' : undefined}
                  aria-sort={
                    sortConfig?.key === column.key
                      ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${
                            sortConfig?.key === column.key && sortConfig.direction === 'asc'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${
                            sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isRowSelected(row) ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                {selectable && (
                  <td className="px-4 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={isRowSelected(row)}
                      onChange={(e) => handleRowSelect(row, e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-900"
                      aria-label={`Select row ${index + 1}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {column.render 
                      ? column.render(row[column.dataIndex], row)
                      : String(row[column.dataIndex] ?? '')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;