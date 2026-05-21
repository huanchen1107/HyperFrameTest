import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const ITEMS = [
  {
    rank: 3,
    label: "BRONZE",
    title: "GitHub Copilot",
    words: ["Autocomplete", "code", "in", "real-time", "with", "AI."],
    tagline: "Best for developers",
    bar: 72,
    color: "#cd7f32",
    startFrame: 60,
  },
  {
    rank: 2,
    label: "SILVER",
    title: "Claude AI",
    words: ["Deep", "reasoning,", "long", "context,", "safe", "outputs."],
    tagline: "Best for research & writing",
    bar: 88,
    color: "#c0c0c0",
    startFrame: 180,
  },
  {
    rank: 1,
    label: "GOLD",
    title: "ChatGPT",
    words: ["The", "world's", "most", "versatile", "AI", "assistant."],
    tagline: "Best overall",
    bar: 97,
    color: "#ffd700",
    startFrame: 315,
  },
];

// ─── Typewriter Word Reveal ───────────────────────────────────────────────────
const TypewriterWords: React.FC<{
  words: string[];
  startFrame: number;
  color: string;
}> = ({ words, startFrame, color }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline" }}>
      {words.map((word, i) => {
        const wordStart = startFrame + 12 + i * 6;
        const wordProgress = interpolate(frame, [wordStart, wordStart + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const charCount = Math.floor(wordProgress * word.length);
        const visible = frame >= wordStart - 2;

        return (
          <span
            key={i}
            style={{
              fontFamily: "'Courier New', 'Courier', monospace",
              fontSize: 26,
              fontWeight: 700,
              color: i === words.length - 1 ? color : "rgba(255,255,255,0.9)",
              opacity: visible ? 1 : 0,
              letterSpacing: 1,
            }}
          >
            {visible ? word.slice(0, charCount) || "\u00A0" : ""}
            {/* Blinking cursor on the last actively-typing word */}
            {visible && charCount < word.length && (
              <span
                style={{
                  opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                  color,
                }}
              >
                |
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

// ─── Animated Score Bar ───────────────────────────────────────────────────────
const ScoreBar: React.FC<{
  score: number;
  color: string;
  startFrame: number;
}> = ({ score, color, startFrame }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [startFrame + 8, startFrame + 50], [0, score / 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scoreDisplay = Math.floor(interpolate(frame, [startFrame + 8, startFrame + 50], [0, score], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
      {/* Track */}
      <div
        style={{
          flex: 1,
          height: 6,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: `linear-gradient(to right, ${color}88, ${color})`,
            borderRadius: 3,
            boxShadow: `0 0 12px ${color}`,
            transition: "none",
          }}
        />
      </div>
      {/* Score number */}
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: 22,
          color,
          minWidth: 44,
          textAlign: "right",
        }}
      >
        {scoreDisplay}
      </div>
    </div>
  );
};

// ─── Single Item Card ─────────────────────────────────────────────────────────
const NewsItem: React.FC<{ item: (typeof ITEMS)[0]; yPos: number }> = ({
  item,
  yPos,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sc = spring({
    frame: frame - item.startFrame,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  const x = interpolate(sc, [0, 1], [-60, 0]);
  const opacity = interpolate(sc, [0, 0.4], [0, 1]);

  // Vertical line grows downward
  const lineH = interpolate(frame, [item.startFrame, item.startFrame + 30], [0, 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < item.startFrame - 5) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 160,
        right: 160,
        top: yPos,
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        gap: 28,
      }}
    >
      {/* Left accent — rank + growing line */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          minWidth: 80,
        }}
      >
        {/* Rank circle */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: `3px solid ${item.color}`,
            boxShadow: `0 0 24px ${item.color}88`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `${item.color}18`,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: 28,
              color: item.color,
              textShadow: `0 0 12px ${item.color}`,
            }}
          >
            {item.rank}
          </span>
        </div>

        {/* Growing vertical connector */}
        <div
          style={{
            width: 2,
            height: lineH,
            background: `linear-gradient(to bottom, ${item.color}88, transparent)`,
            marginTop: 4,
          }}
        />
      </div>

      {/* Right: content block */}
      <div style={{ flex: 1 }}>
        {/* Label badge */}
        <div
          style={{
            display: "inline-block",
            backgroundColor: `${item.color}22`,
            border: `1px solid ${item.color}66`,
            borderRadius: 4,
            padding: "2px 12px",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              color: item.color,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 48,
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: -1,
            marginBottom: 10,
          }}
        >
          {item.title}
        </div>

        {/* Typewriter description */}
        <TypewriterWords
          words={item.words}
          startFrame={item.startFrame}
          color={item.color}
        />

        {/* Score bar */}
        <ScoreBar
          score={item.bar}
          color={item.color}
          startFrame={item.startFrame}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.35)",
            marginTop: 6,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {item.tagline}
        </div>
      </div>
    </div>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────────────
export const Top3Typewriter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSc = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });

  // Animated ticker text scrolling left
  const tickerX = interpolate(frame, [0, 450], [0, -800]);

  const TICKER_TEXT =
    "  ⚡ AI RANKINGS 2025  •  TOP 3 TOOLS  •  VOTED BY 10K+ DEVELOPERS  •  UPDATED WEEKLY  •  ";

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #050a12 0%, #0b1220 60%, #060d18 100%)",
        overflow: "hidden",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Subtle dot grid background */}
      <svg
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.04 }}
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill="#ffffff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Top ticker bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 44,
          backgroundColor: "#ffd700",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            transform: `translateX(${tickerX}px)`,
            whiteSpace: "nowrap",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: 15,
            color: "#000",
            letterSpacing: 2,
          }}
        >
          {TICKER_TEXT.repeat(6)}
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 160,
          right: 160,
          opacity: headerSc,
          transform: `translateY(${interpolate(headerSc, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 4,
          }}
        >
          {/* Live indicator dot */}
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ff3333",
              boxShadow: `0 0 ${Math.sin(frame * 0.15) * 6 + 8}px #ff3333`,
            }}
          />
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "#ff3333",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            LIVE RANKING
          </span>
        </div>

        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 64,
            color: "#ffffff",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          Top 3 AI Tools
          <span style={{ color: "#ffd700" }}> 2025</span>
        </div>

        {/* Horizontal rule */}
        <div
          style={{
            marginTop: 16,
            height: 2,
            background:
              "linear-gradient(to right, #ffd700, rgba(255,215,0,0.1) 60%, transparent)",
          }}
        />
      </div>

      {/* Items */}
      {[...ITEMS].reverse().map((item, i) => (
        <NewsItem key={item.rank} item={item} yPos={232 + i * 230} />
      ))}

      {/* Bottom bar CTA */}
      {frame >= 410 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: "rgba(255,215,0,0.1)",
            borderTop: "1px solid rgba(255,215,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            opacity: interpolate(frame, [410, 430], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {["🔔 Follow", "❤️ Like", "💾 Save", "🔁 Share"].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 18,
                color: "#ffd700",
                letterSpacing: 1,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 55%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
