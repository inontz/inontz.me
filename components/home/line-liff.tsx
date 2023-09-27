
"use client";

import { liff } from "@line/liff";
import { useEffect, useState } from "react"

export type Status = "OnLoad" | "Initialized" | "SignedIn"


export default function LineLiff() {
    const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
    const [liffError, setLiffError] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string>('')
    const [status, setStatus] = useState<Status>("OnLoad")
    const login = () => {
        liffObject?.login({})
    }

    const logout = () => {
        liffObject?.logout()
    }

    useEffect(() => {
        // to avoid `window is not defined` error
        import("@line/liff")
        .then((liff) => liff.default)
        .then((liff) => {
            console.log("LIFF init...");
            liff
            .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
            .then(() => {
                console.log("LIFF init succeeded.");
                setLiffObject(liff);
                console.log("Checking login status...")
                if (liff.isLoggedIn()) {
                    setStatus("Initialized")
                }
            })
            .catch((error: Error) => {
                console.log("LIFF init failed.");
                setLiffError(error.toString());
            });
        });
    }, []);
    return (
        <>
            {status !== "Initialized" && (<>🤖 No user detected. Login to system please.</>)}
            {status == "Initialized" && (<>🤖 Welcome {displayName}</>)}
            {liffError && (
            <>
                <p>LIFF init failed.</p>
                <p>
                    <code>{liffError}</code>
                </p>
                </>
            )}
            
        </>
    )
}