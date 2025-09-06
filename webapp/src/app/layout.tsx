import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BJJ Pose Trainer MVP",
  description: "Brazilian Jiu-Jitsu pose training application with real-time pose detection using MediaPipe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
