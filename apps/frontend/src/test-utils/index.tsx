/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { PropsWithChildren, ReactNode } from "react";

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
  },
});

export const renderWithProviders = (component: ReactNode) => {
  return render(<QueryClientProvider client={defaultQueryClient}>{component}</QueryClientProvider>);
};

export const TestProviders = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={defaultQueryClient}>{children}</QueryClientProvider>;
};
