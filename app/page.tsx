"use client";
import { useEffect, useState } from "react";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useSendCalls,
} from "wagmi";
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
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const {
    sendCalls,
    data: callsId,
    error: callsError,
    isPending: isCallsPending,
  } = useSendCalls();

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
      dataSuffix: DATA_SUFFIX,
    });
  };

  const handleSendCalls = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const data = encodeFunctionData({
      abi: GUESTBOOK_ABI,
      functionName: "sign",
      args: [message],
    });

    sendCalls({
      calls: [
        {
          to: GUESTBOOK_ADDRESS,
          data: (data + DATA_SUFFIX.slice(2)) as `0x${string}`,
        },
      ],
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
            disabled={isPending || isConfirming || isCallsPending}
          />

          <button
            type="submit"
            disabled={
              !message.trim() || isPending || isConfirming || isCallsPending
            }
            className={styles.button}
          >
            {isPending || isConfirming
              ? "Signing..."
              : "Submit (writeContract)"}
          </button>

          <button
            type="button"
            onClick={handleSendCalls}
            disabled={
              !message.trim() || isPending || isConfirming || isCallsPending
            }
            className={styles.buttonSecondary}
          >
            {isCallsPending ? "Signing..." : "Submit (sendCalls)"}
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

        {callsId && (
          <div className={styles.success}>
            <p>Batch call submitted!</p>
            <p className={styles.callsId}>Call ID: {callsId.id}</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>Error: {error.message}</p>
          </div>
        )}

        {callsError && (
          <div className={styles.error}>
            <p>Error: {callsError.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
