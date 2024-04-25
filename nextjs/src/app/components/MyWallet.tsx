"use client";

import {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableHeadCell,
    TableRow,
  } from "../components/FlowbiteComponents";
  import { Asset, WalletAsset } from "../models";
  import Link from "next/link";
  import { fetcher } from "../utils";
  import useSWR from "swr";
  import useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription";

  export default function MyWallet(props: { wallet_id: string }) {
    //const walletAssets = await getWalletAssets(props.wallet_id);

    const {
      data: walletAssets,
      error,
      mutate: mutateWalletAssets,
    } = useSWR<WalletAsset[]>(
      `http://localhost:3000/api/wallets/${props.wallet_id}/assets`,
      fetcher,
      {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      }
    );

    const { data: assetChanged } = useSWRSubscription(
      `http://localhost:3000/assets/events`,
      (path, { next }: SWRSubscriptionOptions) => {
  
        const eventSource = new EventSource(path);
        eventSource.addEventListener("asset-price-changed", async (event) => {
          //console.log(event);
          const assetChanged: Asset = JSON.parse(event.data);
          await mutateWalletAssets((prev) => {
            const foundIndex = prev!.findIndex(
              (walletAsset) => walletAsset.asset_id === assetChanged.id
            );
  
            if (foundIndex !== -1) {
              prev![foundIndex].Asset.price = assetChanged.price;
            }
            //console.log(prev);
            return [...prev!];
          }, false);
          next(null, assetChanged);
        });
  
        eventSource.onerror = (event) => {
          console.error(event);
          eventSource.close();
        };
        return () => {
          //console.log("close event source");
          eventSource.close();
        };
      },
      {}
    );
  
    const {data: walletAssetUpdated} = useSWRSubscription(
      `http://localhost:3000/wallets/${props.wallet_id}/assets/events`,
      (path, { next }: SWRSubscriptionOptions) => {
        const eventSource = new EventSource(path);
  
        eventSource.addEventListener("wallet-asset-updated", async (event) => {
          const walletAssetUpdated: WalletAsset = JSON.parse(event.data);
          //console.log(walletAssetUpdated);
          await mutateWalletAssets((prev) => {
            const foundIndex = prev?.findIndex(
              (walletAsset) =>
                walletAsset.asset_id === walletAssetUpdated.asset_id
            );
            if (foundIndex !== -1) {
              //console.log('entrou aqui');
              prev![foundIndex!].shares = walletAssetUpdated.shares;
            }
  
            return [...prev!];
          }, false);
          next(null, walletAssetUpdated);
        });
        eventSource.onerror = (error) => {
          console.error(error);
          eventSource.close();
        };
        return () => {
          eventSource.close();
        };
      }
    );
  
    return (
      <Table>
        <TableHead>
          <TableHeadCell>Nome</TableHeadCell>
          <TableHeadCell>Preço R$</TableHeadCell>
          <TableHeadCell>Quant.</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Comprar/Vender</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {walletAssets!.map((walletAsset, key) => (
            <TableRow className="border-gray-700 bg-gray-800" key={key}>
              <TableCell className="whitespace-nowrap font-medium text-white">
                {walletAsset.Asset.id} ({walletAsset.Asset.symbol})
              </TableCell>
              <TableCell>{walletAsset.Asset.price}</TableCell>
              <TableCell>{walletAsset.shares}</TableCell>
              <TableCell>
                <Link
                  className="font-medium hover:underline text-cyan-500"
                  href={`/${props.wallet_id}/home-broker/${walletAsset.Asset.id}`}
                >
                  Comprar/Vender
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  //Server Components
  //Client Components

// server sent events(sse) - servidor envia eventos para o browser via http
//browser GET /events ---> server
//servidor envia header de conexao de longa duração 
//heaader: Connection: keep-alive
//header: Cache-Control: no-cache
// http - aba (dominio) - 6 conexoes simultaneas
// http2 - aba (dominio) - 100 conexoes simultaneas


// websocket tbm pode ser usado (mais caro em produção)