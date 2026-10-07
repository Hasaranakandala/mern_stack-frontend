import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";

import * as THREE from "three";

/* =========================================================
   VELMORA DESIGN SYSTEM

   Primary       #6C5CE7
   Lavender      #B8A1FF
   Soft Rose     #F2B8C6
   Champagne     #EADBC8
   Background    #FAF9F7
   Text          #2F3136
   Secondary     #6B7280
========================================================= */

const categories = [
  {
    icon: "✦",
    title: "Skincare",
    text: "Thoughtful cleansers, serums and moisturizers for radiant everyday skin.",
  },
  {
    icon: "❀",
    title: "Haircare",
    text: "Nourishing essentials created for softer, healthier-looking hair.",
  },
  {
    icon: "◆",
    title: "Makeup",
    text: "Modern shades and effortless finishes designed for your unique expression.",
  },
  {
    icon: "♡",
    title: "Body & Fragrance",
    text: "Elevated body care and scents that make every routine feel personal.",
  },
];

const productColors = [
  "#B8A1FF",
  "#6C5CE7",
  "#F2B8C6",
  "#EADBC8",
  "#C9B6E4",
  "#A8C7B8",
];

/* =========================================================
   MOBILE
========================================================= */

function useIsMobile() {
  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {
    const update = () => {
      setIsMobile(
        window.innerWidth < 768
      );
    };

    update();

    window.addEventListener(
      "resize",
      update
    );

    return () => {
      window.removeEventListener(
        "resize",
        update
      );
    };
  }, []);

  return isMobile;
}

/* =========================================================
   REDUCED MOTION
========================================================= */

function useReducedMotion() {
  const [reduced, setReduced] =
    useState(false);

  useEffect(() => {
    const media =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const update = () => {
      setReduced(media.matches);
    };

    update();

    media.addEventListener(
      "change",
      update
    );

    return () => {
      media.removeEventListener(
        "change",
        update
      );
    };
  }, []);

  return reduced;
}

/* =========================================================
   SECTION SCROLL PROGRESS
========================================================= */

function useSectionProgress(ref) {
  const progress = useRef(0);

  useEffect(() => {
    const main =
      document.querySelector("main");

    const scrollTarget =
      main || window;

    const update = () => {
      if (!ref.current) {
        return;
      }

      const rect =
        ref.current.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      const start =
        viewportHeight;

      const end =
        -rect.height;

      const raw =
        (start - rect.top) /
        (start - end);

      progress.current =
        THREE.MathUtils.clamp(
          raw,
          0,
          1
        );
    };

    update();

    scrollTarget.addEventListener(
      "scroll",
      update,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      update
    );

    return () => {
      scrollTarget.removeEventListener(
        "scroll",
        update
      );

      window.removeEventListener(
        "resize",
        update
      );
    };
  }, [ref]);

  return progress;
}

/* =========================================================
   INTERACTIVE 3D WRAPPER
========================================================= */

