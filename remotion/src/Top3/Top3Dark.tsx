import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const ITEMS = [
  {
    rank: 3,
    title: "Claude AI",
    subtitle: "Best for long-form writing & code",
    color: "#00f5ff",
    bg: "rgba(0,245,255,0.08)",
    glow: "rgba(0,245,255,0.4)",
    startFrame: 70,
  },
  {
    rank: 2,
    title: "Cursor IDE",
    subtitle: "Best AI coding environment",
    color: "#bf5fff",
    bg: "rgba(191,95,255,0.08)",
    glow: "rgba(191,95,255,0.4)",
    startFrame: 160,
  },
  {
    rank: 1,
    title: "ChatGPT",
    subtitle: "Most versatile AI assistant",
    color: "#ff6b35",
    bg: "rgba(255,107,53,0.08)",
    glow: "rgba(255,107,53,0.5)",
    startFrame: 270,
  },
];

const NeonItem: React.FC<{
  item: (typeof ITEMS)[0];
  index: number;
}> = ({ item, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sc = spring({
    frame: frame - item.startFrame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });

  const slideX = interpolate(sc, [0, 1], [180, 0]);
  const opacity = interpolate(sc, [0, 0.3], [0, 1]);

  const rankScale = spring({
    frame: frame - item.startFrame,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  const pulse = interpolate(
    Math.sin(frame * 0.05 + index),
    [-1, 1],
    [0.85, 1.0]
  );

  if (frame < item.startFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 200,
        right: 200,
        top: 240 + index * 200,
        opacity,
        transform: `translateX(${slideX}px)`,
        display: "flex",
        alignItems: "center",
        gap: 40,
        background: item.bg,
        border: `2px solid ${item.color}`,
        borderRadius: 20,
        padding: "36px 48px",
        boxShadow: `0 0 40px ${item.glow}, inset 0 0 30px ${item.bg}`,
      }}
    >
      {/* Rank Number */}
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: 96,
          color: item.color,
          textShadow: `0 0 20px ${item.glow}, 0 0 60px ${item.glow}`,
          lineHeight: 1,
          minWidth: 120,
          textAlign: "center",
          transform: `scale(${rankScale * pulse})`,
        }}
      >
        #{item.rank}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 3,
          height: 100,
          background: `linear-gradient(to bottom, transparent, ${item.color}, transparent)`,
          borderRadius: 2,
        }}
      />

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: 48,
            color: "#ffffff",
            letterSpacing: -0.5,
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 22,
            color: item.color,
            marginTop: 8,
            opacity: 0.8,
          }}
        >
          {item.subtitle}
        </div>
      </div>

      {/* Score Bar */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 36,
            color: item.color,
            textShadow: `0 0 15px ${item.glow}`,
          }}
        >
          {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : "🥉"}
        </div>
      </div>
    </div>
  );
};

export const Top3Dark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated scanline
  const scanY = interpolate(frame % 90, [0, 90], [0, 1080]);

  // Header slide in
  const headerScale = spring({
    frame: frame - 0,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #020408 0%, #060d1a 50%, #0a0418 100%)",
        overflow: "hidden",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Animated grid */}
      <svg
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.06 }}
      >
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#00f5ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Scanline effect */}
      <div
        style={{
          position: "absolute",
          top: scanY,
          left: 0,
          width: "100%",
          height: 2,
          background: "linear-gradient(to right, transparent, rgba(0,245,255,0.15), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${headerScale})`,
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 28,
            color: "#00f5ff",
            letterSpacing: 8,
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(0,245,255,0.6)",
          }}
        >
          ⚡ RANKED LIST
        </div>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 62,
            color: "#ffffff",
            letterSpacing: -1,
            marginTop: 8,
            textShadow: "0 0 40px rgba(255,255,255,0.2)",
          }}
        >
          Top 3 AI Tools of 2025
        </div>
      </div>

      {/* Items rendered from lowest to highest */}
      {[...ITEMS].reverse().map((item, i) => (
        <NeonItem key={item.rank} item={item} index={i} />
      ))}

      {/* Bottom CTA */}
      {frame >= 380 && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [380, 410], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            💾 Save this for later · Follow for more
          </div>
        </div>
      )}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
