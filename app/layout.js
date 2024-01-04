import { AuthProvider } from "./Providers";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "temporary",
  description: "insert description here",
};

export default function RootLayout({ children }) {
  return (
    <>
    <html lang="ro" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/images/favicon.ico"/>
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
    </>
  );
}