function InteractiveObject({
  children,
  scale = 1,
  reducedMotion,
}) {
  const ref = useRef();

  const [hovered, setHovered] =
    useState(false);

  useEffect(() => {
    document.body.style.cursor =
      hovered
        ? "grab"
        : "default";

    return () => {
      document.body.style.cursor =
        "default";
    };
  }, [hovered]);

  useFrame(
    (state, delta) => {
      if (!ref.current) {
        return;
      }

      const targetScale =
        hovered
          ? scale * 1.04
          : scale;

      ref.current.scale.x =
        THREE.MathUtils.damp(
          ref.current.scale.x,
          targetScale,
          7,
          delta
        );

      ref.current.scale.y =
        THREE.MathUtils.damp(
          ref.current.scale.y,
          targetScale,
          7,
          delta
        );

      ref.current.scale.z =
        THREE.MathUtils.damp(
          ref.current.scale.z,
          targetScale,
          7,
          delta
        );

      if (!reducedMotion) {
        ref.current.rotation.y =
          THREE.MathUtils.damp(
            ref.current.rotation.y,
            state.pointer.x * 0.14,
            4,
            delta
          );

        ref.current.rotation.x =
          THREE.MathUtils.damp(
            ref.current.rotation.x,
            -state.pointer.y * 0.04,
            4,
            delta
          );
      }
    }
  );

  return (
    <group
      ref={ref}
      scale={scale}
      onPointerOver={(event) => {
        event.stopPropagation();

        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      {children}
    </group>
  );
}

/* =========================================================
   SERUM LIQUID RIBBON
========================================================= */

function SerumRibbon({
  color,
  reducedMotion,
}) {
  const groupRef =
    useRef();

  const mainCurve =
    useMemo(() => {
      const points = [];

      for (
        let i = 0;
        i < 80;
        i += 1
      ) {
        const t =
          i / 79;

        const angle =
          t *
            Math.PI *
            4.4 -
          Math.PI * 0.2;

        const radius =
          1.2 +
          Math.sin(
            t *
              Math.PI *
              3
          ) *
            0.14;

        points.push(
          new THREE.Vector3(
            Math.cos(
              angle
            ) *
              radius,

            -1.9 +
              t *
                3.9,

            Math.sin(
              angle
            ) *
              radius
          )
        );
      }

      return new THREE.CatmullRomCurve3(
        points
      );
    }, []);

  const secondCurve =
    useMemo(() => {
      const points = [];

      for (
        let i = 0;
        i < 70;
        i += 1
      ) {
        const t =
          i / 69;

        const angle =
          t *
            Math.PI *
            3.8 +
          Math.PI * 0.5;

        const radius =
          1.48 +
          Math.sin(
            t *
              Math.PI *
              2.2
          ) *
            0.1;

        points.push(
          new THREE.Vector3(
            Math.cos(
              angle
            ) *
              radius,

            -1.55 +
              t *
                3.15,

            Math.sin(
              angle
            ) *
              radius
          )
        );
      }

      return new THREE.CatmullRomCurve3(
        points
      );
    }, []);

  useFrame(
    (state, delta) => {
      if (
        !groupRef.current ||
        reducedMotion
      ) {
        return;
      }

      groupRef.current.rotation.y +=
        delta * 0.12;

      groupRef.current.rotation.z =
        Math.sin(
          state.clock.elapsedTime *
            0.45
        ) * 0.05;
    }
  );

  return (
    <group ref={groupRef}>
      <mesh>
        <tubeGeometry
          args={[
            mainCurve,
            140,
            0.07,
            18,
            false,
          ]}
        />

        <meshPhysicalMaterial
          color={color}
          roughness={0.08}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={
            0.02
          }
          transmission={0.16}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh>
        <tubeGeometry
          args={[
            secondCurve,
            120,
            0.03,
            14,
            false,
          ]}
        />

        <meshPhysicalMaterial
          color="#EADBC8"
          roughness={0.06}
          clearcoat={1}
          transparent
          opacity={0.72}
        />
      </mesh>

      {[
        [
          -1.42,
          0.85,
          0.18,
          0.12,
        ],

        [
          1.25,
          -0.75,
          0.35,
          0.17,
        ],

        [
          -0.78,
          -1.42,
          0.95,
          0.09,
        ],

        [
          1.18,
          1.45,
          -0.22,
          0.1,
        ],

        [
          -1.15,
          1.65,
          -0.55,
          0.075,
        ],
      ].map(
        (
          [
            x,
            y,
            z,
            size,
          ],
          index
        ) => (
          <mesh
            key={`${x}-${y}-${index}`}
            position={[
              x,
              y,
              z,
            ]}
            scale={[
              size,
              size *
                1.45,
              size,
            ]}
          >
            <sphereGeometry
              args={[
                1,
                24,
                24,
              ]}
            />

            <meshPhysicalMaterial
              color={
                color
              }
              roughness={
                0.04
              }
              clearcoat={
                1
              }
              transparent
              opacity={
                0.78
              }
            />
          </mesh>
        )
      )}
    </group>
  );
}

/* =========================================================
   SERUM BOTTLE
========================================================= */

function SerumBottle({
  color,
  scrollProgress,
  scale,
  reducedMotion,
}) {
  const capRef =
    useRef();

  const bottleRef =
    useRef();

  const haloRef =
    useRef();

  const dropRef =
    useRef();

  useFrame(
    (state, delta) => {
      const time =
        state.clock.getElapsedTime();

      const progress =
        scrollProgress?.current ??
        0;

      const openAmount =
        Math.sin(
          THREE.MathUtils.clamp(
            progress,
            0,
            1
          ) *
            Math.PI
        );

      if (
        capRef.current
      ) {
        capRef.current.position.y =
          THREE.MathUtils.damp(
            capRef.current
              .position.y,

            1.95 +
              openAmount *
                1.35,

            6,

            delta
          );

        capRef.current.position.x =
          THREE.MathUtils.damp(
            capRef.current
              .position.x,

            openAmount *
              0.52,

            6,

            delta
          );

        capRef.current.rotation.z =
          THREE.MathUtils.damp(
            capRef.current
              .rotation.z,

            -openAmount *
              0.34,

            6,

            delta
          );
      }

      if (
        bottleRef.current &&
        !reducedMotion
      ) {
        bottleRef.current.rotation.y +=
          delta * 0.045;

        bottleRef.current.position.y =
          Math.sin(
            time * 0.8
          ) *
            0.035 -
          0.15;
      }

      if (
        haloRef.current &&
        !reducedMotion
      ) {
        haloRef.current.rotation.z =
          time * 0.08;
      }

      if (
        dropRef.current
      ) {
        dropRef.current.scale.y =
          1 +
          openAmount *
            0.4;

        dropRef.current.position.y =
          -2.02 -
          openAmount *
            0.12;
      }
    }
  );

  return (
    <InteractiveObject
      scale={scale}
      reducedMotion={
        reducedMotion
      }
    >
      {/* HALO */}

      <group
        ref={haloRef}
        position={[
          0,
          0,
          -1.45,
        ]}
      >
        <mesh>
          <torusGeometry
            args={[
              1.85,
              0.022,
              16,
              120,
            ]}
          />

          <meshBasicMaterial
            color="#C9A96E"
            transparent
            opacity={
              0.36
            }
          />
        </mesh>

        <mesh
          scale={1.25}
          rotation={[
            0,
            0,
            Math.PI /
              5,
          ]}
        >
          <torusGeometry
            args={[
              1.85,
              0.012,
              16,
              120,
            ]}
          />

          <meshBasicMaterial
            color="#EADBC8"
            transparent
            opacity={
              0.3
            }
          />
        </mesh>
      </group>

      <SerumRibbon
        color={color}
        reducedMotion={
          reducedMotion
        }
      />

      <group
        ref={bottleRef}
        position={[
          0,
          -0.15,
          0,
        ]}
      >
        {/* GLASS */}

        <mesh
          castShadow
          receiveShadow
        >
          <cylinderGeometry
            args={[
              0.67,
              0.72,
              2.55,
              64,
            ]}
          />

          <meshPhysicalMaterial
            color="#FFFDFC"
            roughness={
              0.08
            }
            metalness={
              0
            }
            transmission={
              0.55
            }
            thickness={
              0.55
            }
            clearcoat={
              1
            }
            clearcoatRoughness={
              0.02
            }
            transparent
            opacity={
              0.88
            }
          />
        </mesh>

        {/* SERUM */}

        <mesh
          position={[
            0,
            -0.28,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.56,
              0.61,
              1.72,
              64,
            ]}
          />

          <meshPhysicalMaterial
            color={color}
            roughness={
              0.1
            }
            clearcoat={
              1
            }
            transmission={
              0.08
            }
            transparent
            opacity={
              0.68
            }
          />
        </mesh>

        {/* BASE */}

        <mesh
          position={[
            0,
            -1.15,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.62,
              0.66,
              0.18,
              64,
            ]}
          />

          <meshPhysicalMaterial
            color="#FFFFFF"
            transmission={
              0.75
            }
            roughness={
              0.03
            }
            transparent
            opacity={
              0.55
            }
          />
        </mesh>

        {/* LABEL */}

        <mesh
          position={[
            0,
            -0.08,
            0.695,
          ]}
        >
          <boxGeometry
            args={[
              0.9,
              0.88,
              0.018,
            ]}
          />

          <meshPhysicalMaterial
            color="#FBF9FF"
            roughness={
              0.35
            }
          />
        </mesh>

        <mesh
          position={[
            0,
            0.16,
            0.71,
          ]}
        >
          <boxGeometry
            args={[
              0.42,
              0.04,
              0.012,
            ]}
          />

          <meshStandardMaterial
            color="#6C5CE7"
            metalness={
              0.35
            }
            roughness={
              0.3
            }
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.015,
            0.711,
          ]}
        >
          <boxGeometry
            args={[
              0.57,
              0.025,
              0.012,
            ]}
          />

          <meshStandardMaterial
            color="#B8A1FF"
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.12,
            0.711,
          ]}
        >
          <boxGeometry
            args={[
              0.37,
              0.018,
              0.012,
            ]}
          />

          <meshStandardMaterial
            color="#D7CCF6"
          />
        </mesh>

        {/* NECK */}

        <mesh
          position={[
            0,
            1.42,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.3,
              0.34,
              0.43,
              48,
            ]}
          />

          <meshStandardMaterial
            color="#B9955B"
            metalness={
              0.95
            }
            roughness={
              0.12
            }
          />
        </mesh>

        {/* DROPPER */}

        <group
          ref={capRef}
          position={[
            0,
            1.95,
            0,
          ]}
        >
          <mesh
            position={[
              0,
              -0.22,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                0.38,
                0.34,
                0.26,
                48,
              ]}
            />

            <meshStandardMaterial
              color="#B9955B"
              metalness={
                0.95
              }
              roughness={
                0.12
              }
            />
          </mesh>

          <mesh castShadow>
            <cylinderGeometry
              args={[
                0.4,
                0.36,
                0.7,
                48,
              ]}
            />

            <meshPhysicalMaterial
              color="#EADBC8"
              roughness={
                0.18
              }
              metalness={
                0.04
              }
              clearcoat={
                1
              }
              clearcoatRoughness={
                0.03
              }
            />
          </mesh>

          <mesh
            position={[
              0,
              -1.05,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                0.055,
                0.045,
                1.8,
                24,
              ]}
            />

            <meshPhysicalMaterial
              color="#FFFDFC"
              transmission={
                0.8
              }
              transparent
              opacity={
                0.62
              }
              roughness={
                0
              }
            />
          </mesh>

          <mesh
            position={[
              0,
              -1.07,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                0.023,
                0.023,
                1.55,
                16,
              ]}
            />

            <meshStandardMaterial
              color={
                color
              }
              transparent
              opacity={
                0.75
              }
            />
          </mesh>

          <mesh
            ref={dropRef}
            position={[
              0,
              -2.02,
              0,
            ]}
            scale={[
              0.09,
              0.15,
              0.09,
            ]}
          >
            <sphereGeometry
              args={[
                1,
                32,
                32,
              ]}
            />

            <meshPhysicalMaterial
              color={
                color
              }
              clearcoat={
                1
              }
              roughness={
                0.04
              }
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
  const lidRef =
    useRef();

  useFrame(
    (state, delta) => {
      if (
        !lidRef.current
      ) {
        return;
      }

      const progress =
        scrollProgress?.current ??
        0;

      const openAmount =
        Math.sin(
          progress *
            Math.PI
        );

      lidRef.current.position.y =
        THREE.MathUtils.damp(
          lidRef.current
            .position.y,

          0.72 +
            openAmount *
              1.35,

          6,

          delta
        );

      lidRef.current.rotation.z =
        THREE.MathUtils.damp(
          lidRef.current
            .rotation.z,

          -openAmount *
            0.55,

          6,

          delta
        );

      lidRef.current.position.x =
        THREE.MathUtils.damp(
          lidRef.current
            .position.x,

          openAmount *
            0.65,

          6,

          delta
        );
    }
  );

  return (
    <InteractiveObject
      scale={scale}
      reducedMotion={
        reducedMotion
      }
    >
      <mesh castShadow>
        <cylinderGeometry
          args={[
            1,
            0.92,
            1.05,
            64,
          ]}
        />

        <meshPhysicalMaterial
          color="#FFFDFC"
          roughness={
            0.14
          }
          clearcoat={
            1
          }
        />
      </mesh>

      <mesh
        position={[
          0,
          0.1,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.77,
            0.77,
            0.63,
            64,
          ]}
        />

        <meshStandardMaterial
          color={
            color
          }
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.05,
          0.92,
        ]}
      >
        <boxGeometry
          args={[
            0.88,
            0.34,
            0.02,
          ]}
        />

        <meshStandardMaterial
          color="#FFFFFF"
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.05,
          0.945,
        ]}
      >
        <boxGeometry
          args={[
            0.32,
            0.04,
            0.015,
          ]}
        />

        <meshStandardMaterial
          color="#6C5CE7"
        />
      </mesh>

      <group
        ref={lidRef}
        position={[
          0,
          0.72,
          0,
        ]}
      >
        <mesh castShadow>
          <cylinderGeometry
            args={[
              1.03,
              1,
              0.35,
              64,
            ]}
          />

          <meshStandardMaterial
            color={
              color
            }
            metalness={
              0.12
            }
            roughness={
              0.22
            }
          />
        </mesh>
      </group>
    </InteractiveObject>
  );
}

