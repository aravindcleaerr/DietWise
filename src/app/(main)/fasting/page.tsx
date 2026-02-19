"use client";

import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";
import { generateId } from "@/lib/calculations";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Play, Square, History, Clock } from "lucide-react";
import { toast } from "sonner";
import type { FastingSession } from "@/lib/types";

const PROTOCOLS = [
  { id: "16:8" as const, label: "16:8", fastHours: 16, eatHours: 8, description: "Most popular. Fast 16h, eat within 8h window." },
  { id: "18:6" as const, label: "18:6", fastHours: 18, eatHours: 6, description: "Intermediate. Fast 18h, eat within 6h window." },
  { id: "20:4" as const, label: "20:4", fastHours: 20, eatHours: 4, description: "Advanced. Fast 20h, eat within 4h window." },
];

function formatDuration(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function FastingPage() {
  const activeFasting = useStore((s) => s.activeFasting);
  const fastingSessions = useStore((s) => s.fastingSessions);
  const startFasting = useStore((s) => s.startFasting);
  const endFasting = useStore((s) => s.endFasting);

  const [now, setNow] = useState(Date.now());
  const [selectedProtocol, setSelectedProtocol] = useState<(typeof PROTOCOLS)[number]>(PROTOCOLS[0]);

  // Tick every second when fasting is active
  useEffect(() => {
    if (!activeFasting) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeFasting]);

  const elapsed = useMemo(() => {
    if (!activeFasting) return 0;
    return now - new Date(activeFasting.startTime).getTime();
  }, [activeFasting, now]);

  const totalFastMs = useMemo(() => {
    if (!activeFasting) return 0;
    return new Date(activeFasting.endTime).getTime() - new Date(activeFasting.startTime).getTime();
  }, [activeFasting]);

  const progressPct = totalFastMs > 0 ? Math.min(100, (elapsed / totalFastMs) * 100) : 0;
  const remaining = totalFastMs - elapsed;

  const handleStart = () => {
    const start = new Date();
    const end = new Date(start.getTime() + selectedProtocol.fastHours * 60 * 60 * 1000);

    const session: FastingSession = {
      id: generateId(),
      protocol: selectedProtocol.id,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      isActive: true,
    };

    startFasting(session);
    toast.success(`${selectedProtocol.label} fast started!`);
  };

  const handleEnd = () => {
    if (!activeFasting) return;
    endFasting(activeFasting.id);
    toast.success("Fast ended! Great job!");
  };

  const completedSessions = fastingSessions.filter((s) => !s.isActive).slice(-10).reverse();

  return (
    <div>
      <PageHeader title="Intermittent Fasting" subtitle="Track your fasting windows" />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {activeFasting ? (
          <>
            {/* Active Fast */}
            <Card className="border-primary">
              <CardContent className="pt-6 pb-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">{activeFasting.protocol} Fasting</div>

                {/* Circular progress */}
                <div className="relative w-48 h-48 mx-auto my-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                    <circle
                      cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6"
                      className="text-primary"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * (1 - progressPct / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {remaining > 0 ? (
                      <>
                        <div className="text-2xl font-bold tabular-nums">{formatDuration(remaining)}</div>
                        <div className="text-xs text-muted-foreground">remaining</div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-green-600">Done!</div>
                        <div className="text-xs text-muted-foreground">You can eat now</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground px-4 mb-4">
                  <div>
                    <div className="font-medium">Started</div>
                    <div>{formatTime(activeFasting.startTime)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Elapsed</div>
                    <div>{formatDuration(elapsed)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Ends</div>
                    <div>{formatTime(activeFasting.endTime)}</div>
                  </div>
                </div>

                <Button variant="destructive" onClick={handleEnd} className="w-full">
                  <Square className="h-4 w-4 mr-2" />
                  End Fast
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Protocol Selection */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Choose Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {PROTOCOLS.map((protocol) => (
                  <button
                    key={protocol.id}
                    onClick={() => setSelectedProtocol(protocol)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedProtocol.id === protocol.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">{protocol.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {protocol.fastHours}h fast / {protocol.eatHours}h eat
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{protocol.description}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Button className="w-full h-12 text-base" onClick={handleStart}>
              <Play className="h-5 w-5 mr-2" />
              Start {selectedProtocol.label} Fast
            </Button>
          </>
        )}

        {/* History */}
        {completedSessions.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Fasts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedSessions.map((session) => {
                const start = new Date(session.startTime);
                const end = new Date(session.actualEndTime || session.endTime);
                const durationMs = end.getTime() - start.getTime();
                return (
                  <div key={session.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{session.protocol}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(session.startTime)}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{formatDuration(durationMs)}</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-3">
            <h3 className="text-sm font-semibold mb-2">About Intermittent Fasting</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Intermittent fasting cycles between periods of eating and fasting. It can help with weight loss and metabolic health.</p>
              <p><strong>16:8</strong> is the best starting point — skip breakfast, eat from 12pm to 8pm.</p>
              <p><strong>Tip:</strong> Stay hydrated with water, green tea, or black coffee during fasting.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
