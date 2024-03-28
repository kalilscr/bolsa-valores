"use client";

import { Navbar } from "flowbite-react";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function DefaultNavbar() {
  const pathname = usePathname();
  const params = useParams();

  return (
    <Navbar rounded className="flex items-center justify-around">
      <Navbar.Brand href="https://flowbite-react.com">
        <Image
          className="mr-3 h-6 sm:h-9"
          alt="Bear N' Bull Market"
          src="/logo.png"
          width={50}
          height={40}
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        Bear N Bull Market
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          active={pathname === `/${params.wallet_id}`}
          as={Link}
          href={`/${params.wallet_id}`}
        >
          Home
        </Navbar.Link>
        <Navbar.Link href="#">Ativos</Navbar.Link>
      </Navbar.Collapse>
      <div className="flex md:order-2 text-white">Olá {params.wallet_id}</div>
    </Navbar>
  );
}