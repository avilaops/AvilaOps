"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { trackEvent, trackException } from "@/lib/telemetry";

type HistoryEntry = {
    id: string;
    input?: string;
    output: string | string[];
    type: "system" | "user" | "error";
};

interface InteractiveTerminalProps {
    services: { name: string; description: string }[];
    stack: string[];
    cases: { company: string; challenge: string; solution: string; result: string }[];
}

const COMMANDS = ["help", "services", "stack", "cases", "contact", "ask", "lang", "clear"] as const;
type Command = (typeof COMMANDS)[number];

type Language = "pt" | "en" | "es" | "de" | "ja" | "zh" | "ru";

const LANGUAGE_NAMES: Record<Language, string> = {
    pt: "Português",
    en: "English",
    es: "Español",
    de: "Deutsch",
    ja: "日本語",
    zh: "中文",
    ru: "Русский",
};

const MESSAGES = {
    pt: {
        welcome: "Digite 'help' para começar.",
        help: "Comandos disponíveis",
        langChanged: (lang: string) => `Idioma alterado para ${lang}. AI responderá em ${lang}.`,
        langUsage: "Uso: lang <idioma> | Idiomas: pt, en, es, de, ja, zh, ru",
    },
    en: {
        welcome: "Type 'help' to get started.",
        help: "Available commands",
        langChanged: (lang: string) => `Language changed to ${lang}. AI will respond in ${lang}.`,
        langUsage: "Usage: lang <language> | Languages: pt, en, es, de, ja, zh, ru",
    },
    es: {
        welcome: "Escribe 'help' para comenzar.",
        help: "Comandos disponibles",
        langChanged: (lang: string) => `Idioma cambiado a ${lang}. IA responderá en ${lang}.`,
        langUsage: "Uso: lang <idioma> | Idiomas: pt, en, es, de, ja, zh, ru",
    },
    de: {
        welcome: "Geben Sie 'help' ein, um zu beginnen.",
        help: "Verfügbare Befehle",
        langChanged: (lang: string) => `Sprache auf ${lang} geändert. KI antwortet auf ${lang}.`,
        langUsage: "Verwendung: lang <sprache> | Sprachen: pt, en, es, de, ja, zh, ru",
    },
    ja: {
        welcome: "'help' と入力して開始します。",
        help: "利用可能なコマンド",
        langChanged: (lang: string) => `言語を${lang}に変更しました。AIは${lang}で応答します。`,
        langUsage: "使い方: lang <言語> | 言語: pt, en, es, de, ja, zh, ru",
    },
    zh: {
        welcome: "输入 'help' 开始。",
        help: "可用命令",
        langChanged: (lang: string) => `语言已更改为${lang}。AI将用${lang}回复。`,
        langUsage: "用法: lang <语言> | 语言: pt, en, es, de, ja, zh, ru",
    },
    ru: {
        welcome: "Введите 'help', чтобы начать.",
        help: "Доступные команды",
        langChanged: (lang: string) => `Язык изменён на ${lang}. ИИ будет отвечать на ${lang}.`,
        langUsage: "Использование: lang <язык> | Языки: pt, en, es, de, ja, zh, ru",
    },
};

