"use client";

import { redirect } from "next/navigation";
import { PageContent, PageTopNav } from "./components/mainContentUi";

export function loginValidation() {
  if (!localStorage.getItem("token")) {
    redirect("/login");
  }
}

export default function Home() {
  loginValidation();
  return (
    <>
      <PageTopNav />
      <PageContent />
    </>
  );
}
