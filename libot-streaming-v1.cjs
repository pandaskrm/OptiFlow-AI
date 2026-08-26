const fs = require("fs");

const serverPath = "app/api/assistant/chat/route.ts";
const clientPath = "components/OptiFlowAssistant.tsx";

let server = fs.readFileSync(serverPath, "utf8");
let client = fs.readFileSync(clientPath, "utf8");

/* =========================================================
   SERVEUR
   ========================================================= */

const serverStart =
`    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: \`${"${OPTIFLOW_PERSONALITY}"}
${"${LIBOT_BRAIN_V2}"}
${"${SYSTEM_PROMPT}"}
${"${MORNING_BRIEF}"}
${"${RECEPTION_WORKFLOW}"}\\n${"${OPTIONAL_RECEPTION_FIELDS}"}\\n${"${context}"}\`,
      input: modelMessages,
    });`;

if (!server.includes(serverStart)) {
  throw new Error("Bloc OpenAI serveur introuvable. Aucun fichier modifie.");
}

server = server.replace(
  serverStart,
`    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: \`${"${OPTIFLOW_PERSONALITY}"}
${"${LIBOT_BRAIN_V2}"}
${"${SYSTEM_PROMPT}"}
${"${MORNING_BRIEF}"}
${"${RECEPTION_WORKFLOW}"}\\n${"${OPTIONAL_RECEPTION_FIELDS}"}\\n${"${context}"}\`,
      input: modelMessages,
      stream: true,
    });`
);

const oldServerTail =
`    const libotOpenAiMs = Date.now() - libotStartedAt;

    const instructionPayload = \`${"${OPTIFLOW_PERSONALITY}"}
${"${LIBOT_BRAIN_V2}"}
${"${SYSTEM_PROMPT}"}
${"${MORNING_BRIEF}"}
${"${RECEPTION_WORKFLOW}"}
${"${OPTIONAL_RECEPTION_FIELDS}"}
${"${context}"}\`;

    console.log("[LIBOT PERF]", {
      openAiMs: libotOpenAiMs,
      instructionChars: instructionPayload.length,
      messageCount: modelMessages.length,
      simulationChars: JSON.stringify(body.simulationState ?? null).length,
      warehouseSummaryChars: JSON.stringify(body.warehouseSummary ?? null).length,
      warehouseAnalysisChars: JSON.stringify(body.warehouseAnalysis ?? null).length,
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      return NextResponse.json(
        { error: "Le cerveau IA n'a retourné aucune réponse." },
        { status: 502 },
      );
    }

    const lower = safeMessages.at(-1)?.content.toLowerCase() ?? "";

    let action: string | null = null;

    const normalizedLower = lower
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "")
      .toLowerCase();

    const navigationRequested =
      /\\b(ouvre|ouvrir|affiche|afficher|montre|montrer|va|aller|emmene|emmener|accede|acceder)\\b/.test(
        normalizedLower,
      );

    if (navigationRequested) {
      if (
        normalizedLower.includes("dashboard") ||
        normalizedLower.includes("tableau de bord")
      ) {
        action = "/dashboard";
      } else if (normalizedLower.includes("reception")) {
        action = "/reception";
      } else if (
        normalizedLower.includes("expedition") ||
        normalizedLower.includes("shipping")
      ) {
        action = "/shipping";
      } else if (normalizedLower.includes("stock")) {
        action = "/stock";
      } else if (normalizedLower.includes("preparation")) {
        action = "/preparation";
      } else if (
        normalizedLower.includes("equipe") ||
        normalizedLower.includes("team")
      ) {
        action = "/team";
      } else if (
        normalizedLower.includes("parametre") ||
        normalizedLower.includes("erp")
      ) {
        action = "/parametres";
      } else if (
        normalizedLower.includes("direction") ||
        normalizedLower.includes("dirigeant")
      ) {
        action = "/executive";
      } else if (
        normalizedLower.includes("demo") ||
        normalizedLower.includes("demonstration")
      ) {
        action = "/demo";
      } else if (
        normalizedLower.includes("intelligence artificielle") ||
        normalizedLower === "ouvre ia" ||
        normalizedLower === "affiche ia"
      ) {
        action = "/ai";
      }
    }

return NextResponse.json({
  answer,
  action,
});`;

if (!server.includes(oldServerTail)) {
  throw new Error("Bloc final serveur introuvable. Aucun fichier modifie.");
}