/* =========================================================
   PERFUME BOTTLE
========================================================= */

function PerfumeBottle({
  color,
  scrollProgress,
  scale,
  reducedMotion,
}) {
  const capRef =
    useRef();

  useFrame(
    (state, delta) => {
      if (
        !capRef.current
      ) {
        return;
      }

      const progress =
        scrollProgress?.current ??
        0;

      const openAmount =
        Math.sin(
          progress *
            Math.PI
        );

      capRef.current.position.y =
        THREE.MathUtils.damp(
          capRef.current
            .position.y,

          1.53 +
            openAmount *
              1.1,

          6,

          delta
        );

      capRef.current.rotation.z =
        THREE.MathUtils.damp(
          capRef.current
            .rotation.z,

          openAmount *
            0.5,

          6,

          delta
        );

      capRef.current.position.x =
        THREE.MathUtils.damp(
          capRef.current
            .position.x,

          openAmount *
            -0.5,

          6,

          delta
        );
    }
  );

  return (
    <InteractiveObject
      scale={scale}
      reducedMotion={
        reducedMotion
      }
    >
      <mesh castShadow>
        <boxGeometry
          args={[
            1.45,
            1.9,
            0.7,
          ]}
        />

        <meshPhysicalMaterial
          color={
            color
          }
          transparent
          opacity={
            0.9
          }
          clearcoat={
            1
          }
          roughness={
            0.1
          }
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.25,
          0,
        ]}
      >
        <boxGeometry
          args={[
            1.25,
            1.2,
            0.55,
          ]}
        />

        <meshStandardMaterial
          color={
            color
          }
          transparent
          opacity={
            0.35
          }
        />
      </mesh>

      <mesh
        position={[
          0,
          1.15,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.22,
            0.25,
            0.42,
            32,
          ]}
        />

        <meshStandardMaterial
          color="#B9955B"
          metalness={
            0.9
          }
          roughness={
            0.15
          }
        />
      </mesh>

      <group
        ref={capRef}
        position={[
          0,
          1.53,
          0,
        ]}
      >
        <mesh>
          <boxGeometry
            args={[
              0.56,
              0.45,
              0.56,
            ]}
          />

          <meshPhysicalMaterial
            color="#2F3136"
            clearcoat={
              1
            }
            roughness={
              0.14
            }
          />
        </mesh>
      </group>
    </InteractiveObject>
  );
}

