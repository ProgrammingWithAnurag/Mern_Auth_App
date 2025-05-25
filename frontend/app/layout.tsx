import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientProvider from "@/hoc/ClientProvider";

const font = Roboto({
  weight: ["100","300","400", "500", "700","900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MERN Advanced Auth App",
  description: "My App Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
