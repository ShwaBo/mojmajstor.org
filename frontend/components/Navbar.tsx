"use client";

import Link from "next/link";
import { SignInButton, SignOutButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const { isSignedIn, isLoaded } = useAuth();

    return (
        <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo Left */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        MojMajstor
                    </span>
                </Link>

                {/* Auth Right */}
                <div className="flex items-center gap-4">
                    {isLoaded && !isSignedIn && (
                        <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                            <Button variant="default">Prijavi se</Button>
                        </SignInButton>
                    )}

                    {isLoaded && isSignedIn && (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <UserButton />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