/* =========================================================
   VELMORA LIGHTING
========================================================= */

function Lighting() {
  return (
    <>
      <ambientLight
        intensity={
          0.9
        }
      />

      <directionalLight
        position={[
          4,
          6,
          6,
        ]}
        intensity={
          2.6
        }
        color="#FFF9F2"
      />

      <pointLight
        position={[
          -4,
          2,
          3,
        ]}
        intensity={
          1.9
        }
        color="#EADBC8"
      />

      <pointLight
        position={[
          4,
          0,
          2,
        ]}
        intensity={
          1.45
        }
        color="#F2B8C6"
      />

      <pointLight
        position={[
          0,
          4,
          -4,
        ]}
        intensity={
          1.8
        }
        color="#DED4FF"
      />
    </>
  );
}

/* =========================================================
   GENERIC PRODUCT SCENE
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
      dpr={
        isMobile
          ? [
              1,
              1.2,
            ]
          : [
              1,
              1.5,
            ]
      }
      camera={{
        position: [
          0,
          0.12,
          cameraZ,
        ],

        fov: 42,
      }}
      gl={{
        antialias:
          true,

        alpha: true,

        powerPreference:
          "high-performance",
      }}
    >
      <Lighting />

      <Suspense
        fallback={
          null
        }
      >
        <Float
          speed={
            reducedMotion
              ? 0
              : 1.1
          }
          rotationIntensity={
            reducedMotion
              ? 0
              : 0.16
          }
          floatIntensity={
            reducedMotion
              ? 0
              : 0.28
          }
        >
          {type ===
            "serum" && (
            <group
              position={[
                0,
                isMobile
                  ? -0.05
                  : -0.32,
                0,
              ]}
            >
              <SerumBottle
                color={
                  color
                }
                scrollProgress={
                  scrollProgress
                }
                scale={
                  scale
                }
                reducedMotion={
                  reducedMotion
                }
              />
            </group>
          )}

          {type ===
            "cream" && (
            <CreamJar
              color={
                color
              }
              scrollProgress={
                scrollProgress
              }
              scale={
                scale
              }
              reducedMotion={
                reducedMotion
              }
            />
          )}

          {type ===
            "perfume" && (
            <PerfumeBottle
              color={
                color
              }
              scrollProgress={
                scrollProgress
              }
              scale={
                scale
              }
              reducedMotion={
                reducedMotion
              }
            />
          )}
        </Float>

        {!reducedMotion && (
          <Sparkles
            count={
              isMobile
                ? 10
                : 20
            }
            scale={[
              5,
              5,
              4,
            ]}
            size={
              1.25
            }
            speed={
              0.12
            }
            opacity={
              0.25
            }
            color="#B8A1FF"
          />
        )}

        <ContactShadows
          position={[
            0,
            -2,
            0,
          ]}
          opacity={
            0.2
          }
          scale={
            5
          }
          blur={
            2.5
          }
        />

        <Environment
          preset="studio"
        />
      </Suspense>

      <OrbitControls
        enablePan={
          false
        }
        enableZoom={
          false
        }
        enableDamping
        dampingFactor={
          0.06
        }
        minPolarAngle={
          Math.PI /
          2.8
        }
        maxPolarAngle={
          Math.PI /
          1.8
        }
      />
    </Canvas>
  );
}

/* =========================================================
   COLOR SELECTOR
========================================================= */

