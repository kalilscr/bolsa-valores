import { NextRequest, NextResponse } from "next/server";

//Server Components - 13
export async function GET(
  request: NextRequest,
  { params }: { params: { wallet_id: string } }
) {
  const response = await fetch(
    `http://localhost:3001/wallets/${params.wallet_id}/assets`,
    {
      //cache: 'no-store', processamento sempre dinamico
      next: {
        //revalidate: isHomeBrokerClosed() ? 60 * 60 : 5,
        revalidate: 1,
      },
    }
  );
  return NextResponse.json(await response.json());
}
