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
    <html lang="ro" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
