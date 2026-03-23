export type HealthPayload = {
  ok: boolean;
  service: string;
  timestamp: string;
  version: string;
  environment: string;
};

export function parseHealthPayload(payload: unknown): HealthPayload {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Health payload must be an object');
  }

  const record = payload as Record<string, unknown>;
  const ok = record.ok;
  const service = record.service;
  const timestamp = record.timestamp;
  const version = record.version;
  const environment = record.environment;

  if (typeof ok !== 'boolean') {
    throw new Error('Health payload missing boolean ok');
  }
  if (typeof service !== 'string' || !service.trim()) {
    throw new Error('Health payload missing service');
  }
  if (typeof timestamp !== 'string' || !timestamp.trim()) {
    throw new Error('Health payload missing timestamp');
  }
  if (typeof version !== 'string' || !version.trim()) {
    throw new Error('Health payload missing version');
  }
  if (typeof environment !== 'string' || !environment.trim()) {
    throw new Error('Health payload missing environment');
  }

  return {
    ok,
    service,
    timestamp,
    version,
    environment,
  };
}

export function formatHealthTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

export async function fetchHealth(): Promise<HealthPayload> {
  const response = await fetch('/api/health', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Health endpoint returned ${response.status}`);
  }

  const data = await response.json();
  return parseHealthPayload(data);
}
