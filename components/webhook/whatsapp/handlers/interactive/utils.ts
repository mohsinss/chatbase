/**
 * Utility functions for interactive message handling
 */
import { sleep } from '@/libs/utils';

/**
 * Apply a 1-second delay before sending WhatsApp messages
 */
export async function applyMessageDelay(delay: number = 1000): Promise<void> {
  await sleep(delay); // default 1 second delay
}
