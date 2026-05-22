import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Leva, useControls } from 'leva';

const DEFAULT_PARAMS = {
  enterDuration: 0.3,
  holdDuration: 3,
  exitDuration: 0.3,
  enterX: -24,
  enterY: 12,
  exitX: 32,
  exitY: -24,
  blurIn: 10,
  blurOut: 10,
  scaleIn: 1.2,
  scaleIdle: 1,
  scaleOut: 1.2,
  iconStaggerFactor: 0.5,
};

const logoRows = [
  [GoogleIcon, AppleIcon, MetaIcon, SpotifyIcon],
  [SupabaseIcon, VercelIcon, GithubIcon, NetflixIcon],
];

const roundTo2 = (value: number) => Math.round(value * 100) / 100;

export const Route = createFileRoute('/motion/m1-logo-marquee')({
  component: Motion1Page,
});

function buildShadowFilter({
  blur,
  redX,
  redY,
  blueX,
  blueY,
  opacity,
}: {
  blur: number;
  redX: number;
  redY: number;
  blueX: number;
  blueY: number;
  opacity: number;
}) {
  return `blur(${blur}px) drop-shadow(${redX}px ${redY}px rgba(255,0,0,${opacity})) drop-shadow(${blueX}px ${blueY}px rgba(0,0,255,${opacity}))`;
}

export function Motion1Page() {
  const timing = useControls('Timing', {
    enterDuration: {
      value: DEFAULT_PARAMS.enterDuration,
      min: 0.1,
      max: 2,
      step: 0.05,
    },
    holdDuration: {
      value: DEFAULT_PARAMS.holdDuration,
      min: 0.2,
      max: 8,
      step: 0.1,
    },
    exitDuration: {
      value: DEFAULT_PARAMS.exitDuration,
      min: 0.1,
      max: 2,
      step: 0.05,
    },
    iconStaggerFactor: {
      value: DEFAULT_PARAMS.iconStaggerFactor,
      min: 0,
      max: 2,
      step: 0.05,
      hint: 'Multiplier applied to enterDuration.',
    },
  });

  const position = useControls('Position', {
    enterX: { value: DEFAULT_PARAMS.enterX, min: -120, max: 120, step: 1 },
    enterY: { value: DEFAULT_PARAMS.enterY, min: -120, max: 120, step: 1 },
    exitX: { value: DEFAULT_PARAMS.exitX, min: -120, max: 120, step: 1 },
    exitY: { value: DEFAULT_PARAMS.exitY, min: -120, max: 120, step: 1 },
  });

  const blur = useControls('Blur', {
    blurIn: { value: DEFAULT_PARAMS.blurIn, min: 0, max: 40, step: 1 },
    blurOut: { value: DEFAULT_PARAMS.blurOut, min: 0, max: 40, step: 1 },
  });

  const scale = useControls('Scale', {
    scaleIn: { value: DEFAULT_PARAMS.scaleIn, min: 0.5, max: 2, step: 0.05 },
    scaleIdle: {
      value: DEFAULT_PARAMS.scaleIdle,
      min: 0.5,
      max: 2,
      step: 0.05,
    },
    scaleOut: {
      value: DEFAULT_PARAMS.scaleOut,
      min: 0.5,
      max: 2,
      step: 0.05,
    },
  });

  const params = {
    ...timing,
    ...position,
    ...blur,
    ...scale,
  };

  const totalDuration =
    params.enterDuration + params.holdDuration + params.exitDuration;
  const cycleGap = totalDuration * (logoRows.length - 1);
  const animationTimes = [
    0,
    roundTo2(params.enterDuration / totalDuration),
    roundTo2((params.enterDuration + params.holdDuration) / totalDuration),
    1,
  ];
  const iconStagger = params.enterDuration * params.iconStaggerFactor;
  const enterFilter = buildShadowFilter({
    blur: params.blurIn,
    redX: -4,
    redY: 4,
    blueX: -8,
    blueY: 8,
    opacity: 1,
  });
  const idleFilter = buildShadowFilter({
    blur: 0,
    redX: 0,
    redY: 0,
    blueX: 0,
    blueY: 0,
    opacity: 0,
  });
  const exitFilter = buildShadowFilter({
    blur: params.blurOut,
    redX: -6,
    redY: 6,
    blueX: -12,
    blueY: 12,
    opacity: 1,
  });
  const animationResetKey = JSON.stringify({
    ...params,
    animationTimes,
    totalDuration,
    cycleGap,
    iconStagger,
    enterFilter,
    exitFilter,
  });

  return (
    <main className="grid min-h-svh place-content-center bg-black [&_svg]:fill-white">
      <Leva />
      {logoRows.map((row, index) => (
        <div
          key={`row-${index}`}
          className="col-[1/2] row-[1/2] flex gap-[clamp(24px,5vw,80px)]"
        >
          {row.map((Icon, iconIndex) => (
            <div key={`animated-${iconIndex}`} className="relative">
              <motion.div
                key={`${animationResetKey}-${index}-${iconIndex}`}
                className="size-[clamp(40px,5.5vw,120px)]"
                initial={{
                  x: params.enterX,
                  y: params.enterY,
                  opacity: 0,
                  filter: enterFilter,
                  scale: params.scaleIn,
                }}
                animate={{
                  x: [`${params.enterX}px`, '0px', '0px', `${params.exitX}px`],
                  y: [`${params.enterY}px`, '0px', '0px', `${params.exitY}px`],
                  opacity: [0, 1, 1, 0],
                  filter: [enterFilter, idleFilter, idleFilter, exitFilter],
                  scale: [
                    params.scaleIn,
                    params.scaleIdle,
                    params.scaleIdle,
                    params.scaleOut,
                  ],
                }}
                transition={{
                  ease: 'linear',
                  duration: totalDuration,
                  times: animationTimes,
                  delay: iconIndex * iconStagger + index * totalDuration,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: cycleGap,
                }}
              >
                <Icon />
              </motion.div>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Apple</title>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function MetaIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Meta</title>
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Spotify</title>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function SupabaseIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Supabase</title>
      <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z" />
    </svg>
  );
}

function VercelIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Vercel</title>
      <path d="m12 1.608 12 20.784H0Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function NetflixIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Netflix</title>
      <path d="m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z" />
    </svg>
  );
}
