"use client";
import { useEffect, useState } from "react";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Attribution } from "ox/erc8021";
import styles from "./page.module.css";

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

export default function Home() {
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  const [message, setMessage] = useState("");
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  useEffect(() => {
    if (isSuccess) {
      setMessage("");
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    writeContract({
      address: GUESTBOOK_ADDRESS,
      abi: GUESTBOOK_ABI,
      functionName: "sign",
      args: [message],
      dataSuffix: Attribution.toDataSuffix({
        codes: ["typeof.eth"],
      }),
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
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
            disabled={isPending || isConfirming}
          />

          <button
            type="submit"
            disabled={!message.trim() || isPending || isConfirming}
            className={styles.button}
          >
            {isPending || isConfirming ? "Signing..." : "Sign Guestbook"}
          </button>
        </form>

        {hash && (
          <div className={styles.feedback}>
            {isConfirming && (
              <p className={styles.pending}>Waiting for confirmation...</p>
            )}
            {isSuccess && (
              <div className={styles.success}>
                <p>Successfully signed the guestbook!</p>
                <a
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  View transaction
                </a>
              </div>
            )}
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
