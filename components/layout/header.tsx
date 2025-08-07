"use client";
import {Authenticated, Unauthenticated} from 'convex/react'
import {SignInButton, UserButton} from '@clerk/nextjs'


export default function Header() {
    return(
        <header className="max-h-20 flex items-center justify-between p-4 bg-primary rounded-t-lg shadow-lg">
        <h1 className="text-xl font-bold text-accent">FOLIES TEMPS DANSE</h1>
        <div className="flex items-center gap-4">
            <Unauthenticated>
                <SignInButton mode="modal">Sign In</SignInButton>
            </Unauthenticated>
            <Authenticated>
                <UserButton />
            </Authenticated>
        </div>
        </header>
    );
}
