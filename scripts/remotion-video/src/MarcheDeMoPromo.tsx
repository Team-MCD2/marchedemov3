import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";

const { fontFamily } = loadFont();

// Colors matching Marché de Mo' branding
const COLOR_VERT_FOREST = "#1C6B35";
const COLOR_ROUGE = "#8B1919";
const COLOR_VERT_LIGHT = "#2E8B4A";
const COLOR_ORANGE = "#C8751A";
const COLOR_OR = "#C0812B";

export const MyVideoAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Helper for spring transitions
  const getSpringVal = (delay: number, duration = 25, damping = 12) => {
    return spring({
      fps,
      frame,
      config: { damping, mass: 0.6 },
      delay,
      durationInFrames: duration,
    });
  };

  // Global progress bar calculation
  const globalProgress = interpolate(frame, [0, durationInFrames], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        fontFamily,
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Background Pattern */}
      <BackgroundGrid />

      {/* Global Progress Indicator at the very top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 8,
          backgroundColor: COLOR_VERT_LIGHT,
          width: `${globalProgress}%`,
          zIndex: 100,
          boxShadow: "0 0 12px #2E8B4A",
        }}
      />

      {/* ────────────────────────────────────────────────────────
          SLIDE 1 : Intro & Brand (Frames 0 - 90)
          ──────────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={90}>
        <SlideContainer bg={COLOR_VERT_FOREST}>
          {/* Spring Logo Frame */}
          <LogoFrame delay={5} getSpringVal={getSpringVal} />
          
          <TitleText delay={20} getSpringVal={getSpringVal}>
            Marché de Mo'
          </TitleText>
          <SubtitleText delay={35} getSpringVal={getSpringVal}>
            Votre supermarché du monde à Toulouse
          </SubtitleText>
          
          {/* Animated Line */}
          <AnimatedLine delay={45} getSpringVal={getSpringVal} color={COLOR_OR} />

          <div style={{ marginTop: 10 }}>
            <Badge delay={55} getSpringVal={getSpringVal} bg={COLOR_ROUGE}>
              Boucherie Halal &amp; Primeurs
            </Badge>
          </div>
        </SlideContainer>
      </Sequence>

      {/* ────────────────────────────────────────────────────────
          SLIDE 2 : Boucherie Halal (Frames 90 - 180)
          ──────────────────────────────────────────────────────── */}
      <Sequence from={90} durationInFrames={90}>
        <SlideContainer bg={COLOR_ROUGE}>
          <div style={{ transform: "rotate(-3deg)" }}>
            <Badge delay={5} getSpringVal={getSpringVal} bg={COLOR_OR}>
              DIRECT DES PRODUCTEURS
            </Badge>
          </div>
          
          <TitleText delay={15} getSpringVal={getSpringVal}>
            BOUCHERIE HALAL
          </TitleText>
          
          <SubtitleText delay={30} getSpringVal={getSpringVal}>
            Découpe sur carcasse
          </SubtitleText>

          {/* Staggered lists of products popping in */}
          <div style={{ display: "flex", gap: 15, marginTop: 25, justifyContent: "center", width: "100%" }}>
            <StaggerCard delay={45} getSpringVal={getSpringVal} label="Agneau" />
            <StaggerCard delay={55} getSpringVal={getSpringVal} label="Bœuf" />
            <StaggerCard delay={65} getSpringVal={getSpringVal} label="Volailles" />
          </div>

          <SmallText delay={75} getSpringVal={getSpringVal}>
            Arrivages quotidiens · Qualité garantie
          </SmallText>
        </SlideContainer>
      </Sequence>

      {/* ────────────────────────────────────────────────────────
          SLIDE 3 : Fruits & Légumes / Primeurs (Frames 180 - 270)
          ──────────────────────────────────────────────────────── */}
      <Sequence from={180} durationInFrames={90}>
        <SlideContainer bg={COLOR_VERT_LIGHT}>
          <Badge delay={5} getSpringVal={getSpringVal} bg={COLOR_VERT_FOREST}>
            FRAÎCHEUR DU JOUR
          </Badge>
          
          <TitleText delay={15} getSpringVal={getSpringVal}>
            PRIMEURS EXOTIQUES
          </TitleText>

          <SubtitleText delay={30} getSpringVal={getSpringVal}>
            Plus de 120 fruits &amp; légumes
          </SubtitleText>

          <AnimatedLine delay={45} getSpringVal={getSpringVal} color="#ffffff" />

          {/* List of items */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 20, maxWidth: 600 }}>
            <PillBadge delay={50} getSpringVal={getSpringVal} text="Plantains" />
            <PillBadge delay={55} getSpringVal={getSpringVal} text="Ignames" />
            <PillBadge delay={60} getSpringVal={getSpringVal} text="Manioc" />
            <PillBadge delay={65} getSpringVal={getSpringVal} text="Mangues mûres" />
          </div>
        </SlideContainer>
      </Sequence>

      {/* ────────────────────────────────────────────────────────
          SLIDE 4 : Toutes les cultures unies (Frames 270 - 360)
          ──────────────────────────────────────────────────────── */}
      <Sequence from={270} durationInFrames={90}>
        <SlideContainer bg={COLOR_ORANGE}>
          <Badge delay={5} getSpringVal={getSpringVal} bg={COLOR_ROUGE}>
            LE TOUR DU MONDE EN RAYONS
          </Badge>
          
          <TitleText delay={15} getSpringVal={getSpringVal}>
            6 RAYONS CULTURELS
          </TitleText>

          {/* Grid layout for cultures */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 15, 
            width: "100%", 
            maxWidth: 600, 
            marginTop: 20 
          }}>
            <GridItem delay={35} getSpringVal={getSpringVal} bg={COLOR_VERT_FOREST} title="AFRIQUE" desc="Épices &amp; produits secs" />
            <GridItem delay={45} getSpringVal={getSpringVal} bg={COLOR_ROUGE} title="ASIE" desc="Sauces &amp; nouilles" />
            <GridItem delay={55} getSpringVal={getSpringVal} bg={COLOR_OR} title="MÉDITERRANÉE" desc="Olives &amp; huiles" />
            <GridItem delay={65} getSpringVal={getSpringVal} bg="#333" title="BALKANS" desc="Fromages &amp; charcuteries" />
          </div>
        </SlideContainer>
      </Sequence>

      {/* ────────────────────────────────────────────────────────
          SLIDE 5 : Outro / Localisation (Frames 360 - 450)
          ──────────────────────────────────────────────────────── */}
      <Sequence from={360} durationInFrames={90}>
        <SlideContainer bg={COLOR_VERT_FOREST}>
          <div style={{ animation: "pulse 2s infinite" }}>
            <LogoFrame delay={5} getSpringVal={getSpringVal} />
          </div>
          
          <TitleText delay={15} getSpringVal={getSpringVal}>
            MARCHÉ DE MO'
          </TitleText>
          
          <SubtitleText delay={30} getSpringVal={getSpringVal}>
            Vos courses au meilleur prix
          </SubtitleText>

          <div style={{ display: "flex", gap: 15, marginTop: 15 }}>
            <Badge delay={45} getSpringVal={getSpringVal} bg={COLOR_ROUGE}>
              Portet-sur-Garonne
            </Badge>
            <Badge delay={55} getSpringVal={getSpringVal} bg={COLOR_OR}>
              Toulouse Cépière
            </Badge>
          </div>

          <SmallText delay={70} getSpringVal={getSpringVal}>
            Ouvert 7 jours sur 7
          </SmallText>
        </SlideContainer>
      </Sequence>
    </AbsoluteFill>
  );
};

