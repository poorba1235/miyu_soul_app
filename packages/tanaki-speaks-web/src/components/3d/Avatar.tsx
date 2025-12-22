import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const facialExpressions: Record<string, Record<string, number>> = {
  default: {},
  smile: {
    mouthSmileLeft: 0.6,
    mouthSmileRight: 0.6,
  },
  sad: {
    mouthFrownLeft: 0.5,
    mouthFrownRight: 0.5,
    browInnerUp: 0.4,
  },
  angry: {
    browDownLeft: 0.6,
    browDownRight: 0.6,
    eyeSquintLeft: 0.6,
    eyeSquintRight: 0.6,
  },
};

type AvatarProps = {
  mouthOpen?: number;
};

export function Avatar({ mouthOpen = 0, ...props }: AvatarProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/Character2.glb");
  const { actions } = useAnimations(animations, group);

  const [animation, setAnimation] = useState("Action");
  const [facialExpression] = useState("default");
  const [blink, setBlink] = useState(false);

  /* ---------------- Blink Logic ---------------- */
  useEffect(() => {
    let timeout: any;
    const loop = () => {
      timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          loop();
        }, 150);
      }, THREE.MathUtils.randInt(2000, 5000));
    };
    loop();
    return () => clearTimeout(timeout);
  }, []);

  /* ---------------- Animation ---------------- */
  useEffect(() => {
    if (!actions[animation]) return;
    actions[animation].reset().fadeIn(0.4).play();
    return () => actions[animation]?.fadeOut(0.4);
  }, [animation, actions]);

  /* ---------------- Morph Target Reset ---------------- */
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.morphTargetInfluences) {
        child.morphTargetInfluences.fill(0);
      }
    });
  }, [scene]);

  /* ---------------- Frame Update ---------------- */
  useFrame(() => {
    const expression = facialExpressions[facialExpression];

    scene.traverse((child: any) => {
      if (!child.isMesh || !child.morphTargetDictionary) return;

      const dict = child.morphTargetDictionary;
      const influences = child.morphTargetInfluences;

      // Facial expressions
      Object.entries(dict).forEach(([name, index]) => {
        let target = expression?.[name] ?? 0;

        if (name === "eyeBlinkLeft" || name === "eyeBlinkRight") {
          target = blink ? 1 : 0;
        }

        influences[index] = THREE.MathUtils.lerp(
          influences[index],
          target,
          0.25
        );
      });

      // Mouth open from Tanaki audio
      const jaw =
        dict["jawOpen"] ??
        dict["viseme_AA"] ??
        dict["mouthOpen"];

      if (jaw !== undefined) {
        influences[jaw] = THREE.MathUtils.lerp(
          influences[jaw],
          mouthOpen,
          0.4
        );
      }
    });
  });

  return <primitive ref={group} object={scene} {...props} />;
}

useGLTF.preload("/models/Character2.glb");
