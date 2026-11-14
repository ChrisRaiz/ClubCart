import { contextBridge, ipcRenderer } from 'electron';

// The API the renderer can use, exposed as `window.electron`.
const electronHandler = {
  getProduct(
    url: string,
    qty: string,
    alias?: string,
  ): Promise<{
    name: string;
    sku: string;
    offerId: string;
    qty: string;
    alias?: string;
  }> {
    return ipcRenderer.invoke('get-product', url, qty, alias);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