const newServerTail =
`    const lower = safeMessages.at(-1)?.content.toLowerCase() ?? "";

    let action: string | null = null;

    const normalizedLower = lower
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "")
      .toLowerCase();

    const navigationRequested =
      /\\b(ouvre|ouvrir|affiche|afficher|montre|montrer|va|aller|emmene|emmener|accede|acceder)\\b/.test(
        normalizedLower,
      );

    if (navigationRequested) {
      if (
        normalizedLower.includes("dashboard") ||
        normalizedLower.includes("tableau de bord")
      ) {
        action = "/dashboard";
      } else if (normalizedLower.includes("reception")) {
        action = "/reception";
      } else if (
        normalizedLower.includes("expedition") ||
        normalizedLower.includes("shipping")
      ) {
        action = "/shipping";
      } else if (normalizedLower.includes("stock")) {
        action = "/stock";
      } else if (normalizedLower.includes("preparation")) {
        action = "/preparation";
      } else if (
        normalizedLower.includes("equipe") ||
        normalizedLower.includes("team")
      ) {
        action = "/team";
      } else if (
        normalizedLower.includes("parametre") ||
        normalizedLower.includes("erp")
      ) {
        action = "/parametres";
      } else if (
        normalizedLower.includes("direction") ||
        normalizedLower.includes("dirigeant")
      ) {
        action = "/executive";
      } else if (
        normalizedLower.includes("demo") ||
        normalizedLower.includes("demonstration")
      ) {
        action = "/demo";
      } else if (
        normalizedLower.includes("intelligence artificielle") ||
        normalizedLower === "ouvre ia" ||
        normalizedLower === "affiche ia"
      ) {
        action = "/ai";
      }
    }

    const instructionPayload = \`${"${OPTIFLOW_PERSONALITY}"}
${"${LIBOT_BRAIN_V2}"}
${"${SYSTEM_PROMPT}"}
${"${MORNING_BRIEF}"}
${"${RECEPTION_WORKFLOW}"}
${"${OPTIONAL_RECEPTION_FIELDS}"}
${"${context}"}\`;

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let answer = "";
        let firstTokenMs = null;

        try {
          for await (const event of response) {
            if (event.type === "response.output_text.delta") {
              const delta = event.delta || "";

              if (!delta) continue;

              if (firstTokenMs === null) {
                firstTokenMs = Date.now() - libotStartedAt;

                console.log("[LIBOT STREAM]", {
                  firstTokenMs,
                });
              }

              answer += delta;

              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "delta",
                    delta,
                  }) + "\\n",
                ),
              );
            }
          }

          const libotOpenAiMs = Date.now() - libotStartedAt;

          console.log("[LIBOT PERF]", {
            openAiMs: libotOpenAiMs,
            firstTokenMs,
            instructionChars: instructionPayload.length,
            messageCount: modelMessages.length,
            simulationChars: JSON.stringify(body.simulationState ?? null).length,
            warehouseSummaryChars: JSON.stringify(body.warehouseSummary ?? null).length,
            warehouseAnalysisChars: JSON.stringify(body.warehouseAnalysis ?? null).length,
          });

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "done",
                answer: answer.trim(),
                action,
              }) + "\\n",
            ),
          );

          controller.close();
        } catch (streamError) {
          console.error("Erreur streaming Libot :", streamError);

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "error",
                error: "Le streaming Libot a été interrompu.",
              }) + "\\n",
            ),
          );

          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });`;

server = server.replace(oldServerTail, newServerTail);

/* =========================================================
   CLIENT
   ========================================================= */

const clientStart =
`  const payload = await response.json();

  console.info(
    "[Libot] Réponse IA reçue en",
    Math.round(
      performance.now() - assistantStartedAt,
    ),
    "ms",
  );

  const CREATE_RECEPTION_COMMAND =`;

if (!client.includes(clientStart)) {
  throw new Error("Bloc JSON client introuvable. Aucun fichier modifie.");
}

const clientReplacement =
`  if (!response.ok || !response.body) {
    const errorPayload = await response.json().catch(() => null);

    throw new Error(
      errorPayload?.error ||
        "Le cerveau OptiFlow AI n'a pas pu répondre.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let streamedAnswer = "";
  let finalAction: string | null = null;
  let streamingMessageId: number | null = null;

  const ensureStreamingMessage = () => {
    if (streamingMessageId !== null) {
      return streamingMessageId;
    }

    streamingMessageId = Date.now() + 1;

    setMessages((current) => [
      ...current,
      {
        id: streamingMessageId!,
        author: "assistant",
        content: "",
      },
    ]);

    return streamingMessageId;
  };

  const updateStreamingMessage = (content: string) => {
    const id = ensureStreamingMessage();

    setMessages((current) =>
      current.map((message) =>
        message.id === id
          ? { ...message, content }
          : message,
      ),
    );
  };

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;

      const event = JSON.parse(line);

      if (event.type === "delta") {
        streamedAnswer += event.delta ?? "";
        updateStreamingMessage(streamedAnswer);
      }

      if (event.type === "done") {
        streamedAnswer =
          typeof event.answer === "string"
            ? event.answer
            : streamedAnswer;

        finalAction =
          typeof event.action === "string"
            ? event.action
            : null;
      }

      if (event.type === "error") {
        throw new Error(
          event.error || "Le streaming Libot a été interrompu.",
        );
      }
    }
  }

  console.info(
    "[Libot] Réponse IA streamée en",
    Math.round(
      performance.now() - assistantStartedAt,
    ),
    "ms",
  );

  const payload = {
    answer: streamedAnswer,
    action: finalAction,
  };

  const CREATE_RECEPTION_COMMAND =`;

client = client.replace(clientStart, clientReplacement);

const oldMessageInsert =
`  setMessages((current) => [...current, assistantMessage]);

  if (
    typeof payload.action === "string" &&`;

if (!client.includes(oldMessageInsert)) {
  throw new Error("Insertion finale message client introuvable.");
}

client = client.replace(
  oldMessageInsert,
`  if (streamingMessageId === null) {
    setMessages((current) => [...current, assistantMessage]);
  } else {
    setMessages((current) =>
      current.map((message) =>
        message.id === streamingMessageId
          ? assistantMessage
          : message,
      ),
    );
  }

  if (
    typeof payload.action === "string" &&`
);

fs.writeFileSync(serverPath, server, "utf8");
fs.writeFileSync(clientPath, client, "utf8");

console.log("OK - Streaming V1 applique.");
