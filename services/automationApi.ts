/**
 * Social Media Automation API Integration
 * Handles communication with the local Python Flask automation server.
 */

const API_BASE = 'http://localhost:5001/api';

export const automationApi = {
  /**
   * Create and schedule a new automation task
   * @param data { type: string, config: AutomationConfig }
   */
  async createAutomation(data: any) {
    try {
      const response = await fetch(`${API_BASE}/automation/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Backend response not OK');
      return await response.json();
    } catch (error) {
      console.warn("Automation Backend unreachable. Falling back to local simulation.");
      return { success: true, task_id: `local_${Date.now()}`, local: true };
    }
  },

  /**
   * Fetch current status of the automation engine and active tasks
   */
  async getStatus() {
    try {
      const response = await fetch(`${API_BASE}/automation/status`);
      if (!response.ok) throw new Error('Status check failed');
      return await response.json();
    } catch (error) {
      return { active_tasks_count: 0, worker_running: false, offline: true };
    }
  },

  /**
   * Manually trigger a task execution immediately
   */
  async runTaskNow(taskId: string) {
    try {
      const response = await fetch(`${API_BASE}/automation/run-now/${taskId}`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Backend unreachable" };
    }
  },

  /**
   * Stop and remove a scheduled automation task
   */
  async stopAutomation(taskId: string) {
    try {
      const response = await fetch(`${API_BASE}/automation/stop/${taskId}`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      // If stop fails, try delete as fallback (compatibility)
      try {
        const delRes = await fetch(`${API_BASE}/automation/delete/${taskId}`, {
          method: 'DELETE'
        });
        return await delRes.json();
      } catch (e) {
        return { success: false, error: "Backend unreachable" };
      }
    }
  }
};
