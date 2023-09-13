import { Worker } from 'bullmq';
import { processTenderCreated, processTenderAmended, processTenderApprovedOrRjected } from '../processors/tenders';

const workerOptions = {
  connection: {
    host: "localhost",
    port: 6379,
  },
};

const tendersQueueProcessor = async (job) => {
  const { action } = job.data;

  switch (action) {
    case 'tender.created':
      await processTenderCreated(job);
      break;
    case 'tender.amended':
      await processTenderAmended(job);
      break;
    case 'tender.approved-or-rejected':
      await processTenderApprovedOrRjected(job);
      break;
    default:
      return;
  }
};

const worker = new Worker("tenders", tendersQueueProcessor, workerOptions);

console.log("Redis Queue Worker started!");

