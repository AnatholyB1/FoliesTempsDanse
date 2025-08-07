"use client";

import {ConvexReactClient} from "convex/react";
import {ReactNode} from "react";
import {useAuth} from "@clerk/nextjs";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {ConvexQueryClient} from "@convex-dev/react-query";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
    throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is not defined. Please set it in your environment variables."
    );
}

const convex = new ConvexReactClient(convexUrl);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryKeyHashFn: convexQueryClient.hashFn(),
            queryFn: convexQueryClient.queryFn(),
        },
    },
});
convexQueryClient.connect(queryClient);

export function ConvexClientProvider({children}: { children: ReactNode }) {
    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ConvexProviderWithClerk>
    );
}
