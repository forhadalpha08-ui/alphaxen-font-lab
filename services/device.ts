// Device fingerprinting & HWID generation for browser environments

export const getBrowserHWID = (): string => {
  try {
    let persistentId = localStorage.getItem('znx_reseller_device_id');
    if (!persistentId) {
      persistentId = 'DEV-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      localStorage.setItem('znx_reseller_device_id', persistentId);
    }
    
    const screenInfo = `${window.screen.width}x${window.screen.height}:${window.screen.colorDepth}`;
    const navInfo = `${navigator.userAgent}:${navigator.language}:${navigator.hardwareConcurrency || 4}`;
    
    let hash = 0;
    const combined = `${persistentId}::${screenInfo}::${navInfo}`;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `ZNX-HWID-${hexHash}-${persistentId.replace('DEV-', '')}`;
  } catch (e) {
    return 'ZNX-HWID-DEFAULT-' + Date.now().toString(36).toUpperCase();
  }
};
