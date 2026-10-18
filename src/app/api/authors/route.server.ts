import { authorsPayload, json } from '@/lib/api';
import { registry } from '@/lib/registry';

export const GET = () => json(authorsPayload(registry()));
