import { FIELDS } from '@/data/types';
import { SITE_URL } from '@/lib/site';

const ok = (description: string, ref?: string) => ({ 200: { description, ...(ref && { content: { 'application/json': { schema: { $ref: ref } } } }) } });
const slug = { name: 'slug', in: 'path', required: true, schema: { type: 'string' } };

/** OpenAPI 3.1 명세 — /developers 문서와 동일한 계약. */
export function GET() {
  return Response.json({
    openapi: '3.1.0',
    info: { title: 'CISS Public API', version: '1.0.0', description: 'Algorithm origin & lineage registry. Read endpoints are public and CORS-enabled.' },
    servers: [{ url: SITE_URL }],
    paths: {
      '/api/algorithms': { get: { summary: 'List algorithms with credit', parameters: [{ name: 'field', in: 'query', schema: { type: 'string', enum: FIELDS } }], responses: ok('Algorithm list') } },
      '/api/algorithms/{slug}': { get: { summary: 'Algorithm detail with origins, edges, implementations, lineage', parameters: [slug], responses: { ...ok('Algorithm'), 404: { description: 'Unknown slug' } } } },
      '/api/authors': { get: { summary: 'Contributors ranked by credit score', responses: ok('Author list') } },
      '/api/authors/{slug}': { get: { summary: 'Contributor detail', parameters: [slug], responses: { ...ok('Author'), 404: { description: 'Unknown slug' } } } },
      '/api/graph': { get: { summary: 'Full lineage graph (nodes + derivation edges)', responses: ok('Graph') } },
      '/api/search': { get: { summary: 'Search algorithms and contributors', parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }, { name: 'limit', in: 'query', schema: { type: 'integer', maximum: 50 } }, { name: 'locale', in: 'query', schema: { type: 'string', enum: ['ko', 'en', 'ja', 'zh'] } }], responses: ok('Hits') } },
      '/api/dataset': { get: { summary: 'Dataset dump (JSON, or CSV per table)', parameters: [{ name: 'format', in: 'query', schema: { type: 'string', enum: ['json', 'csv'] } }, { name: 'table', in: 'query', schema: { type: 'string', enum: ['algorithms', 'origins', 'derivations', 'authors', 'implementations'] } }], responses: ok('Dataset') } },
      '/api/scan': {
        get: { summary: 'Detect algorithms in a repository (GitHub, GitLab, Bitbucket, npm:, pypi:)', parameters: [{ name: 'url', in: 'query', required: true, schema: { type: 'string' } }, { name: 'fresh', in: 'query', schema: { type: 'string', enum: ['1'] } }], responses: { ...ok('Scan report'), 400: { description: 'bad_input' }, 404: { description: 'not_found' }, 422: { description: 'no_repository' }, 429: { description: 'rate_limited' }, 502: { description: 'upstream' } } },
        post: { summary: 'Same as GET with JSON body {url, fresh}', responses: ok('Scan report') },
      },
      '/api/claims': {
        get: { summary: 'Public claims & disputes (contact fields never exposed)', parameters: [{ name: 'target', in: 'query', schema: { type: 'string' } }, { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'accepted', 'rejected'] } }], responses: ok('Claims') },
        post: { summary: 'Submit a claim or dispute', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['kind', 'target', 'name', 'statement', 'evidence'], properties: { kind: { enum: ['claim', 'dispute'] }, target: { type: 'string', examples: ['algorithm:quicksort', 'derivation:quicksort>introsort', 'author:hoare'] }, name: { type: 'string' }, contact: { type: 'string' }, statement: { type: 'string', minLength: 20 }, evidence: { type: 'array', items: { type: 'string', format: 'uri' }, minItems: 1, maxItems: 5 } } } } } }, responses: { 201: { description: 'Created' }, 422: { description: 'Validation failed' }, 429: { description: 'Rate limited' } } },
      },
      '/api/claims/{id}': { patch: { summary: 'Review a claim (admin, Bearer CISS_ADMIN_TOKEN)', security: [{ bearer: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Updated' }, 401: { description: 'Unauthorized' }, 503: { description: 'Review disabled' } } } },
      '/api/badge/{kind}/{slug}': { get: { summary: 'README badge (SVG)', parameters: [{ name: 'kind', in: 'path', required: true, schema: { enum: ['algorithm', 'author'] } }, slug], responses: { 200: { description: 'SVG', content: { 'image/svg+xml': {} } } } } },
    },
    components: { securitySchemes: { bearer: { type: 'http', scheme: 'bearer' } } },
  }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
