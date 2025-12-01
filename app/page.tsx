"use client";
import { useEffect, useState } from "react";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useSendCalls } from "wagmi";
import { Attribution } from "ox/erc8021";
import { encodeFunctionData } from "viem";
import styles from "./page.module.css";
import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";

const GUESTBOOK_ADDRESS = "0x9805D57A15c014c6C18fE2D237cbB1784795CB1E";

const GUESTBOOK_ABI = [
  {
    inputs: [],
    name: "getEntries",
    outputs: [
      {
        components: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "string", name: "message", type: "string" },
        ],
        internalType: "struct GuestBook.Entry[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_message", type: "string" }],
    name: "sign",
    outputs: [
      {
        components: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "string", name: "message", type: "string" },
        ],
        internalType: "struct GuestBook.Entry",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["8021-guestbook"],
});

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  const [message, setMessage] = useState("");
  const {
    sendCalls,
    data: callsId,
    error,
    isPending,
  } = useSendCalls();

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  useEffect(() => {
    if (callsId) {
      setMessage("");
    }
  }, [callsId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendCalls({
      calls: [
        {
          to: GUESTBOOK_ADDRESS,
          data: encodeFunctionData({
            abi: GUESTBOOK_ABI,
            functionName: "sign",
            args: [message],
          }),
        },
      ],
      capabilities: {
        dataSuffix: DATA_SUFFIX,
      },
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet>
          <ConnectWallet />
          <WalletDropdown>
            <Identity>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <Address />
            <EthBalance />
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </header>

      <div className={styles.content}>
        <h1>ERC-8021 Guestbook</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave your message..."
            className={styles.textarea}
            rows={4}
            disabled={isPending}
          />

          <button
            type="submit"
            disabled={!message.trim() || isPending}
            className={styles.button}
          >
            {isPending ? "Signing..." : "Sign Guestbook"}
          </button>
        </form>

        {callsId && (
          <div className={styles.success}>
            <p>Successfully signed the guestbook!</p>
            <p className={styles.callsId}>Call ID: {callsId.id}</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>Error: {error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
