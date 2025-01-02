import { Ai } from '@cloudflare/ai';

export interface VectorizeConfig {
  accountId: string;
  apiToken: string;
  indexName: string;
  workerUrl: string;
}

export class VectorizeClient {
  private accountId: string;
  private apiToken: string;
  private indexName: string;
  private baseUrl: string;
  private workerUrl: string;

  constructor(config: VectorizeConfig) {
    this.accountId = config.accountId;
    this.apiToken = config.apiToken;
    this.indexName = config.indexName;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/vectorize/v2/indexes`;
    this.workerUrl = config.workerUrl;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const requestBody = options.body ? JSON.parse(options.body as string) : null;
      console.log('Making request to:', `${this.baseUrl}${endpoint}`, {
        method: options.method,
        bodyPreview: requestBody ? {
          vectorCount: requestBody.vectors?.length,
          firstVectorSample: requestBody.vectors?.[0]
        } : null
      });

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      const responseText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: responseText };
      }

      if (!response.ok) {
        console.error('Vectorize API error details:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          headers: Object.fromEntries(response.headers.entries()),
          requestUrl: `${this.baseUrl}${endpoint}`,
          requestMethod: options.method
        });
        throw new Error(`Vectorize API error: ${JSON.stringify(errorData.errors || errorData)}`);
      }

      return errorData;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async createEmbedding(text: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${this.workerUrl}/embed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to create embedding: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data[0].embedding;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout while creating embedding');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async upsertVectors(vectors: Array<{
    id: string;
    values: number[];
    metadata?: Record<string, any>;
  }>) {
    console.log('First vector sample:', {
      id: vectors[0]?.id,
      valueLength: vectors[0]?.values?.length,
      metadata: vectors[0]?.metadata
    });

    const validVectors = vectors.filter(v => 
      Array.isArray(v.values) && 
      v.values.length === 768 && 
      v.values.every(val => typeof val === 'number' && !isNaN(val))
    );

    if (validVectors.length === 0) {
      throw new Error('No valid vectors to insert');
    }

    // First, try to create the index if it doesn't exist
    try {
      await this.fetchWithAuth('', {
        method: 'POST',
        body: JSON.stringify({
          name: this.indexName,
          config: {
            dimensions: 768,
            metric: "cosine",
            index_type: "hnsw",
            params: {
              m: 16,
              ef_construction: 100,
              ef: 10
            }
          }
        })
      });
    } catch (error) {
      // Ignore error if index already exists
      console.log('Index creation attempt:', error);
    }

    // Then upsert the vectors
    const requestBody = {
      vectors: validVectors.map(vector => ({
        id: vector.id,
        values: vector.values,
        metadata: vector.metadata || {}
      }))
    };

    // Add more detailed logging
    console.log('Upsert request:', {
      url: `${this.baseUrl}/${this.indexName}/upsert`,
      headers: {
        'Authorization': 'Bearer ' + this.apiToken.substring(0, 5) + '...',
        'Content-Type': 'application/json'
      },
      vectorCount: validVectors.length,
      sampleVector: {
        id: validVectors[0]?.id,
        valueLength: validVectors[0]?.values?.length
      }
    });

    return this.fetchWithAuth(`/${this.indexName}/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });
  }

  async query(values: number[], options: {
    topK?: number;
    filter?: Record<string, any>;
  } = {}) {
    return this.fetchWithAuth(`/${this.indexName}/query`, {
      method: 'POST',
      body: JSON.stringify({
        vector: values,
        topK: options.topK || 5,
        filter: options.filter,
      }),
    });
  }

  async deleteVectors(ids: string[]) {
    return this.fetchWithAuth(`/${this.indexName}/delete_by_ids`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  }
} 