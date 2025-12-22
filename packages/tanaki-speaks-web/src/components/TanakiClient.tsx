import { SoulEngineProvider } from "@opensouls/react";
import { useProgress } from "@react-three/drei";
import { Box, Flex, Text, VisuallyHidden } from "@radix-ui/themes";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Scene } from "@/components/3d";
import { Avatar } from "@/components/3d/Avatar";
import { BackgroundScene } from "@/components/3d/BackgroundScene";

import { ChatInput } from "@/components/ChatInput";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { TanakiAudio, type TanakiAudioHandle } from "@/components/TanakiAudio";

import { useTanakiSoul } from "@/hooks/useTanakiSoul";
import { base64ToUint8 } from "@/utils/base64";

/* -------------------------------------------------- */
/* Utils */
/* -------------------------------------------------- */

function readBoolEnv(value: unknown, fallback: boolean): boolean {
  if (typeof value !== "string") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

/* -------------------------------------------------- */
/* Client Wrapper */
/* -------------------------------------------------- */

export default function TanakiClient() {
  const organization = "local";
  const local = readBoolEnv(import.meta.env.VITE_SOUL_ENGINE_LOCAL, false);

  const getWebSocketUrl =
    typeof window === "undefined"
      ? undefined
      : (org: string, _local: boolean, debug: boolean) => {
          const ws = window.location.protocol === "https:" ? "wss" : "ws";
          const channel = debug ? "debug-chat" : "experience";
          return `${ws}://${window.location.host}/ws/soul/${org}/${channel}`;
        };

  return (
    <SoulEngineProvider
      organization={organization}
      local={local}
      getWebSocketUrl={getWebSocketUrl}
    >
      <TanakiExperience />
    </SoulEngineProvider>
  );
}

/* -------------------------------------------------- */
/* Main Experience */
/* -------------------------------------------------- */

function TanakiExperience() {
  const { connected, events, send, soul, connectedUsers } = useTanakiSoul();

  const audioRef = useRef<TanakiAudioHandle | null>(null);
  const unlockedOnceRef = useRef(false);
  const lastSpokenIdRef = useRef<string | null>(null);
  const activeTtsStreamIdRef = useRef<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [mouthOpen, setMouthOpen] = useState(0);
  const [overlayHeight, setOverlayHeight] = useState(220);
  const [liveText, setLiveText] = useState("");

  const unlockOnce = useCallback(() => {
    if (unlockedOnceRef.current) return;
    unlockedOnceRef.current = true;
    void audioRef.current?.unlock();
  }, []);

  const status = useMemo(() => (connected ? "🟢" : "🔴"), [connected]);

  /* -------------------------------------------------- */
  /* Live text (ARIA) */
  /* -------------------------------------------------- */

  useEffect(() => {
    const latest = [...events]
      .reverse()
      .find((e) => e._kind === "interactionRequest" && e.action === "says");

    if (!latest) return;
    if (lastSpokenIdRef.current === latest._id) return;

    lastSpokenIdRef.current = latest._id;
    setLiveText(latest.content);
  }, [events]);

  /* -------------------------------------------------- */
  /* TTS audio stream */
  /* -------------------------------------------------- */

  useEffect(() => {
    const onChunk = (evt: any) => {
      const data = evt?.data;
      if (!data?.streamId || !data?.chunkBase64) return;

      if (activeTtsStreamIdRef.current !== data.streamId) {
        activeTtsStreamIdRef.current = data.streamId;
        audioRef.current?.interrupt();
      }

      const bytes = base64ToUint8(data.chunkBase64);
      audioRef.current?.enqueuePcm16(bytes);
    };

    const onComplete = (evt: any) => {
      if (activeTtsStreamIdRef.current === evt?.data?.streamId) {
        activeTtsStreamIdRef.current = null;
      }
    };

    soul.on("ephemeral:audio-chunk", onChunk);
    soul.on("ephemeral:audio-complete", onComplete);

    return () => {
      soul.off("ephemeral:audio-chunk", onChunk);
      soul.off("ephemeral:audio-complete", onComplete);
    };
  }, [soul]);

  /* -------------------------------------------------- */
  /* Overlay height for bubbles */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (!overlayRef.current) return;

    const update = () => {
      const rect = overlayRef.current!.getBoundingClientRect();
      setOverlayHeight(Math.max(120, rect.height + 10));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(overlayRef.current);

    return () => ro.disconnect();
  }, []);

  /* -------------------------------------------------- */
  /* Render */
  /* -------------------------------------------------- */

  return (
    <div
      style={{ height: "100dvh", width: "100%", position: "relative" }}
      onPointerDownCapture={unlockOnce}
      onTouchStartCapture={unlockOnce}
    >
      <ModelLoadingOverlay />

      {/* 🎥 3D Scene */}
      <Scene
        showControls={false}
        camera={{ position: [0, 1.6, 6], fov: 35 }}
        lookAt={[0, 1.3, 0]}
      >
        <Suspense fallback={null}>
          <BackgroundScene rotation={[0, Math.PI / 2, 0]} />
        </Suspense>

        <Avatar position={[0, 0, 0]} scale={1.1} mouthOpen={mouthOpen} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
      </Scene>

      {/* 🔊 Audio */}
      <TanakiAudio
        ref={audioRef}
        enabled
        onVolumeChange={(volume) => {
          const v = Math.min(1, volume * 1.6);
          setMouthOpen((p) => p * 0.6 + v * 0.4);
        }}
      />

      {/* 💬 Floating bubbles */}
      <FloatingBubbles events={events} avoidBottomPx={overlayHeight} />

      {/* 🧾 UI Overlay (UNCHANGED) */}
      <Box
        ref={overlayRef}
        className="absolute left-4 right-4 bottom-4 max-w-2xl mx-auto"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(10px)",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <Flex justify="between" align="center">
          <Flex gap="2">
            <Text size="2">{status}</Text>
            {connectedUsers > 0 && (
              <Text size="1" color="gray">
                {connectedUsers} here
              </Text>
            )}
          </Flex>
          <Text size="2" color="gray">
            tanaki
          </Text>
        </Flex>

        <VisuallyHidden>
          <div aria-live="polite">{liveText}</div>
        </VisuallyHidden>

        <ChatInput
          onUserGesture={unlockOnce}
          onSend={async (text) => {
            unlockOnce();
            await send(text);
          }}
        />
      </Box>
    </div>
  );
}

/* -------------------------------------------------- */
/* Loader Overlay */
/* -------------------------------------------------- */

function ModelLoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active || progress >= 100) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <Box
        style={{
          width: "min(520px, 92vw)",
          background: "rgba(0,0,0,0.72)",
          borderRadius: 14,
          padding: 16,
          backdropFilter: "blur(10px)",
        }}
      >
        <Flex justify="between">
          <Text size="2" color="gray">
            Loading 3D model…
          </Text>
          <Text size="2" color="gray">
            {Math.round(progress)}%
          </Text>
        </Flex>
      </Box>
    </div>
  );
}
