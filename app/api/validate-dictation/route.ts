import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest ) {
  // const team = params.id // '1'
  // console.log(params);
  const data = request.json();
  console.log('received data', data);
  return NextResponse.json({ myData: data }, { status: 200 });
}
