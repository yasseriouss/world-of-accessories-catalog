/**
 * Dashboard to E-Commerce Data Synchronization
 * Real-time sync of product changes, images, and catalog updates
 */

const DataSync = {
  STORAGE_KEY: 'woa_products_data',
  SYNC_KEY: 'woa_sync_timestamp',

  // Initialize sync
  init() {
    this.setupEventListeners();
    this.loadSharedData();
    // Sync every 5 seconds when data changes
    setInterval(() => this.syncWithEcommerce(), 5000);
  },

  // Setup change detection
  setupEventListeners() {
    // Listen for product add/edit/delete
    document.addEventListener('productUpdated', (e) => this.onProductChange(e.detail));
    document.addEventListener('imageUploaded', (e) => this.onImageUpload(e.detail));
    document.addEventListener('catalogGenerated', (e) => this.onCatalogUpdate(e.detail));
  },

  // Load shared product data
  loadSharedData() {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (e) {
      console.warn('Failed to load shared data:', e);
    }
    return null;
  },

  // Save product changes to shared storage
  saveProductData(products) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      localStorage.setItem(this.SYNC_KEY, Date.now());
      return true;
    } catch (e) {
      console.error('Failed to save product data:', e);
      return false;
    }
  },

  // Sync with e-commerce
  syncWithEcommerce() {
    try {
      const data = this.loadSharedData();
      if (data) {
        // Notify e-commerce site of data change
        const event = new CustomEvent('dataSync', { detail: { data, timestamp: Date.now() } });
        document.dispatchEvent(event);

        // Also sync via broadcast channel for cross-tab support
        if (window.BroadcastChannel) {
          const bc = new BroadcastChannel('woa_products');
          bc.postMessage({
            type: 'product_update',
            data: data,
            timestamp: Date.now()
          });
          bc.close();
        }
      }
    } catch (e) {
      console.warn('Sync error:', e);
    }
  },

  // Handle product updates
  onProductChange(detail) {
    const { product, action } = detail; // action: 'add', 'edit', 'delete'
    let products = this.loadSharedData() || [];

    if (action === 'add') {
      products.push(product);
    } else if (action === 'edit') {
      const index = products.findIndex(p => p.id === product.id);
      if (index !== -1) products[index] = product;
    } else if (action === 'delete') {
      products = products.filter(p => p.id !== product.id);
    }

    this.saveProductData(products);
    this.syncWithEcommerce();
  },

  // Handle image uploads
  onImageUpload(detail) {
    const { productId, imageUrl } = detail;
    let products = this.loadSharedData() || [];
    const product = products.find(p => p.id === productId);

    if (product) {
      if (!product.images) product.images = [];
      if (!product.images.includes(imageUrl)) {
        product.images.push(imageUrl);
      }
      this.saveProductData(products);
      this.syncWithEcommerce();
    }
  },

  // Handle catalog generation
  onCatalogUpdate(detail) {
    const { timestamp } = detail;
    localStorage.setItem('woa_catalog_generated', timestamp);
    this.syncWithEcommerce();
  },

  // Notify e-commerce to refresh
  notifyEcommerceRefresh() {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: 'woa_data_refresh',
          timestamp: Date.now()
        }, '*');
      }

      if (window.BroadcastChannel) {
        const bc = new BroadcastChannel('woa_products');
        bc.postMessage({
          type: 'refresh_request',
          timestamp: Date.now()
        });
        bc.close();
      }
    } catch (e) {
      console.warn('Failed to notify e-commerce:', e);
    }
  }
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DataSync.init());
} else {
  DataSync.init();
}