// Background subtle grid decoration
const BackgroundGrid: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.05,
        backgroundImage: `
          linear-gradient(to right, white 1px, transparent 1px),
          linear-gradient(to bottom, white 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

// Slide container with layout zooms
const SlideContainer: React.FC<{ bg: string; children: React.ReactNode }> = ({
  bg,
  children,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 90], [1.03, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 10, 80, 90], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, ${bg} 0%, #050505 120%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        textAlign: "center",
        transform: `scale(${scale})`,
        opacity,
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 15,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Beautiful circular container for the Marché de Mo' logo
const LogoFrame: React.FC<{
  delay: number;
  getSpringVal: (d: number, dur?: number, damp?: number) => number;
}> = ({ delay, getSpringVal }) => {
  const springProgress = getSpringVal(delay, 30, 8);
  const scale = interpolate(springProgress, [0, 1], [0, 1]);
  const rotate = interpolate(springProgress, [0, 1], [-45, 0]);

  return (
    <div
      style={{
        width: 140,
        height: 140,
        borderRadius: "50%",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 12px 36px rgba(0,0,0,0.35)",
        border: `4px solid ${COLOR_VERT_LIGHT}`,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        marginBottom: 20,
        zIndex: 10,
        overflow: "hidden"
      }}
    >
      <img
        src="http://localhost:4321/logos/logo-marchedemo-rond-contourgreen.png"
        alt="Logo"
        style={{
          width: "90%",
          height: "90%",
          objectFit: "contain",
        }}
        onError={(e) => {
          // Fallback if dev server port or absolute path doesn't load
          e.currentTarget.src = "https://marchedemov2.vercel.app/logos/logo-marchedemo-rond-contourgreen.png";
        }}
      />
    </div>
  );
};

const TitleText: React.FC<{
  delay: number;
  getSpringVal: (d: number) => number;
  children: React.ReactNode;
}> = ({ delay, getSpringVal, children }) => {
  const springProgress = getSpringVal(delay);
  const opacity = springProgress;
  const translateY = interpolate(springProgress, [0, 1], [40, 0]);

  return (
    <h1
      style={{
        fontSize: 68,
        fontWeight: 900,
        margin: 0,
        textTransform: "uppercase",
        letterSpacing: "0.02em",
        opacity,
        transform: `translateY(${translateY}px)`,
        textShadow: "0 8px 30px rgba(0,0,0,0.4)",
        color: "#ffffff",
        lineHeight: 1.1,
      }}
    >
      {children}
    </h1>
  );
};

const SubtitleText: React.FC<{
  delay: number;
  getSpringVal: (d: number) => number;
  children: React.ReactNode;
}> = ({ delay, getSpringVal, children }) => {
  const springProgress = getSpringVal(delay);
  const opacity = springProgress;
  const translateY = interpolate(springProgress, [0, 1], [25, 0]);

  return (
    <h2
      style={{
        fontSize: 32,
        fontWeight: 700,
        margin: "5px 0 0 0",
        opacity,
        transform: `translateY(${translateY}px)`,
        textShadow: "0 4px 12px rgba(0,0,0,0.3)",
        color: "#f3f3f3",
      }}
    >
      {children}
    </h2>
  );
};

const SmallText: React.FC<{
  delay: number;
  getSpringVal: (d: number) => number;
  children: React.ReactNode;
}> = ({ delay, getSpringVal, children }) => {
  const springProgress = getSpringVal(delay);
  const opacity = springProgress;
  const scale = interpolate(springProgress, [0, 1], [0.9, 1]);

  return (
    <p
      style={{
        fontSize: 20,
        fontWeight: 500,
        margin: "20px 0 0 0",
        opacity,
        transform: `scale(${scale})`,
        color: "rgba(255, 255, 255, 0.8)",
        textShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {children}
    </p>
  );
};

const AnimatedLine: React.FC<{
  delay: number;
  getSpringVal: (d: number) => number;
  color: string;
}> = ({ delay, getSpringVal, color }) => {
  const springProgress = getSpringVal(delay);
  const scaleX = springProgress;

  return (
    <div
      style={{
        width: 120,
        height: 4,
        backgroundColor: color,
        transform: `scaleX(${scaleX})`,
        transformOrigin: "center center",
        margin: "15px auto",
        borderRadius: 2,
        boxShadow: `0 0 8px ${color}`,
      }}
    />
  );
};

const Badge: React.FC<{
  delay: number;
  getSpringVal: (d: number) => number;
  bg: string;
  children: React.ReactNode;
}> = ({ delay, getSpringVal, bg, children }) => {
  const springProgress = getSpringVal(delay);
  const opacity = springProgress;
  const scale = interpolate(springProgress, [0, 1], [0.75, 1]);

  return (
    <span
      style={{
        backgroundColor: bg,
        color: "white",
        fontSize: 16,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        padding: "12px 28px",
        borderRadius: 50,
        opacity,
        transform: `scale(${scale})`,
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        display: "inline-block",
        border: "2px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {children}
    </span>
  );
};

const StaggerCard: React.FC<{
  delay: number;
  getSpringVal: (d: number) => number;
  label: string;
}> = ({ delay, getSpringVal, label }) => {
  const springProgress = getSpringVal(delay);
  const opacity = springProgress;
  const translateY = interpolate(springProgress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 16,
        padding: "15px 25px",
        fontSize: 22,
        fontWeight: 800,
        color: "#ffffff",
        opacity,
        transform: `translateY(${translateY}px)`,
        flex: 1,
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        backdropFilter: "blur(5px)",
      }}
    >
      {label}
    </div>
  );
};

const PillBadge: React.FC<{
  delay: number;
  getSpringVal: (d: number) => number;
  text: string;
}> = ({ delay, getSpringVal, text }) => {
  const springProgress = getSpringVal(delay);
  const opacity = springProgress;
  const scale = interpolate(springProgress, [0, 1], [0.8, 1]);

  return (
    <span
      style={{
        backgroundColor: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 40,
        padding: "8px 20px",
        fontSize: 18,
        fontWeight: 700,
        color: "#ffffff",
        opacity,
        transform: `scale(${scale})`,
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
};

const GridItem: React.FC<{
  delay: number;
  getSpringVal: (d: number) => number;
  bg: string;
  title: string;
  desc: string;
}> = ({ delay, getSpringVal, bg, title, desc }) => {
  const springProgress = getSpringVal(delay);
  const opacity = springProgress;
  const scale = interpolate(springProgress, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        backgroundColor: `${bg}dd`,
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 16,
        padding: "20px 15px",
        textAlign: "center",
        opacity,
        transform: `scale(${scale})`,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.05em", color: "#fff" }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 6, fontWeight: 500 }}>
        {desc}
      </div>
    </div>
  );
};
