import { MockApiProvider } from "@/test-utils/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {import.meta.env.DEV ? (
        <MockApiProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </MockApiProvider>
      ) : (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )}
    </>
  );
};
