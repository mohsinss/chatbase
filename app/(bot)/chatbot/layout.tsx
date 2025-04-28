import React from "react"
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
