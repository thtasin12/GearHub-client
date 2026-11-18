import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/providers/app-provider";


export const metadata: Metadata = {
  title: {
    default: "GearHub - Rent Smarter. Build Bigger.",
    template: "%s | GearHub"
  },
  description: "Discover and rent quality equipment from trusted local owners across Bangladesh",
  applicationName: "GearHub"
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>

        <AppProvider>
        {children}
        </AppProvider>
      </body>
    </html>
  );
}