function ColorSelector({
  color,
  setColor,
}) {
  return (
    <div className="mt-7">
      <p
        className="
          mb-3
          text-xs
          font-bold
          uppercase
          tracking-[0.18em]
          text-[#8B8497]
        "
      >
        Explore the
        palette
      </p>

      <div className="flex flex-wrap gap-3">
        {productColors.map(
          (
            item
          ) => (
            <button
              key={
                item
              }
              type="button"
              onClick={() =>
                setColor(
                  item
                )
              }
              aria-label={`Select ${item}`}
              aria-pressed={
                color ===
                item
              }
              className={`
                h-10
                w-10
                rounded-full
                border-2
                border-white
                shadow-sm
                transition-all
                duration-300

                ${
                  color ===
                  item
                    ? "scale-110 ring-4 ring-[#B8A1FF]/30 shadow-md"
                    : "hover:-translate-y-1 hover:scale-105 hover:shadow-md"
                }
              `}
              style={{
                backgroundColor:
                  item,
              }}
            />
          )
        )}
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
  const isSerum =
    type === "serum";

  return (
    <section
      ref={
        sectionRef
      }
      className="
        px-4
        py-10
        sm:px-6
        sm:py-14
        lg:px-10
        lg:py-20
      "
    >
      <div
        className={`
          mx-auto
          max-w-7xl
          overflow-hidden
          rounded-[30px]
          border
          border-[#EEE8F8]
          shadow-[0_30px_100px_rgba(108,92,231,0.08)]
          sm:rounded-[40px]

          ${
            isSerum
              ? "bg-gradient-to-br from-[#FBF9FF] via-[#FFF8FB] to-[#FAF9F7]"
              : "bg-gradient-to-br from-white via-[#FBF8FF] to-[#FFF7F9]"
          }
        `}
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
          "
        >
          {/* ===========================
              3D SIDE
          =========================== */}

          <div
            className={`
              relative
              min-h-[390px]
              overflow-hidden
              sm:min-h-[470px]
              lg:min-h-[610px]

              ${
                reverse
                  ? "lg:order-2"
                  : ""
              }
            `}
          >
            {/* BACKGROUND GLOW */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[radial-gradient(circle_at_50%_45%,rgba(184,161,255,0.30),transparent_34%),radial-gradient(circle_at_76%_24%,rgba(242,184,198,0.22),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(234,219,200,0.30),transparent_30%)]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[300px]
                w-[300px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#B8A1FF]/15
                blur-[80px]
                sm:h-[430px]
                sm:w-[430px]
              "
            />

            {isSerum && (
              <div
                className="
                  pointer-events-none
                  absolute
                  left-6
                  top-6
                  z-20
                  rounded-full
                  border
                  border-[#DED4FF]
                  bg-white/70
                  px-4
                  py-2
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#6C5CE7]
                  shadow-sm
                  backdrop-blur-md
                  sm:left-10
                  sm:top-10
                  sm:text-xs
                "
              >
                Velmora
                Signature
                Experience
              </div>
            )}

            <div className="absolute inset-0 z-10">
              <ProductScene
                type={
                  type
                }
                color={
                  color
                }
                scrollProgress={
                  scrollProgress
                }
                isMobile={
                  isMobile
                }
                reducedMotion={
                  reducedMotion
                }
              />
            </div>

            <div
              className="
                pointer-events-none
                absolute
                bottom-4
                left-1/2
                z-20
                -translate-x-1/2
                whitespace-nowrap
                rounded-full
                border
                border-[#EEE8F8]
                bg-white/80
                px-4
                py-2
                text-[11px]
                font-medium
                text-[#777080]
                shadow-sm
                backdrop-blur-xl
                sm:text-xs
              "
            >
              Drag to
              explore ·
              Scroll to
              reveal
            </div>
          </div>

          {/* ===========================
              CONTENT SIDE
          =========================== */}

          <div
            className={`
              flex
              items-center
              p-6
              sm:p-9
              lg:p-12

              ${
                reverse
                  ? "lg:order-1"
                  : ""
              }
            `}
          >
            <div className="w-full max-w-xl">
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#6C5CE7]
                "
              >
                {
                  eyebrow
                }
              </p>

              <h2
                className="
                  mt-4
                  text-3xl
                  font-extrabold
                  leading-[1.08]
                  tracking-[-0.035em]
                  text-[#2F3136]
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {title}
              </h2>

              <p
                className="
                  mt-5
                  text-sm
                  leading-7
                  text-[#6B7280]
                  sm:text-base
                "
              >
                {
                  description
                }
              </p>

              <ColorSelector
                color={
                  color
                }
                setColor={
                  setColor
                }
              />

              {
                children
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TRUST CARD
========================================================= */

function TrustCard({
  title,
  text,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#EEE8F8]
        bg-white/75
        p-4
        text-center
        shadow-sm
        backdrop-blur-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#D6CAFA]
        hover:shadow-md
      "
    >
      <p
        className="
          text-sm
          font-extrabold
          text-[#6C5CE7]
          sm:text-base
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-[10px]
          text-[#6B7280]
          sm:text-[11px]
        "
      >
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   CLIENT HOME
========================================================= */

export default function ClientHome() {
  const isMobile =
    useIsMobile();

  const reducedMotion =
    useReducedMotion();

  const heroRef =
    useRef(null);

  const categoryRef =
    useRef(null);

  const perfumeRef =
    useRef(null);

  const heroProgress =
    useSectionProgress(
      heroRef
    );

  const categoryProgress =
    useSectionProgress(
      categoryRef
    );

  const perfumeProgress =
    useSectionProgress(
      perfumeRef
    );

  const [
    serumColor,
    setSerumColor,
  ] = useState(
    "#B8A1FF"
  );

  const [
    creamColor,
    setCreamColor,
  ] = useState(
    "#F2B8C6"
  );

  const [
    perfumeColor,
    setPerfumeColor,
  ] = useState(
    "#C9B6E4"
  );

  return (
    <div
      className="
        w-full
        overflow-x-hidden
        bg-[#FAF9F7]
        text-[#2F3136]
      "
    >
      {/* ===================================================
          HERO
      =================================================== */}

      <ProductSection
        sectionRef={
          heroRef
        }
        scrollProgress={
          heroProgress
        }
        type="serum"
        eyebrow="VELMORA · Elevated Beauty"
        title={
          <>
            Where your
            ritual
            becomes{" "}
            <span
              className="
                bg-gradient-to-r
                from-[#6C5CE7]
                via-[#9A79E8]
                to-[#D98DA8]
                bg-clip-text
                text-transparent
              "
            >
              radiance.
            </span>
          </>
        }
        description="Discover thoughtfully selected skincare, makeup, haircare and body essentials through a refined beauty experience designed around you."
        color={
          serumColor
        }
        setColor={
          setSerumColor
        }
        isMobile={
          isMobile
        }
        reducedMotion={
          reducedMotion
        }
      >
        <div
          className="
            mt-8
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <Link
            to="/products"
            className="
              inline-flex
              min-h-[52px]
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-r
              from-[#6C5CE7]
              to-[#9B82F2]
              px-7
              font-bold
              text-white
              shadow-[0_12px_30px_rgba(108,92,231,0.25)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_38px_rgba(108,92,231,0.32)]
              active:scale-[0.98]
            "
          >
            Discover
            Velmora
          </Link>

          <Link
            to="/about"
            className="
              inline-flex
              min-h-[52px]
              items-center
              justify-center
              rounded-2xl
              border
              border-[#DED4FF]
              bg-white/80
              px-7
              font-bold
              text-[#4D4658]
              backdrop-blur-md
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#B8A1FF]
              hover:bg-[#F8F5FF]
              active:scale-[0.98]
            "
          >
            Our
            Philosophy
          </Link>
        </div>

        <div
          className="
            mt-8
            grid
            grid-cols-3
            gap-2
            sm:gap-3
          "
        >
          <TrustCard
            title="Curated"
            text="Beauty"
          />

          <TrustCard
            title="Secure"
            text="Shopping"
          />

          <TrustCard
            title="Personal"
            text="Discovery"
          />
        </div>
      </ProductSection>

      {/* ===================================================
          BRAND STATEMENT
      =================================================== */}

      <section
        className="
          px-4
          py-6
          sm:px-6
          sm:py-10
          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-6xl
            grid-cols-1
            gap-6
            rounded-[28px]
            border
            border-[#EEE8F8]
            bg-white/70
            p-6
            shadow-[0_20px_60px_rgba(108,92,231,0.05)]
            backdrop-blur-xl
            sm:p-8
            lg:grid-cols-[0.9fr_1.4fr]
            lg:items-center
            lg:p-10
          "
        >
          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.24em]
                text-[#6C5CE7]
              "
            >
              The
              Velmora
              Philosophy
            </p>

            <h2
              className="
                mt-3
                text-2xl
                font-extrabold
                tracking-[-0.03em]
                text-[#2F3136]
                sm:text-3xl
              "
            >
              Beauty with
              softness,
              elegance and
              confidence.
            </h2>
          </div>

          <p
            className="
              text-sm
              leading-7
              text-[#6B7280]
              sm:text-base
            "
          >
            Velmora
            brings
            modern beauty
            essentials
            together in
            one thoughtful
            destination,
            helping every
            customer
            discover
            products that
            feel natural
            to their own
            routine,
            expression
            and lifestyle.
          </p>
        </div>
      </section>

      {/* ===================================================
          CATEGORY + CREAM
      =================================================== */}

      <ProductSection
        sectionRef={
          categoryRef
        }
        scrollProgress={
          categoryProgress
        }
        type="cream"
        eyebrow="Curated for every ritual"
        title="Beauty that belongs to you."
        description="From skincare essentials to expressive makeup and signature body care, explore collections thoughtfully organized around your everyday ritual."
        color={
          creamColor
        }
        setColor={
          setCreamColor
        }
        isMobile={
          isMobile
        }
        reducedMotion={
          reducedMotion
        }
        reverse
      >
        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
          "
        >
          {categories.map(
            (
              category
            ) => (
              <Link
                key={
                  category.title
                }
                to="/products"
                className="
                  group
                  rounded-2xl
                  border
                  border-[#EEE8F8]
                  bg-white/80
                  p-4
                  transition-all
                  duration-300
                  hover:-translate-y-1.5
                  hover:border-[#CFC1FA]
                  hover:shadow-[0_16px_35px_rgba(108,92,231,0.10)]
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#F1ECFF]
                    font-bold
                    text-[#6C5CE7]
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:bg-[#E9E1FF]
                  "
                >
                  {
                    category.icon
                  }
                </div>

                <h3
                  className="
                    mt-4
                    font-extrabold
                    text-[#2F3136]
                  "
                >
                  {
                    category.title
                  }
                </h3>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-[#6B7280]
                  "
                >
                  {
                    category.text
                  }
                </p>

                <span
                  className="
                    mt-3
                    inline-block
                    text-xs
                    font-bold
                    text-[#6C5CE7]
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  Explore
                  Collection
                  →
                </span>
              </Link>
            )
          )}
        </div>
      </ProductSection>

      {/* ===================================================
          IMMERSIVE PERFUME EXPERIENCE
      =================================================== */}

      <ProductSection
        sectionRef={
          perfumeRef
        }
        scrollProgress={
          perfumeProgress
        }
        type="perfume"
        eyebrow="The Velmora Experience"
        title="Discover beauty from every angle."
        description="Explore products through an immersive experience that brings texture, form and personality closer before they become part of your routine."
        color={
          perfumeColor
        }
        setColor={
          setPerfumeColor
        }
        isMobile={
          isMobile
        }
        reducedMotion={
          reducedMotion
        }
      >
        <div
          className="
            mt-8
            grid
            grid-cols-2
            gap-3
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-[#EEE8F8]
              bg-white/80
              p-4
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#CFC1FA]
              hover:shadow-lg
              sm:p-5
            "
          >
            <p
              className="
                text-xl
                font-extrabold
                text-[#6C5CE7]
                sm:text-2xl
              "
            >
              3D
            </p>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-[#6B7280]
                sm:text-sm
              "
            >
              Immersive
              product
              discovery
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-[#EEE8F8]
              bg-white/80
              p-4
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#CFC1FA]
              hover:shadow-lg
              sm:p-5
            "
          >
            <p
              className="
                text-xl
                font-extrabold
                text-[#6C5CE7]
                sm:text-2xl
              "
            >
              360°
            </p>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-[#6B7280]
                sm:text-sm
              "
            >
              Explore every
              detail
            </p>
          </div>
        </div>
      </ProductSection>

      {/* ===================================================
          VELMORA VALUES
      =================================================== */}

      <section
        className="
          px-4
          py-10
          sm:px-6
          sm:py-14
          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          <div
            className="
              mx-auto
              max-w-2xl
              text-center
            "
          >
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.22em]
                text-[#6C5CE7]
              "
            >
              Why
              Velmora
            </p>

            <h2
              className="
                mt-4
                text-3xl
                font-extrabold
                tracking-[-0.035em]
                text-[#2F3136]
                sm:text-4xl
              "
            >
              Designed around
              your beauty
              journey.
            </h2>

            <p
              className="
                mt-4
                leading-7
                text-[#6B7280]
              "
            >
              A refined,
              intuitive
              shopping
              experience
              created to make
              discovery feel
              simple,
              personal and
              inspiring.
            </p>
          </div>

          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            <div
              className="
                rounded-[24px]
                border
                border-[#EEE8F8]
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_15px_40px_rgba(108,92,231,0.09)]
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#F1ECFF]
                  text-[#6C5CE7]
                "
              >
                ✦
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-extrabold
                  text-[#2F3136]
                "
              >
                Thoughtful
                Discovery
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#6B7280]
                "
              >
                Explore
                carefully
                organized
                collections
                designed to
                make your
                routine easier
                to build.
              </p>
            </div>

            <div
              className="
                rounded-[24px]
                border
                border-[#EEE8F8]
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_15px_40px_rgba(108,92,231,0.09)]
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#FFF0F4]
                  text-[#C87994]
                "
              >
                ♡
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-extrabold
                  text-[#2F3136]
                "
              >
                Personal
                Beauty
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#6B7280]
                "
              >
                Beauty is
                personal.
                Velmora helps
                you explore
                products that
                match your own
                style and
                routine.
              </p>
            </div>

            <div
              className="
                rounded-[24px]
                border
                border-[#EEE8F8]
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_15px_40px_rgba(108,92,231,0.09)]
                sm:col-span-2
                lg:col-span-1
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#F8F2E8]
                  text-[#B9955B]
                "
              >
                ◆
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-extrabold
                  text-[#2F3136]
                "
              >
                Elevated
                Experience
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[#6B7280]
                "
              >
                Clean design,
                responsive
                interactions
                and immersive
                product
                presentation
                make every
                visit feel
                refined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          FINAL CTA
      =================================================== */}

      <section
        className="
          px-4
          py-16
          sm:px-6
          sm:py-20
          lg:px-10
        "
      >
        <div
          className="
            relative
            mx-auto
            max-w-5xl
            overflow-hidden
            rounded-[32px]
            border
            border-[#E8E0F7]
            bg-gradient-to-br
            from-[#F5F1FF]
            via-white
            to-[#FFF2F6]
            px-6
            py-14
            text-center
            shadow-[0_30px_80px_rgba(108,92,231,0.09)]
            sm:px-10
            sm:py-20
          "
        >
          {/* DECORATIVE GLOWS */}

          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-[#B8A1FF]/20
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              -right-24
              h-64
              w-64
              rounded-full
              bg-[#F2B8C6]/25
              blur-3xl
            "
          />

          <div
            className="
              relative
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-[#6C5CE7]
              to-[#B8A1FF]
              text-xl
              text-white
              shadow-lg
              shadow-[#6C5CE7]/20
            "
          >
            ✦
          </div>

          <p
            className="
              relative
              mt-6
              text-xs
              font-black
              uppercase
              tracking-[0.24em]
              text-[#6C5CE7]
            "
          >
            VELMORA
          </p>

          <h2
            className="
              relative
              mx-auto
              mt-3
              max-w-2xl
              text-3xl
              font-extrabold
              tracking-[-0.035em]
              text-[#2F3136]
              sm:text-4xl
              lg:text-5xl
            "
          >
            Find beauty that
            feels like you.
          </h2>

          <p
            className="
              relative
              mx-auto
              mt-5
              max-w-xl
              leading-7
              text-[#6B7280]
            "
          >
            Explore
            thoughtfully
            curated beauty
            essentials and
            create a ritual
            that feels
            unmistakably
            yours.
          </p>

          <Link
            to="/products"
            className="
              relative
              mt-8
              inline-flex
              min-h-[52px]
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-r
              from-[#6C5CE7]
              to-[#9B82F2]
              px-8
              font-bold
              text-white
              shadow-[0_12px_30px_rgba(108,92,231,0.24)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_38px_rgba(108,92,231,0.30)]
              active:scale-[0.98]
            "
          >
            Shop Velmora
          </Link>

          <p
            className="
              relative
              mt-6
              text-xs
              font-medium
              text-[#96909B]
            "
          >
            Beauty ·
            Skincare ·
            Confidence
          </p>
        </div>
      </section>
    </div>
  );
}