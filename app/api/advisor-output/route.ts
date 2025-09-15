import { NextResponse } from 'next/server';

// This route acts as a server-side proxy to fetch data from opensheet.elk.sh.
// This avoids potential client-side issues like CORS or rate-limiting and hides the sheet URL.
export async function GET() {
  const sheetURL = 'https://opensheet.elk.sh/1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo/Advisor_Output';

  try {
    const response = await fetch(sheetURL, {
      // Vercel recommends setting revalidation time for server-side fetches.
      // This will cache the data for 10 seconds.
      next: { revalidate: 10 }, 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from opensheet.elk.sh: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in /api/advisor-output:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch advisor output data.', details: (error as Error).message },
      { status: 500 }
    );
  }
}