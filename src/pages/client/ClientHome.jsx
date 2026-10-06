import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   DATA
========================================================= */

const categories = [
  {
    icon: "✦",
    title: "Skin Care",
    text: "Serums, cleansers and creams for your everyday routine.",
  },
  {
    icon: "❀",
    title: "Hair Care",
    text: "Modern care for healthier and smoother-looking hair.",
  },
  {
    icon: "◆",
    title: "Makeup",
    text: "Express yourself through beautiful colors and finishes.",
  },
  {
    icon: "♡",
    title: "Body Care",
    text: "Refreshing products for everyday self-care.",
  },
];

const productColors = [
  "#e8b16a",
  "#ff8d95",
  "#f2a3ae",
  "#c084fc",
  "#60a5fa",
  "#34d399",
];

/* =========================================================
   MOBILE
========================================================= */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}

/* =========================================================
   REDUCED MOTION
========================================================= */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

/* =========================================================
   SECTION SCROLL PROGRESS
   0 = section entering
   1 = section passed
========================================================= */

function useSectionProgress(ref) {
  const progress = useRef(0);

  useEffect(() => {
    const main = document.querySelector("main");
    const scrollTarget = main || window;

    const update = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight;
      const end = -rect.height;
      const raw = (start - rect.top) / (start - end);

      progress.current = THREE.MathUtils.clamp(raw, 0, 1);
    };

    update();
    scrollTarget.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      scrollTarget.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return progress;
}

/* =========================================================
   INTERACTIVE WRAPPER
========================================================= */

function InteractiveObject({
  children,
  scale = 1,
  reducedMotion,
}) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "grab" : "default";
    return () => {
      document.body.style.cursor = "default";
    };
  }, [hovered]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const targetScale = hovered ? scale * 1.04 : scale;

    ref.current.scale.x = THREE.MathUtils.damp(
      ref.current.scale.x,
      targetScale,
      7,
      delta
    );
    ref.current.scale.y = THREE.MathUtils.damp(
      ref.current.scale.y,
      targetScale,
      7,
      delta
    );
    ref.current.scale.z = THREE.MathUtils.damp(
      ref.current.scale.z,
      targetScale,
      7,
      delta
    );

    if (!reducedMotion) {
      ref.current.rotation.y = THREE.MathUtils.damp(
        ref.current.rotation.y,
        state.pointer.x * 0.14,
        4,
        delta
      );

      ref.current.rotation.x = THREE.MathUtils.damp(
        ref.current.rotation.x,
        -state.pointer.y * 0.04,
        4,
        delta
      );
    }
  });

  return (
    <group
      ref={ref}
      scale={scale}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
}

/* =========================================================
   SERUM LIQUID RIBBON
========================================================= */

