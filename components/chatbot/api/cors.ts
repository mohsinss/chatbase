import { NextResponse } from 'next/server';

export const setCorsHeaders = (res: Response) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
};

export async function handleOptionsRequest() {
  const res = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(res);
}
