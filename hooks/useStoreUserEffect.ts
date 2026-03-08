"use client";
import {useUser} from "@clerk/nextjs";
import {useConvexAuth} from "convex/react";
import {useEffect} from "react";
import {api} from "@/convex/_generated/api";
import {useMutation, useQuery} from "@tanstack/react-query";
import {convexQuery, useConvexMutation} from "@convex-dev/react-query";
import Cookies from "js-cookie";

export function useStoreUserEffect() {
    const {isLoading, isAuthenticated} = useConvexAuth();
    const {user} = useUser();
    const {mutate: storeUser, data: userID} = useMutation({mutationFn: useConvexMutation(api.users.store)});
    const {data : role } = useQuery({
        ...convexQuery(api.users.getRoleByCurrentUser, {}),
        enabled: isAuthenticated && userID !== null
    });

    useEffect(
        () => {
            if (role && role.role)
            {
                Cookies.set("user_role", role.role, {
                    expires: 1, // expire dans 1 jour
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax"
                });
            }
        },
        [role]
    )

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        storeUser({})
    }, [isAuthenticated, storeUser, user?.id]);

    return {
        isLoading: isLoading || (isAuthenticated && userID === null),
        isAuthenticated: isAuthenticated && userID !== null,
    };
}
