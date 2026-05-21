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
    emoji: "🥉",
    title: "Notion AI",
    subtitle: "Best for note-taking & organization",
    accent: "#FF6B6B",
    startFrame: 80,
  },
  {
    rank: 2,
    emoji: "🥈",
    title: "GitHub Copilot",
    subtitle: "Best for developer productivity",
    accent: "#4ECDC4",
    startFrame: 180,
  },
  {
    rank: 1,
    emoji: "🥇",
    title: "ChatGPT",
    subtitle: "Most versatile AI for everyone",
    accent: "#FFE66D",
    startFrame: 290,
  },
];

const MinimalItem: React.FC<{ item: (typeof ITEMS)[0]; index: number }> = ({
  item,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - item.startFrame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const slideY = interpolate(progress, [0, 1], [100, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1]);

  if (frame < item.startFrame) return null;

  const isFirst = item.rank === 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 160,
        right: 160,
        top: 220 + index * 230,
        opacity,
        transform: `translateY(${slideY}px)`,
        display: "flex",
        alignItems: "center",
        gap: 0,
        overflow: "hidden",
        borderRadius: 16,
        boxShadow: isFirst
          ? `0 20px 60px rgba(0,0,0,0.15), 0 0 0 3px ${item.accent}`
          : "0 8px 30px rgba(0,0,0,0.08)",
      }}
    >
      {/* Left colored stripe */}
      <div
        style={{
          width: 12,
          height: "100%",
          minHeight: 130,
          backgroundColor: item.accent,
          flexShrink: 0,
        }}
      />

      {/* Main card body */}
      <div
        style={{
          flex: 1,
          background: isFirst ? "#ffffff" : "#f8f9fa",
          padding: "28px 40px",
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Rank badge */}
        <div
          style={{
            fontSize: 72,
            lineHeight: 1,
            minWidth: 90,
            textAlign: "center",
          }}
        >
          {item.emoji}
        </div>

        {/* Vertical divider */}
        <div
          style={{
            width: 2,
            height: 80,
            backgroundColor: "#e9ecef",
            flexShrink: 0,
          }}
        />

        {/* Text content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: isFirst ? 52 : 44,
              color: "#1a1a2e",
              letterSpacing: -1,
              lineHeight: 1,
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 20,
              color: "#6c757d",
              marginTop: 10,
            }}
          >
            {item.subtitle}
          </div>
        </div>

        {/* Rank number */}
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 100,
            color: item.accent,
            lineHeight: 1,
            opacity: 0.25,
          }}
        >
          {item.rank}
        </div>
      </div>
    </div>
  );
};

export const Top3Minimal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerProgress = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const headerY = interpolate(headerProgress, [0, 1], [-60, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "#f0f2f5",
        overflow: "hidden",
      }}
    >
      {/* Top decorative bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: "linear-gradient(to right, #FF6B6B, #4ECDC4, #FFE66D)",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 55,
          left: 160,
          right: 160,
          transform: `translateY(${headerY}px)`,
          opacity: headerProgress,
          display: "flex",
          alignItems: "baseline",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 72,
            color: "#1a1a2e",
            lineHeight: 1,
          }}
        >
          Top 3
        </div>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 400,
            fontSize: 36,
            color: "#6c757d",
          }}
        >
          AI Tools
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            color: "#adb5bd",
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          2025 Edition
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          position: "absolute",
          top: 158,
          left: 160,
          right: 160,
          height: 2,
          backgroundColor: "#dee2e6",
          opacity: headerProgress,
        }}
      />

      {/* Items */}
      {[...ITEMS].reverse().map((item, i) => (
        <MinimalItem key={item.rank} item={item} index={i} />
      ))}

      {/* Footer CTA */}
      {frame >= 390 && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 40,
            opacity: interpolate(frame, [390, 420], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {["💾 Save", "👍 Like", "🔔 Follow"].map((text) => (
            <div
              key={text}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#495057",
              }}
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
