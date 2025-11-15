"use client";
import { useUser } from "@/state/auth";
import { useSocketStore } from "@/state/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import io from "socket.io-client";
import "nprogress/nprogress.css";
import useApiHook from "@/state/useApi";
import PageLayout from "../page/Page.layout";
import { navigation } from "@/data/navigation";
import BillingSetup from "../billingSetup/BillingSetup.layout";
import PolicyCheckWrapper from "../policyCheckWrapper/PolicyCheckWrapper.layout";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

type Props = {
  children: React.ReactNode;
};
const AppWrapper = (props: Props) => {
  const queryClient = useQueryClient();
  //Set up state
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const { data: loggedInData, isLoading: userIsLoading } = useUser(token);
  const { selectedProfile, isLoading: profileIsLoading } = useSelectedProfile();
  //Set up socket connection
  const { socket, isConnecting, setSocket, setIsConnecting } = useSocketStore((state) => state);

  useEffect(() => {
    if (process.env.API_URL) {
      setIsConnecting(true);
      const socket = io(
        process.env.NODE_ENV === "development" ? "http://localhost:5000" : process.env.API_URL.replace("/api/v1", "")
      );
      socket.on("connect", () => {
        setIsConnecting(false);
        setSocket(socket);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    //If there is a user and a socket connection, setup a setup event with the user data

    if (socket && isConnecting) {
      // Listen for user updates
      socket.emit("setup", loggedInData);
      socket.on("updateUser", () => {
        queryClient.invalidateQueries(["user"] as any);
      });
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);
  return (
    <>
      {selectedProfile?.needsBillingSetup ? (
        <BillingSetup billingValidation={selectedProfile?.billingValidation} />
      ) : (
        <>
          <PolicyCheckWrapper>{props.children}</PolicyCheckWrapper>
        </>
      )}
    </>
  );
};

export default AppWrapper;