function SerumRibbon({ color, reducedMotion }) {
  const groupRef = useRef();

  const mainCurve = useMemo(() => {
    const points = [];

    for (let i = 0; i < 80; i += 1) {
      const t = i / 79;
      const angle = t * Math.PI * 4.4 - Math.PI * 0.2;
      const radius = 1.2 + Math.sin(t * Math.PI * 3) * 0.14;

      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          -1.9 + t * 3.9,
          Math.sin(angle) * radius
        )
      );
    }

    return new THREE.CatmullRomCurve3(points);
  }, []);

  const secondCurve = useMemo(() => {
    const points = [];

    for (let i = 0; i < 70; i += 1) {
      const t = i / 69;
      const angle = t * Math.PI * 3.8 + Math.PI * 0.5;
      const radius = 1.48 + Math.sin(t * Math.PI * 2.2) * 0.1;

      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          -1.55 + t * 3.15,
          Math.sin(angle) * radius
        )
      );
    }

    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;

    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.45) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <tubeGeometry args={[mainCurve, 140, 0.07, 18, false]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.08}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.02}
          transmission={0.16}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh>
        <tubeGeometry args={[secondCurve, 120, 0.03, 14, false]} />
        <meshPhysicalMaterial
          color="#f7cf8c"
          roughness={0.06}
          clearcoat={1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {[
        [-1.42, 0.85, 0.18, 0.12],
        [1.25, -0.75, 0.35, 0.17],
        [-0.78, -1.42, 0.95, 0.09],
        [1.18, 1.45, -0.22, 0.1],
        [-1.15, 1.65, -0.55, 0.075],
      ].map(([x, y, z, size], index) => (
        <mesh
          key={`${x}-${y}-${index}`}
          position={[x, y, z]}
          scale={[size, size * 1.45, size]}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.04}
            clearcoat={1}
            transparent
            opacity={0.78}
          />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   SERUM BOTTLE
   CGI-STYLE HERO PRODUCT
========================================================= */

function SerumBottle({
  color,
  scrollProgress,
  scale,
  reducedMotion,
}) {
  const capRef = useRef();
  const bottleRef = useRef();
  const haloRef = useRef();
  const dropRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const progress = scrollProgress?.current ?? 0;
    const openAmount = Math.sin(
      THREE.MathUtils.clamp(progress, 0, 1) * Math.PI
    );

    if (capRef.current) {
      capRef.current.position.y = THREE.MathUtils.damp(
        capRef.current.position.y,
        1.95 + openAmount * 1.35,
        6,
        delta
      );

      capRef.current.position.x = THREE.MathUtils.damp(
        capRef.current.position.x,
        openAmount * 0.52,
        6,
        delta
      );

      capRef.current.rotation.z = THREE.MathUtils.damp(
        capRef.current.rotation.z,
        -openAmount * 0.34,
        6,
        delta
      );
    }

    if (bottleRef.current && !reducedMotion) {
      bottleRef.current.rotation.y += delta * 0.045;
      bottleRef.current.position.y =
        Math.sin(time * 0.8) * 0.035 - 0.15;
    }

    if (haloRef.current && !reducedMotion) {
      haloRef.current.rotation.z = time * 0.08;
    }

    if (dropRef.current) {
      dropRef.current.scale.y = 1 + openAmount * 0.4;
      dropRef.current.position.y = -2.02 - openAmount * 0.12;
    }
  });

  return (
    <InteractiveObject scale={scale} reducedMotion={reducedMotion}>
      <group ref={haloRef} position={[0, 0, -1.45]}>
        <mesh>
          <torusGeometry args={[1.85, 0.022, 16, 120]} />
          <meshBasicMaterial
            color="#d9aa5f"
            transparent
            opacity={0.42}
          />
        </mesh>

        <mesh scale={1.25} rotation={[0, 0, Math.PI / 5]}>
          <torusGeometry args={[1.85, 0.012, 16, 120]} />
          <meshBasicMaterial
            color="#f7ddb0"
            transparent
            opacity={0.26}
          />
        </mesh>
      </group>

      <SerumRibbon color={color} reducedMotion={reducedMotion} />

      <group ref={bottleRef} position={[0, -0.15, 0]}>
        {/* OUTER GLASS */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.67, 0.72, 2.55, 64]} />
          <meshPhysicalMaterial
            color="#fff5eb"
            roughness={0.08}
            metalness={0}
            transmission={0.55}
            thickness={0.55}
            clearcoat={1}
            clearcoatRoughness={0.02}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* LIQUID */}
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.56, 0.61, 1.72, 64]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.1}
            clearcoat={1}
            transmission={0.08}
            transparent
            opacity={0.68}
          />
        </mesh>

        {/* BOTTOM GLASS */}
        <mesh position={[0, -1.15, 0]}>
          <cylinderGeometry args={[0.62, 0.66, 0.18, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.75}
            roughness={0.03}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* LABEL */}
        <mesh position={[0, -0.08, 0.695]}>
          <boxGeometry args={[0.9, 0.88, 0.018]} />
          <meshPhysicalMaterial color="#fffaf5" roughness={0.35} />
        </mesh>

        <mesh position={[0, 0.16, 0.71]}>
          <boxGeometry args={[0.42, 0.04, 0.012]} />
          <meshStandardMaterial
            color="#bb8b44"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0, -0.015, 0.711]}>
          <boxGeometry args={[0.57, 0.025, 0.012]} />
          <meshStandardMaterial color="#d8c2a5" />
        </mesh>

        <mesh position={[0, -0.12, 0.711]}>
          <boxGeometry args={[0.37, 0.018, 0.012]} />
          <meshStandardMaterial color="#e1d2be" />
        </mesh>

        {/* NECK */}
        <mesh position={[0, 1.42, 0]}>
          <cylinderGeometry args={[0.3, 0.34, 0.43, 48]} />
          <meshStandardMaterial
            color="#c89b52"
            metalness={0.95}
            roughness={0.12}
          />
        </mesh>

        {/* DROPPER */}
        <group ref={capRef} position={[0, 1.95, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.38, 0.34, 0.26, 48]} />
            <meshStandardMaterial
              color="#c89b52"
              metalness={0.95}
              roughness={0.12}
            />
          </mesh>

          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.36, 0.7, 48]} />
            <meshPhysicalMaterial
              color="#f6e7d2"
              roughness={0.18}
              metalness={0.04}
              clearcoat={1}
              clearcoatRoughness={0.03}
            />
          </mesh>

          <mesh position={[0, -1.05, 0]}>
            <cylinderGeometry args={[0.055, 0.045, 1.8, 24]} />
            <meshPhysicalMaterial
              color="#fff7eb"
              transmission={0.8}
              transparent
              opacity={0.62}
              roughness={0}
            />
          </mesh>

          <mesh position={[0, -1.07, 0]}>
            <cylinderGeometry args={[0.023, 0.023, 1.55, 16]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.75}
            />
          </mesh>

          <mesh
            ref={dropRef}
            position={[0, -2.02, 0]}
            scale={[0.09, 0.15, 0.09]}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial
              color={color}
              clearcoat={1}
              roughness={0.04}
            />
          </mesh>
        </group>
      </group>
    </InteractiveObject>
  );
}

