"use client";

import { Button, useDocumentInfo } from "@payloadcms/ui";
import { useState } from "react";

type GeneratedAccess = {
  generatedAt: string;
  login: string;
  password: string;
};

export function ClientAccessGenerator() {
  const { data, id, isEditing, setData } = useDocumentInfo();
  const [generatedAccess, setGeneratedAccess] = useState<GeneratedAccess | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const canGenerate = Boolean(isEditing && id);

  async function generateAccess() {
    if (!canGenerate || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/client-access/generate", {
        body: JSON.stringify({ id }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as Partial<GeneratedAccess> & { error?: string };

      if (!response.ok || !result.login || !result.password || !result.generatedAt) {
        throw new Error(result.error || "Не удалось сгенерировать доступ");
      }

      const nextAccess = {
        generatedAt: result.generatedAt,
        login: result.login,
        password: result.password,
      };

      setGeneratedAccess(nextAccess);
      setData({
        ...(data || {}),
        accessEnabled: true,
        accessGeneratedAt: nextAccess.generatedAt,
        login: nextAccess.login,
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Не удалось сгенерировать доступ");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyAccess() {
    if (!generatedAccess) {
      return;
    }

    await navigator.clipboard.writeText(
      `Логин: ${generatedAccess.login}\nПароль: ${generatedAccess.password}`,
    );
    setCopied(true);
  }

  return (
    <div style={{ display: "grid", gap: 12, marginBlock: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button
          buttonStyle="primary"
          disabled={!canGenerate || isLoading}
          onClick={generateAccess}
          size="medium"
          type="button"
        >
          {isLoading ? "Генерирую..." : "Сгенерировать логин и пароль"}
        </Button>
        {generatedAccess ? (
          <Button buttonStyle="secondary" onClick={copyAccess} size="medium" type="button">
            {copied ? "Скопировано" : "Скопировать"}
          </Button>
        ) : null}
      </div>
      {!canGenerate ? (
        <p style={{ margin: 0 }}>Сначала сохраните карточку клиента, потом можно сгенерировать доступ.</p>
      ) : null}
      {error ? <p style={{ color: "#c62828", margin: 0 }}>{error}</p> : null}
      {generatedAccess ? (
        <div
          style={{
            background: "#f6f7f9",
            border: "1px solid #d9dce3",
            borderRadius: 8,
            display: "grid",
            gap: 6,
            maxWidth: 520,
            padding: 14,
          }}
        >
          <strong>Передайте клиенту эти данные:</strong>
          <code>Логин: {generatedAccess.login}</code>
          <code>Пароль: {generatedAccess.password}</code>
        </div>
      ) : null}
    </div>
  );
}
