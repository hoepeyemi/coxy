import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Layout from "@/components/sections/layout";
import { EnvironmentStoreProvider } from "@/components/context";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Coxy | Domain Intelligence Platform",
  description: "Real-time Web3 domain analytics and market trends.",
  icons: {
    icon: [
      { url: "/coxy dora.png", sizes: "any" },
      { url: "/coxy dora.png", type: "image/png" },
    ],
    shortcut: "/coxy dora.png",
    apple: "/coxy dora.png",
  },
  openGraph: {
    title: "Coxy | Domain Intelligence Platform",
    description:
      "Real-time Web3 domain analytics and market trends.",
    images: ["/coxy dora.png"],
  },
  other: {
    "twitter:player": "https://coxy.onrender.com/embed",
    "x-frame-options": "ALLOWALL",
    "content-security-policy":
      "frame-ancestors 'self' https://twitter.com https://x.com;",
  },
  twitter: {
    card: "player",
    site: "https://x.com/CoxyDo1130",
    title: "Coxy | Domain Intelligence Platform",
    images: ["https://coxy-domain.onrender.com/coxy dora.png"],
    description:
      "Real-time Web3 domain analytics and market trends.",
    players: [
      {
        playerUrl: "https://coxy.onrender.com/embed",
        streamUrl: "https://coxy.onrender.com/embed",
        width: 360,
        height: 560,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EnvironmentStoreProvider>
      <html lang="en">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}
          >
            <Layout>{children}</Layout>
            <Toaster />
          </body>
        </ThemeProvider>
      </html>
    </EnvironmentStoreProvider>
  );
}
