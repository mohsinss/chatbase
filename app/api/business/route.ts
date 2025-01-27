import { NextResponse } from 'next/server';
import axios from 'axios';

interface BusinessAccount {
  id: string;
  name: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('accessToken');

  try {
    const { data } = await axios.get<{ data: BusinessAccount[] }>(
      `https://graph.facebook.com/v18.0/me/businesses?access_token=${accessToken}`
    );

    return NextResponse.json(data.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch business accounts' },
      { status: 500 }
    );
  }
}