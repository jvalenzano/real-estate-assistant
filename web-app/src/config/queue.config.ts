/**
 * Queue Configuration
 * For handling PDF generation and other async tasks
 */

export interface QueueConfig {
  redis?: {
    host: string;
    port: number;
    password?: string;
  };
  defaultJobOptions: {
    removeOnComplete: boolean;
    removeOnFail: boolean;
    attempts: number;
    backoff: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
  };
  queues: {
    documentGeneration: {
      name: string;
      concurrency: number;
      limiter?: {
        max: number;
        duration: number;
      };
    };
    emailNotifications: {
      name: string;
      concurrency: number;
    };
  };
}

export const queueConfig: QueueConfig = {
  redis: process.env.REDIS_URL ? {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  } : undefined,
  
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  },
  
  queues: {
    documentGeneration: {
      name: 'document-generation',
      concurrency: 2, // Limit concurrent PDF generations
      limiter: {
        max: 10,
        duration: 60000 // 10 jobs per minute
      }
    },
    emailNotifications: {
      name: 'email-notifications',
      concurrency: 5
    }
  }
};

/**
 * In-memory queue implementation for development
 * Falls back to this when Redis is not available
 */
export class InMemoryQueue {
  private jobs: Map<string, any> = new Map();
  private processing = false;
  
  async add(name: string, data: any, options?: any): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.jobs.set(jobId, {
      id: jobId,
      name,
      data,
      options,
      status: 'waiting',
      createdAt: new Date()
    });
    
    // Process queue if not already processing
    if (!this.processing) {
      this.processQueue();
    }
    
    return jobId;
  }
  
  private async processQueue(): Promise<void> {
    this.processing = true;
    
    for (const [jobId, job] of this.jobs) {
      if (job.status === 'waiting') {
        job.status = 'processing';
        
        try {
          // Simulate async processing
          await new Promise(resolve => setTimeout(resolve, 100));
          
          job.status = 'completed';
          job.completedAt = new Date();
          
          // Remove completed jobs
          if (queueConfig.defaultJobOptions.removeOnComplete) {
            this.jobs.delete(jobId);
          }
        } catch (error) {
          job.status = 'failed';
          job.error = error;
          job.failedAt = new Date();
          
          // Remove failed jobs if configured
          if (queueConfig.defaultJobOptions.removeOnFail) {
            this.jobs.delete(jobId);
          }
        }
      }
    }
    
    this.processing = false;
  }
  
  async getJob(jobId: string): Promise<any> {
    return this.jobs.get(jobId);
  }
  
  async getJobs(status?: string): Promise<any[]> {
    const jobs = Array.from(this.jobs.values());
    if (status) {
      return jobs.filter(job => job.status === status);
    }
    return jobs;
  }
  
  async clean(grace: number, status: string): Promise<void> {
    const cutoff = Date.now() - grace;
    
    for (const [jobId, job] of this.jobs) {
      if (job.status === status && job.createdAt.getTime() < cutoff) {
        this.jobs.delete(jobId);
      }
    }
  }
}

// Export queue instance
export const documentQueue = new InMemoryQueue();
export const emailQueue = new InMemoryQueue();