import { graphPayload, json } from '@/lib/api';
import { registry } from '@/lib/registry';

export const GET = () => json(graphPayload(registry()));
