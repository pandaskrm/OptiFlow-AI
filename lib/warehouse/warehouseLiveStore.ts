type WarehouseLiveListener = () => void;

const listeners = new Set<WarehouseLiveListener>();

export function notifyWarehouseUpdate() {
  listeners.forEach((listener) => listener());
}

export function subscribeWarehouseUpdates(
  callback: WarehouseLiveListener
) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}