export function InteractiveTerminal({
    services,
    stack,
    cases,
}: Readonly<InteractiveTerminalProps>) {
    const [language, setLanguage] = useState<Language>(() => {
        // Detect browser language or load from localStorage
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("terminal-language");
            if (saved && saved in LANGUAGE_NAMES) return saved as Language;
            const browserLang = navigator.language.split("-")[0];
            if (browserLang in LANGUAGE_NAMES) return browserLang as Language;
        }
        return "pt";
    });

    const [history, setHistory] = useState<HistoryEntry[]>(() => [
        {
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `entry-${Date.now()}`,
            output: MESSAGES[language].welcome,
            type: "system",
        },
    ]);
    const [input, setInput] = useState("");
    const [show, setShow] = useState(true);
    const [userId] = useState(() => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return `user-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    });
    const [isAILoading, setIsAILoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus terminal on mount
    useEffect(() => { inputRef.current?.focus(); }, []);

    const pushHistory = useCallback((entry: Omit<HistoryEntry, "id">) => {
        const id = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `entry-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        setHistory(h => [...h, { id, ...entry }]);
    }, []);

    const execute = useCallback(
        async (raw: string) => {
            const trimmed = raw.trim();
            if (!trimmed) return;

            // Handle 'ask' command with arguments
            if (trimmed.toLowerCase().startsWith("ask ")) {
                const question = trimmed.slice(4).trim();
                if (!question) {
                    pushHistory({ input: raw, output: raw, type: "user" });
                    pushHistory({
                        output: "Usage: ask <your question>",
                        type: "error",
                    });
                    return;
                }

                pushHistory({ input: raw, output: raw, type: "user" });
                pushHistory({
                    output: "🤖 Thinking...",
                    type: "system",
                });

                setIsAILoading(true);
                const aiStartTime = Date.now();

                try {
                    trackEvent('Terminal_AI_Ask', {
                        language,
                        questionLength: question.length
                    });

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

                    const response = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            message: question,
                            userId,
                            conversationId: "terminal",
                            language,
                        }),
                        signal: controller.signal,
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        const error = await response.json();
                        pushHistory({
                            output: `AI Error: ${error.error || "Failed to get response"}`,
                            type: "error",
                        });
                        trackEvent('Terminal_AI_Error', {
                            error: error.error,
                            statusCode: response.status
                        });
                        return;
                    }

                    const data = await response.json();
                    const duration = Date.now() - aiStartTime;

                    pushHistory({
                        output: data.message,
                        type: "system",
                    });

                    trackEvent('Terminal_AI_Success', {
                        language,
                        duration,
                        tokens: data.usage?.total_tokens
                    });
                } catch (error) {
                    const err = error instanceof Error ? error : new Error('Unknown error');
                    const isTimeout = err.name === 'AbortError';
                    const errorMessage = isTimeout
                        ? 'Request timeout - AI took too long to respond'
                        : `Network Error: ${err.message || "Failed to reach AI"}`;

                    pushHistory({
                        output: errorMessage,
                        type: "error",
                    });
                    trackException(err, {
                        context: 'Terminal_AI_Request',
                        isTimeout
                    });
                } finally {
                    setIsAILoading(false);
                }

                return;
            }

            // Handle 'lang' command with arguments
            if (trimmed.toLowerCase().startsWith("lang ")) {
                const newLang = trimmed.slice(5).trim().toLowerCase();
                pushHistory({ input: raw, output: raw, type: "user" });

                if (!(newLang in LANGUAGE_NAMES)) {
                    pushHistory({
                        output: MESSAGES[language].langUsage,
                        type: "error",
                    });
                    return;
                }

                const lang = newLang as Language;
                setLanguage(lang);
                localStorage.setItem("terminal-language", lang);

                trackEvent('Terminal_Language_Changed', {
                    from: language,
                    to: lang
                });

                pushHistory({
                    output: MESSAGES[lang].langChanged(LANGUAGE_NAMES[lang]),
                    type: "system",
                });
                return;
            }

            // Regular commands
            const cmd = trimmed.toLowerCase();
            pushHistory({ input: raw, output: raw, type: "user" });

            if (!COMMANDS.includes(cmd as Command)) {
                pushHistory({ output: `Command not found: ${cmd}`, type: "error" });
                return;
            }

            switch (cmd as Command) {
                case "help":
                    pushHistory({
                        output: [
                            `${MESSAGES[language].help}:`,
                            "  help             Show this help",
                            "  services         List core services",
                            "  stack            Show technology stack",
                            "  cases            List success cases",
                            "  contact          Show contact info",
                            "  ask <question>   Ask AI assistant (DevOps/Cloud/Azure)",
                            `  lang <code>      Change language (${Object.keys(LANGUAGE_NAMES).join(", ")})`,
                            "  clear            Clear terminal",
                        ],
                        type: "system",
                    });
                    break;
                case "services":
                    pushHistory({
                        output: services.map(s => `- ${s.name}: ${s.description}`),
                        type: "system"
                    });
                    break;
                case "stack":
                    pushHistory({ output: stack.map(t => `* ${t}`), type: "system" });
                    break;
                case "cases":
                    pushHistory({
                        output: cases.map(c => `> ${c.company}: ${c.challenge} -> ${c.result}`),
                        type: "system"
                    });
                    break;
                case "contact":
                    pushHistory({
                        output: [
                            "Contact options:",
                            "  email: contato@avilaops.com",
                            "  linkedin: /linkedin",
                            "  schedule: ./schedule-consultation"
                        ],
                        type: "system"
                    });
                    break;
                case "clear":
                    setHistory([]);
                    pushHistory({ output: "Terminal cleared.", type: "system" });
                    break;
            }
        },
        [cases, services, stack, pushHistory, userId, language],
    ); const handleKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            execute(input);
            setInput("");
        } else if (e.key === "Tab") {
            e.preventDefault();
            {
                const filtered = COMMANDS.filter(c => c.startsWith(input.toLowerCase()));
                if (!filtered.length) return;
                const currentIndex = filtered.indexOf(input as Command);
                const next = currentIndex === -1 ? 0 : (currentIndex + 1) % filtered.length;
                setInput(filtered[next]);
            }
        } else if (e.key === "Escape") {
            setShow(false);
        }
    }, [execute, input]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 max-w-4xl mx-auto mt-10 mb-24"
        >
            <div className="bg-terminal-bg/60 backdrop-blur border border-terminal-border rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <button
                        onClick={() => setShow(s => !s)}
                        className="px-2 py-0.5 rounded bg-dark-800 text-light/60 hover:text-primary transition-colors"
                    >
                        {show ? "hide" : "show"}
                    </button>
                </div>
                {show && (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
                        {history.map(entry => (
                            <div key={entry.id} className="whitespace-pre-wrap leading-relaxed">
                                {entry.input && (
                                    <div className="text-primary">[ávila@ops ~]$ {entry.input}</div>
                                )}
                                {Array.isArray(entry.output) ? (
                                    entry.output.map(line => (
                                        <div key={line} className={entry.type === "error" ? "text-red-400" : "text-light/80"}>{line}</div>
                                    ))
                                ) : (
                                    <div className={entry.type === "error" ? "text-red-400" : "text-light/70"}>{entry.output}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-primary">[ávila@ops ~]$</span>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value.slice(0, 120))}
                        onKeyDown={handleKey}
                        placeholder="type a command... (help)"
                        className="flex-1 bg-dark-900 border border-terminal-border rounded px-2 py-1 outline-none focus:border-primary text-light text-xs"
                    />
                </div>
                <div className="mt-2 text-[10px] text-light/40">tab = autocomplete | esc = hide | clear = reset history</div>
            </div>
        </motion.div>
    );
}

export default InteractiveTerminal;
