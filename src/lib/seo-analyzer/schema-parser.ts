/**
 * Parse and extract JSON-LD schema/structured data
 */

import type { SchemaData } from '@/types/analysis';
import { getJSONLDScripts } from './parser';

export function parseSchema(doc: Document): SchemaData[] {
  const scripts = getJSONLDScripts(doc);
  const schemas: SchemaData[] = [];

  for (const script of scripts) {
    const rawJson = script.textContent || '';
    if (!rawJson.trim()) continue;

    try {
      const parsed = JSON.parse(rawJson);

      // Extract schema type
      const type = extractSchemaType(parsed);

      schemas.push({
        type,
        rawJson,
        parsed,
        isValid: true,
      });
    } catch (error) {
      // Invalid JSON
      schemas.push({
        type: 'Unknown',
        rawJson,
        parsed: null,
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid JSON',
      });
    }
  }

  return schemas;
}

/**
 * Extract schema type from parsed JSON-LD
 */
function extractSchemaType(parsed: any): string {
  if (!parsed) return 'Unknown';

  // Handle single schema
  if (parsed['@type']) {
    return Array.isArray(parsed['@type']) ? parsed['@type'].join(', ') : parsed['@type'];
  }

  // Handle graph (multiple schemas)
  if (parsed['@graph'] && Array.isArray(parsed['@graph']) && parsed['@graph'].length > 0) {
    const types = parsed['@graph']
      .map((item: any) => item['@type'])
      .filter((type: any) => type)
      .flat();
    return types.length > 0 ? types.join(', ') : 'Unknown';
  }

  return 'Unknown';
}

/**
 * Check if a specific schema type exists
 */
export function hasSchemaType(schemas: SchemaData[], type: string): boolean {
  return schemas.some(schema => schema.type.includes(type));
}

/**
 * Get all unique schema types
 */
export function getUniqueSchemaTypes(schemas: SchemaData[]): string[] {
  const types = new Set<string>();

  for (const schema of schemas) {
    if (schema.type !== 'Unknown') {
      // Split comma-separated types
      const splitTypes = schema.type.split(',').map(t => t.trim());
      splitTypes.forEach(t => types.add(t));
    }
  }

  return Array.from(types);
}

/**
 * Validate if schema has required properties (basic check)
 */
export function validateSchemaBasic(schema: SchemaData): boolean {
  if (!schema.isValid || !schema.parsed) return false;

  // Check for @context (required for JSON-LD)
  if (!schema.parsed['@context']) return false;

  // Check for @type (required)
  if (!schema.parsed['@type']) return false;

  return true;
}
