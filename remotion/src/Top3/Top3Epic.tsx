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
    title: "Midjourney",
    subtitle: "Most stunning AI image generation",
    icon: "🎨",
    color: "#e8a838",
    startFrame: 80,
  },
  {
    rank: 2,
    title: "Claude AI",
    subtitle: "Deepest reasoning & long context",
    icon: "🧠",
    color: "#c0c0c0",
    startFrame: 180,
  },
  {
    rank: 1,
    title: "ChatGPT",
    subtitle: "World's most powerful AI assistant",
    icon: "⚡",
    color: "#ffd700",
    startFrame: 290,
  },
];

// Sparkle particle component
const Sparkle: React.FC<{ x: number; y: number; delay: number; size: number }> = ({
  x, y, delay, size,
}) => {
  const frame = useCurrentFrame();
  const t = (frame - delay) % 90;
  if (t < 0) return null;
  const opacity = interpolate(t, [0, 20, 60, 90], [0, 1, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(t, [0, 30, 90], [0, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle, #fff 0%, rgba(255,215,0,0.6) 60%, transparent 100%)",
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: "none",
      }}
    />
  );
};

const EpicItem: React.FC<{ item: (typeof ITEMS)[0]; index: number }> = ({ item, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sc = spring({
    frame: frame - item.startFrame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });

  const scaleVal = interpolate(sc, [0, 1], [0.5, 1]);
  const opacity = interpolate(sc, [0, 0.3], [0, 1]);

  const rankSc = spring({
    frame: frame - item.startFrame - 8,
    fps,
    config: { damping: 8, stiffness: 250 },
  });

  if (frame < item.startFrame) return null;

  const isWinner = item.rank === 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        right: 140,
        top: 225 + index * 215,
        opacity,
        transform: `scale(${scaleVal})`,
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "32px 44px",
        borderRadius: 24,
        background: isWinner
          ? "linear-gradient(135deg, rgba(255,215,0,0.18) 0%, rgba(255,165,0,0.06) 100%)"
          : "rgba(255,255,255,0.05)",
        border: `2px solid ${isWinner ? "#ffd700" : "rgba(255,255,255,0.12)"}`,
        boxShadow: isWinner
          ? "0 0 60px rgba(255,215,0,0.25), 0 8px 32px rgba(0,0,0,0.4)"
          : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: 64, lineHeight: 1, minWidth: 80, textAlign: "center" }}>
        {item.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: isWinner ? 52 : 44,
            color: "#ffffff",
            letterSpacing: -0.5,
            textShadow: isWinner ? `0 0 30px ${item.color}` : "none",
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 20,
            color: "rgba(255,255,255,0.55)",
            marginTop: 8,
          }}
        >
          {item.subtitle}
        </div>
      </div>

      {/* Rank medal with spring bounce */}
      <div
        style={{
          textAlign: "center",
          transform: `scale(${rankSc})`,
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 80,
            lineHeight: 1,
            color: item.color,
            textShadow: `0 0 30px ${item.color}, 0 0 60px ${item.color}88`,
          }}
        >
          #{item.rank}
        </div>
      </div>
    </div>
  );
};

export const Top3Epic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSc = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const titleY = interpolate(titleSc, [0, 1], [80, 0]);

  // Animated aurora background offset
  const auroraX = interpolate(frame, [0, 450], [0, -200]);
  const auroraY = interpolate(Math.sin(frame * 0.015), [-1, 1], [-40, 40]);

  // Sparkle positions — pre-defined for determinism
  const sparkles = [
    { x: 120, y: 200, delay: 0, size: 8 },
    { x: 1700, y: 150, delay: 15, size: 6 },
    { x: 960, y: 80, delay: 30, size: 10 },
    { x: 300, y: 900, delay: 5, size: 7 },
    { x: 1500, y: 820, delay: 45, size: 9 },
    { x: 800, y: 980, delay: 20, size: 5 },
    { x: 1800, y: 600, delay: 10, size: 8 },
    { x: 100, y: 600, delay: 35, size: 6 },
    { x: 1200, y: 180, delay: 25, size: 7 },
    { x: 400, y: 400, delay: 50, size: 5 },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Deep cinematic background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, #0c0716 0%, #0f1a35 40%, #1a0a2e 100%)",
        }}
      />

      {/* Aurora glow blob */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,60,200,0.25) 0%, transparent 70%)",
          top: auroraY,
          left: 600 + auroraX,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%)",
          bottom: 100,
          right: 200,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Sparkles */}
      {sparkles.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}

      {/* Cinematic letterbox bars */}
      <div
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, backgroundColor: "#000" }}
      />
      <div
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, backgroundColor: "#000" }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
          opacity: titleSc,
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 18,
            color: "#ffd700",
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          ★ ULTIMATE RANKING ★
        </div>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 68,
            color: "#ffffff",
            letterSpacing: -2,
            textShadow: "0 0 40px rgba(255,215,0,0.3)",
          }}
        >
          Top 3 AI Tools 2025
        </div>
      </div>

      {/* Glowing divider line */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 140,
          right: 140,
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(255,215,0,0.5), transparent)",
          opacity: titleSc,
        }}
      />

      {/* Items */}
      {[...ITEMS].reverse().map((item, i) => (
        <EpicItem key={item.rank} item={item} index={i} />
      ))}

      {/* CTA */}
      {frame >= 390 && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [390, 415], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              color: "rgba(255,215,0,0.7)",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            ⭐ Follow for Weekly AI Rankings ⭐
          </div>
        </div>
      )}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
