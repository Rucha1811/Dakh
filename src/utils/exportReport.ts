export function downloadCSV(data: Record<string, string | number>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => escape(row[h])).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateOrderReport(orders: { id: string; status: string; amount: number; destination: string; quantity: number; createdAt: string }[]) {
  return orders.map(o => ({
    'Order ID': o.id,
    'Status': o.status,
    'Amount': `₹${o.amount}`,
    'Destination': o.destination,
    'Quantity': o.quantity,
    'Date': o.createdAt,
  }));
}

export function generateShipmentReport(shipments: { trackingNumber: string; currentStatus: string; orderId: string; estimatedDelivery: string; lastUpdated: string; events: { location: string }[] }[]) {
  return shipments.map(s => ({
    'Tracking': s.trackingNumber,
    'Status': s.currentStatus,
    'Order': s.orderId,
    'Origin': s.events[0]?.location ?? 'N/A',
    'Last Updated': s.lastUpdated,
    'Est. Delivery': s.estimatedDelivery,
  }));
}
