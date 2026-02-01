import { WebhookConfig, WebhookEvent } from '../types';

type WebhookCallback = (data: any) => void;

export interface TransmissionLog {
  id: string;
  eventType: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: string;
  responseTime?: number;
  statusCode?: number;
  error?: string;
  payload?: any;
  retryCount: number;
  resolved?: boolean;
}

export class WebhookService {
  private config: WebhookConfig;
  private eventQueue: WebhookEvent[] = [];
  private transmissionLogs: TransmissionLog[] = [];
  private listeners: Record<string, WebhookCallback[]> = {};
  private readonly MAX_LOG_SIZE = 100;

  constructor(config: WebhookConfig) {
    this.config = config;
    this.loadTransmissionLogs();
    this.processQueue();
    setInterval(() => this.saveTransmissionLogs(), 15000);
  }

  on(eventType: string, callback: WebhookCallback) {
    if (!this.listeners[eventType]) this.listeners[eventType] = [];
    this.listeners[eventType].push(callback);
  }

  removeListener(eventType: string, callback: WebhookCallback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    }
  }

  private emit(eventType: string, data: any) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(cb => cb(data));
    }
  }

  private loadTransmissionLogs() {
    try {
      const saved = localStorage.getItem('bdtoolx_transmission_logs');
      if (saved) this.transmissionLogs = JSON.parse(saved);
    } catch (e) { this.transmissionLogs = []; }
  }

  private saveTransmissionLogs() {
    localStorage.setItem('bdtoolx_transmission_logs', JSON.stringify(this.transmissionLogs.slice(0, this.MAX_LOG_SIZE)));
    this.emit('logs_updated', this.transmissionLogs);
  }

  private addToTransmissionLog(log: TransmissionLog) {
    this.transmissionLogs.unshift(log);
    if (this.transmissionLogs.length > this.MAX_LOG_SIZE) {
      this.transmissionLogs = this.transmissionLogs.slice(0, this.MAX_LOG_SIZE);
    }
    this.saveTransmissionLogs();
  }

  // ✅ Send FULL payload to Make.com so it defines all possible variables
  async syncStructure(): Promise<{ success: boolean; message: string }> {
    if (!this.config.makeWebhookUrl) return { success: false, message: 'Missing Node URL' };
    
    try {
      const response = await fetch(this.config.makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          event_type: "structure_sync",
          id: "sync_" + Date.now(),
          platform: "Facebook/Instagram/YouTube",
          url: "https://original-link.com",
          short_url: "https://short-link.io/abc",
          revenue: 15.50,
          amount: 100.00,
          currency: "USD",
          network: "Amazon/AdFly",
          product: "Sample Product Name",
          profileName: "Admin User",
          email: "user@example.com",
          status: "active",
          timestamp: new Date().toISOString(),
          _meta: { version: "2.9", node: "BDToolX-Main" }
        })
      });

      if (response.ok) {
        return { success: true, message: 'Structure Synced!' };
      }
      return { success: false, message: `Node Error: ${response.status}` };
    } catch (e: any) {
      return { success: false, message: 'Network Blocked' };
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string; responseTime?: number }> {
    if (!this.config.makeWebhookUrl) return { success: false, message: 'Missing Node URL' };
    
    const startTime = Date.now();
    try {
      const response = await fetch(this.config.makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          test: "active",
          message: "Handshake Test",
          timestamp: new Date().toISOString()
        })
      });

      const responseTime = Date.now() - startTime;
      if (response.ok) {
        return { success: true, message: '200 OK: Ready', responseTime };
      }
      return { success: false, message: `Status: ${response.status}` };
    } catch (e: any) {
      return { success: false, message: 'Connection Error' };
    }
  }

  async sendToMake(eventType: string, payload: any): Promise<boolean> {
    if (!this.config.makeWebhookUrl) return false;
    const event: WebhookEvent = {
      id: `evt_${Date.now()}`,
      eventType,
      payload,
      timestamp: new Date().toISOString(),
      status: 'pending',
      attempts: 0
    };
    this.eventQueue.push(event);
    return true;
  }

  private async processQueue() {
    setInterval(async () => {
      const pending = this.eventQueue.filter(e => e.status === 'pending');
      for (const event of pending.slice(0, 3)) {
        await this.executeTransmission(event);
      }
    }, 4000);
  }

  private async executeTransmission(event: WebhookEvent) {
    const logId = `log_${Date.now()}`;
    const startTime = Date.now();
    
    try {
      const response = await fetch(this.config.makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          event_type: event.eventType,
          ...event.payload,
          _meta: {
            id: event.id,
            sent_at: new Date().toISOString()
          }
        })
      });

      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`Server: ${response.status}`);
      }

      event.status = 'sent';
      this.addToTransmissionLog({
        id: logId, 
        eventType: event.eventType, 
        status: 'sent',
        timestamp: new Date().toISOString(), 
        responseTime,
        statusCode: response.status,
        payload: event.payload, 
        retryCount: event.attempts
      });
      
      this.emit('transmission_success', { eventType: event.eventType, responseTime });
    } catch (error: any) {
      event.attempts++;
      if (event.attempts >= 3) {
        event.status = 'failed';
        this.addToTransmissionLog({
          id: logId, 
          eventType: event.eventType, 
          status: 'failed',
          timestamp: new Date().toISOString(), 
          error: error.message,
          payload: event.payload, 
          retryCount: event.attempts
        });
        this.emit('error_logged', { context: event.eventType, message: error.message });
      }
    }
  }

  async retryAllFailed() {
    const failed = this.eventQueue.filter(e => e.status === 'failed');
    failed.forEach(e => {
      e.status = 'pending';
      e.attempts = 0;
    });
    return { success: failed.length, total: failed.length };
  }

  getQueueStatus() {
    const pending = this.eventQueue.filter(e => e.status === 'pending').length;
    const failed = this.eventQueue.filter(e => e.status === 'failed').length;
    const sent = this.eventQueue.filter(e => e.status === 'sent').length;
    return { pending, failed, sent, total: this.eventQueue.length, isHealthy: failed === 0 };
  }

  getTransmissionLogs(limit: number = 50) {
    return this.transmissionLogs.slice(0, limit);
  }

  getTransmissionStats() {
    const total = this.transmissionLogs.length;
    const sent = this.transmissionLogs.filter(l => l.status === 'sent').length;
    const failed = this.transmissionLogs.filter(l => l.status === 'failed').length;
    const successRate = total > 0 ? (sent / total) * 100 : 100;
    return { total, sent, failed, successRate };
  }

  logError(context: string, error: any, metadata?: any) {
    this.sendToMake('neural_error_log', { context, error: error?.message || String(error), ...metadata });
  }

  getErrorLogs(limit: number = 5) {
    return this.transmissionLogs.filter(log => log.status === 'failed').slice(0, limit);
  }

  markErrorResolved(id: string) {
    const log = this.transmissionLogs.find(l => l.id === id);
    if (log) { log.resolved = true; this.saveTransmissionLogs(); }
  }
}

let globalWebhookService: WebhookService | null = null;
export function initWebhookService(config: WebhookConfig): WebhookService {
  globalWebhookService = new WebhookService(config);
  return globalWebhookService;
}
export function getWebhookService(): WebhookService | null { return globalWebhookService; }
export function triggerMakeEvent(eventType: string, payload: any) {
  getWebhookService()?.sendToMake(eventType, payload);
}

export const WEBHOOK_EVENTS = {
  LINK_CREATED: 'link_created',
  TASK_COMPLETED: 'task_completed',
  PAYOUT_RECEIVED: 'payout_received',
  ACCOUNT_CREATED: 'account_created',
  CONTENT_POSTED: 'content_posted',
  ERROR_OCCURRED: 'error_occurred'
};