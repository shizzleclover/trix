import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

// Redis connection
const connection = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
});

// Example queue
export const emailQueue = new Queue('email', { connection });

// Add job to queue
export async function addEmailJob(data: { to: string; subject: string; body: string }) {
    return emailQueue.add('send-email', data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    });
}

// Worker to process jobs
export const emailWorker = new Worker(
    'email',
    async (job: Job) => {
        console.log(`Processing email job ${job.id}:`, job.data);
        // Add your email sending logic here
        // await sendEmail(job.data);
        return { success: true };
    },
    { connection }
);

// Worker events
emailWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});
