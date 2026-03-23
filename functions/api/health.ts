export const onRequestGet: PagesFunction = async () => {
  const payload = {
    ok: true,
    service: 'fastenough',
    timestamp: new Date().toISOString(),
    version: '0.0.0',
    environment: 'cloudflare',
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
};
