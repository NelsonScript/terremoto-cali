"use client";

import { useState } from "react";
import { isFirebaseConfigured, submitToFirestore } from "@/lib/firebase";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function useCrisisForm(coleccion: "reportes" | "voluntariado") {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function submit(data: Record<string, unknown>) {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      await submitToFirestore(coleccion, data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  return { status, errorMsg, submit, isFirebaseConfigured };
}
