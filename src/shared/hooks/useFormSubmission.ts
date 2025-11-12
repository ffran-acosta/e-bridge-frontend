"use client";

import { useState } from "react";
import { toast } from "sonner";

interface UseFormSubmissionOptions<T> {
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useFormSubmission<T>({
  onSubmit,
  onSuccess,
  onError,
  successMessage = "Operación exitosa",
  errorMessage = "Error en la operación"
}: UseFormSubmissionOptions<T>) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: T) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success(successMessage);
      onSuccess?.(data);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : errorMessage;
      toast.error(errorMsg);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
}