/* =========================================================
   CREAM JAR
========================================================= */

function CreamJar({
  color,
  scrollProgress,
  scale,
  reducedMotion,
}) {
  const lidRef = useRef();

  useFrame((state, delta) => {
    if (!lidRef.current) return;

    const progress = scrollProgress?.current ?? 0;
    const openAmount = Math.sin(progress * Math.PI);

    lidRef.current.position.y = THREE.MathUtils.damp(
      lidRef.current.position.y,
      0.72 + openAmount * 1.35,
      6,
      delta
    );

    lidRef.current.rotation.z = THREE.MathUtils.damp(
      lidRef.current.rotation.z,
      -openAmount * 0.55,
      6,
      delta
    );

    lidRef.current.position.x = THREE.MathUtils.damp(
      lidRef.current.position.x,
      openAmount * 0.65,
      6,
      delta
    );
  });

  return (
    <InteractiveObject scale={scale} reducedMotion={reducedMotion}>
      <mesh castShadow>
        <cylinderGeometry args={[1, 0.92, 1.05, 64]} />
        <meshPhysicalMaterial
          color="#fff7f5"
          roughness={0.14}
          clearcoat={1}
        />
      </mesh>

      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.77, 0.77, 0.63, 64]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[0, -0.05, 0.92]}>
        <boxGeometry args={[0.88, 0.34, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, -0.05, 0.945]}>
        <boxGeometry args={[0.32, 0.04, 0.015]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <group ref={lidRef} position={[0, 0.72, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.03, 1, 0.35, 64]} />
          <meshStandardMaterial
            color={color}
            metalness={0.16}
            roughness={0.22}
          />
        </mesh>
      </group>
    </InteractiveObject>
  );
}

