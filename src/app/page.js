"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ThemeProvider from "../components/ThemeProvider";
import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