/* =========================================================
   PERFUME
========================================================= */

function PerfumeBottle({
  color,
  scrollProgress,
  scale,
  reducedMotion,
}) {
  const capRef = useRef();

  useFrame((state, delta) => {
    if (!capRef.current) return;

    const progress = scrollProgress?.current ?? 0;
    const openAmount = Math.sin(progress * Math.PI);

    capRef.current.position.y = THREE.MathUtils.damp(
      capRef.current.position.y,
      1.53 + openAmount * 1.1,
      6,
      delta
    );

    capRef.current.rotation.z = THREE.MathUtils.damp(
      capRef.current.rotation.z,
      openAmount * 0.5,
      6,
      delta
    );

    capRef.current.position.x = THREE.MathUtils.damp(
      capRef.current.position.x,
      openAmount * -0.5,
      6,
      delta
    );
  });

  return (
    <InteractiveObject scale={scale} reducedMotion={reducedMotion}>
      <mesh castShadow>
        <boxGeometry args={[1.45, 1.9, 0.7]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.9}
          clearcoat={1}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[1.25, 1.2, 0.55]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.35}
        />
      </mesh>

      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.22, 0.25, 0.42, 32]} />
        <meshStandardMaterial
          color="#d5a45f"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      <group ref={capRef} position={[0, 1.53, 0]}>
        <mesh>
          <boxGeometry args={[0.56, 0.45, 0.56]} />
          <meshPhysicalMaterial
            color="#202028"
            clearcoat={1}
            roughness={0.14}
          />
        </mesh>
      </group>
    </InteractiveObject>
  );
}

/* =========================================================
   LIGHTING
========================================================= */

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.8} />

      <directionalLight
        position={[4, 6, 6]}
        intensity={2.7}
        color="#fff8ee"
      />

      <pointLight
        position={[-4, 2, 3]}
        intensity={2.1}
        color="#ffc98b"
      />

      <pointLight
        position={[4, 0, 2]}
        intensity={1.55}
        color="#ffb7c5"
      />

      <pointLight
        position={[0, 4, -4]}
        intensity={1.9}
        color="#fff0d7"
      />
    </>
  );
}

/* =========================================================
   GENERIC 3D SCENE
========================================================= */

function ProductScene({
  type,
  color,
  scrollProgress,
  isMobile,
  reducedMotion,
}) {
  const scale =
    type === "serum"
      ? isMobile
        ? 0.72
        : 0.82
      : isMobile
        ? 0.8
        : 1.05;

  const cameraZ =
    type === "serum"
      ? isMobile
        ? 7.8
        : 8.25
      : isMobile
        ? 7
        : 6.4;

  return (
    <Canvas
      dpr={isMobile ? [1, 1.2] : [1, 1.5]}
      camera={{
        position: [0, 0.12, cameraZ],
        fov: 42,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <Lighting />

      <Suspense fallback={null}>
        <Float
          speed={reducedMotion ? 0 : 1.1}
          rotationIntensity={
            reducedMotion ? 0 : 0.16
          }
          floatIntensity={
            reducedMotion ? 0 : 0.28
          }
        >
          {type === "serum" && (
            <group
              position={[
                0,
                isMobile ? -0.05 : -0.32,
                0,
              ]}
            >
              <SerumBottle
                color={color}
                scrollProgress={
                  scrollProgress
                }
                scale={scale}
                reducedMotion={
                  reducedMotion
                }
              />
            </group>
          )}

          {type === "cream" && (
            <CreamJar
              color={color}
              scrollProgress={
                scrollProgress
              }
              scale={scale}
              reducedMotion={
                reducedMotion
              }
            />
          )}

          {type === "perfume" && (
            <PerfumeBottle
              color={color}
              scrollProgress={
                scrollProgress
              }
              scale={scale}
              reducedMotion={
                reducedMotion
              }
            />
          )}
        </Float>

        {!reducedMotion && (
          <Sparkles
            count={isMobile ? 10 : 20}
            scale={[5, 5, 4]}
            size={1.25}
            speed={0.12}
            opacity={0.28}
          />
        )}

        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.22}
          scale={5}
          blur={2.5}
        />

        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.06}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}

/* =========================================================
   COLOR SELECTOR
========================================================= */

function ColorSelector({ color, setColor }) {
  return (
    <div className="mt-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        Choose Product Color
      </p>

      <div className="flex flex-wrap gap-3">
        {productColors.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setColor(item)}
            aria-label={`Select ${item}`}
            className={`h-9 w-9 rounded-full border border-white/80 shadow-sm transition duration-300 ${
              color === item
                ? "scale-110 ring-4 ring-slate-200"
                : "hover:scale-110"
            }`}
            style={{ backgroundColor: item }}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT SECTION
========================================================= */

function ProductSection({
  reverse = false,
  type,
  eyebrow,
  title,
  description,
  children,
  color,
  setColor,
  sectionRef,
  scrollProgress,
  isMobile,
  reducedMotion,
}) {
  const isSerum = type === "serum";

  return (
    <section
      ref={sectionRef}
      className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20"
    >
      <div
        className={`mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-white shadow-[0_30px_100px_rgba(15,23,42,0.08)] sm:rounded-[40px] ${
          isSerum
            ? "bg-gradient-to-br from-[#fffaf2] via-[#fff5f3] to-[#fffdf8]"
            : "bg-gradient-to-br from-white via-rose-50/60 to-red-50/70"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* 3D SIDE */}
          <div
            className={`relative min-h-[390px] overflow-hidden sm:min-h-[470px] lg:min-h-[610px] ${
              reverse ? "lg:order-2" : ""
            }`}
          >
            {isSerum && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,222,173,0.5),transparent_33%),radial-gradient(circle_at_76%_24%,rgba(255,180,195,0.28),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(243,200,128,0.22),transparent_30%)]" />

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/20 blur-[80px] sm:h-[430px] sm:w-[430px]" />

                <div className="pointer-events-none absolute left-8 top-8 rounded-full border border-amber-200/70 bg-white/55 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-amber-700 backdrop-blur-md sm:left-10 sm:top-10 sm:text-xs">
                  Luxury Serum Experience
                </div>
              </>
            )}

            <div className="absolute inset-0 z-10">
              <ProductScene
                type={type}
                color={color}
                scrollProgress={scrollProgress}
                isMobile={isMobile}
                reducedMotion={reducedMotion}
              />
            </div>

            <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white bg-white/75 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur-xl">
              Drag product · Scroll to open cover
            </div>
          </div>

          {/* CONTENT SIDE */}
          <div
            className={`flex items-center p-6 sm:p-9 lg:p-12 ${
              reverse ? "lg:order-1" : ""
            }`}
          >
            <div className="w-full max-w-xl">
              <p
                className={`text-xs font-black uppercase tracking-[0.22em] ${
                  isSerum ? "text-amber-600" : "text-red-500"
                }`}
              >
                {eyebrow}
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                {description}
              </p>

              <ColorSelector color={color} setColor={setColor} />

              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOME
========================================================= */

export default function ClientHome() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  const heroRef = useRef(null);
  const categoryRef = useRef(null);
  const perfumeRef = useRef(null);

  const heroProgress = useSectionProgress(heroRef);
  const categoryProgress = useSectionProgress(categoryRef);
  const perfumeProgress = useSectionProgress(perfumeRef);

  const [serumColor, setSerumColor] = useState("#e8b16a");
  const [creamColor, setCreamColor] = useState("#f59e9e");
  const [perfumeColor, setPerfumeColor] = useState("#c084fc");

  return (
    <div className="w-full overflow-x-hidden bg-[#fffafa] text-slate-900">
      {/* ===================================================
          HERO
      =================================================== */}

      <ProductSection
        sectionRef={heroRef}
        scrollProgress={heroProgress}
        type="serum"
        eyebrow="Immersive Beauty · 3D Serum"
        title={
          <>
            Skincare that feels{" "}
            <span className="bg-gradient-to-r from-amber-600 via-rose-500 to-red-500 bg-clip-text text-transparent">
              alive.
            </span>
          </>
        }
        description="Experience a premium CGI-inspired serum presentation directly in your browser. Rotate the bottle, change the serum color and scroll through the section to lift the dropper and reveal the pipette."
        color={serumColor}
        setColor={setSerumColor}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/products"
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-7 font-bold text-white shadow-lg shadow-red-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/25"
          >
            Explore Products
          </Link>

          <Link
            to="/about"
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-amber-200 bg-white/80 px-7 font-bold text-slate-700 transition hover:-translate-y-1 hover:bg-amber-50"
          >
            Our Story
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white bg-white/70 p-4 text-center shadow-sm backdrop-blur-md">
            <p className="text-lg font-black text-amber-600">3D</p>
            <p className="mt-1 text-[11px] text-slate-500">Interactive</p>
          </div>

          <div className="rounded-2xl border border-white bg-white/70 p-4 text-center shadow-sm backdrop-blur-md">
            <p className="text-lg font-black text-amber-600">360°</p>
            <p className="mt-1 text-[11px] text-slate-500">Drag</p>
          </div>

          <div className="rounded-2xl border border-white bg-white/70 p-4 text-center shadow-sm backdrop-blur-md">
            <p className="text-lg font-black text-amber-600">Live</p>
            <p className="mt-1 text-[11px] text-slate-500">Scroll FX</p>
          </div>
        </div>
      </ProductSection>

      {/* ===================================================
          CATEGORIES + CREAM
      =================================================== */}

      <ProductSection
        sectionRef={categoryRef}
        scrollProgress={categoryProgress}
        type="cream"
        eyebrow="Explore Your Routine"
        title="Beauty made easier to discover."
        description="Choose a category and discover products designed around your everyday beauty and self-care routine."
        color={creamColor}
        setColor={setCreamColor}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
        reverse
      >
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.title}
              to="/products"
              className="group rounded-2xl border border-slate-100 bg-white/80 p-4 transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 font-bold text-red-500">
                {category.icon}
              </div>

              <h3 className="mt-4 font-black text-slate-900">
                {category.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {category.text}
              </p>

              <span className="mt-3 inline-block text-xs font-bold text-red-500">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </ProductSection>

      {/* ===================================================
          PERFUME EXPERIENCE
      =================================================== */}

      <ProductSection
        sectionRef={perfumeRef}
        scrollProgress={perfumeProgress}
        type="perfume"
        eyebrow="Immersive Shopping"
        title="Products that react to you."
        description="Move, rotate and interact with the 3D products. Scroll through the section to open and close the product cover and select your preferred color."
        color={perfumeColor}
        setColor={setPerfumeColor}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
      >
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5">
            <p className="text-2xl font-black text-red-500">3D</p>
            <p className="mt-2 text-sm text-slate-500">
              Interactive products
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5">
            <p className="text-2xl font-black text-red-500">360°</p>
            <p className="mt-2 text-sm text-slate-500">
              Drag and explore
            </p>
          </div>
        </div>
      </ProductSection>

      {/* ===================================================
          FINAL CTA
      =================================================== */}

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl rounded-[30px] border border-red-100 bg-gradient-to-br from-red-50 via-white to-pink-50 px-6 py-14 text-center sm:px-10 sm:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-xl text-white">
            ✦
          </div>

          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Find your next beauty favourite.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-500">
            Explore modern beauty products through a clean, responsive and
            interactive shopping experience.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex rounded-2xl bg-red-500 px-7 py-3.5 font-bold text-white transition hover:-translate-y-1 hover:bg-red-600"
          >
            Shop Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
