import { useGLTF } from "@react-three/drei";

import * as THREE from "three";

type GLTFResult = {
  nodes: Record<string, THREE.Mesh | THREE.Group>;
  materials: Record<string, THREE.Material>;
};



export function BackgroundScene(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/Scene_update-transformed.glb") as GLTFResult;

  const defaultMaterial = THREE.Color;

  if (!nodes) return null;

  return (
    <group {...props} dispose={null}>
      {/* Background */}
      {nodes.SM_Background?.geometry && (
        <mesh
          geometry={(nodes.SM_Background as THREE.Mesh).geometry}
          material={materials["Material.002"] ?? defaultMaterial}
          position={[53.803, -13.827, -0.225]}
          rotation={[Math.PI / 2, 0, 1.575]}
          scale={39.412}
        />
      )}

      {/* Bar Counter */}
      {nodes.SM_BarCounter?.geometry && (
        <mesh
          geometry={(nodes.SM_BarCounter as THREE.Mesh).geometry}
          material={materials.M_BarCounter ?? defaultMaterial}
          position={[-1.182, -0.009, -3.999]}
          rotation={[-Math.PI, 0.004, -Math.PI]}
          scale={1.116}
        />
      )}

      {/* Cylinder / Palette */}
      {nodes.Cylinder002 && (
        <group position={[0.628, 2.28, -6.725]} rotation={[0, 1.567, 0]} scale={1.339}>
          {(nodes.Cylinder002 as THREE.Mesh).geometry && (
            <mesh
              geometry={(nodes.Cylinder002 as THREE.Mesh).geometry}
              material={materials.PaletteMaterial001 ?? defaultMaterial}
            />
          )}
          {nodes.Cylinder002_1?.geometry && (
            <mesh
              geometry={(nodes.Cylinder002_1 as THREE.Mesh).geometry}
              material={materials.PaletteMaterial002 ?? defaultMaterial}
            />
          )}
          {nodes.Cylinder002_2?.geometry && (
            <mesh
              geometry={(nodes.Cylinder002_2 as THREE.Mesh).geometry}
              material={materials.PaletteMaterial003 ?? defaultMaterial}
            />
          )}
        </group>
      )}

      {/* Floor */}
      {nodes.SM_Floor?.geometry && (
        <mesh
          geometry={(nodes.SM_Floor as THREE.Mesh).geometry}
          material={materials["M_Sci-fi_Floor"] ?? defaultMaterial}
          position={[1.932, -0.009, 2.929]}
          rotation={[-Math.PI, 0.004, -Math.PI]}
          scale={1.116}
        />
      )}

      {/* LED */}
      {nodes.SM_Led?.geometry && (
        <mesh
          geometry={(nodes.SM_Led as THREE.Mesh).geometry}
          material={materials.SM_Led ?? defaultMaterial}
          position={[-0.628, 0.97, -4.48]}
          rotation={[-Math.PI, 0.004, 0]}
          scale={-1.116} // mirrors original JSX
        />
      )}

      {/* Neon Sign */}
      {nodes.SM_Neon_NightClub?.geometry && (
        <mesh
          geometry={(nodes.SM_Neon_NightClub as THREE.Mesh).geometry}
          material={materials.M_NightClub ?? defaultMaterial}
          position={[-0.469, 2.904, -7.015]}
          rotation={[1.57, 0.229, 0.004]}
          scale={0.663}
        />
      )}

      {/* Cube / Poster */}
      {nodes.Cube003 && (
        <group position={[3.185, -0.009, -3.746]} rotation={[0, 1.567, 0]} scale={1.116}>
          {(nodes.Cube003 as THREE.Mesh).geometry && (
            <mesh
              geometry={(nodes.Cube003 as THREE.Mesh).geometry}
              material={materials["M_Sci-fi_Light_02"] ?? defaultMaterial}
            />
          )}
          {nodes.Cube003_1?.geometry && (
            <mesh
              geometry={(nodes.Cube003_1 as THREE.Mesh).geometry}
              material={materials.M_Poster ?? defaultMaterial}
            />
          )}
        </group>
      )}

      {/* Sci-fi Armchair */}
      {nodes["SM_Sci-fi_Armchair003"]?.geometry && (
        <mesh
          geometry={(nodes["SM_Sci-fi_Armchair003"] as THREE.Mesh).geometry}
          material={materials["M_Sci-fi_Armchair"] ?? defaultMaterial}
          position={[-2.293, -0.009, -1.337]}
          rotation={[0, -0.004, 0]}
          scale={1.116}
        />
      )}

      {/* Sci-fi Light */}
      {nodes["SM_Sci-fi_Light"]?.geometry && (
        <mesh
          geometry={(nodes["SM_Sci-fi_Light"] as THREE.Mesh).geometry}
          material={materials["M_Sci-fi_Light"] ?? defaultMaterial}
          position={[1.81, 1.391, -0.041]}
          rotation={[-Math.PI, 0.004, -Math.PI]}
          scale={1.116}
        />
      )}

      {/* Sci-fi Shelf */}
      {nodes["SM_Sci-fi_shelf001"]?.geometry && (
        <mesh
          geometry={(nodes["SM_Sci-fi_shelf001"] as THREE.Mesh).geometry}
          material={materials.PaletteMaterial004 ?? defaultMaterial}
          position={[3.232, -0.009, -7.04]}
          rotation={[-Math.PI, 0.004, -Math.PI]}
          scale={1.116}
        />
      )}

      {/* Sci-fi Stool */}
      {nodes["SM_Sci-fi_Stool"]?.geometry && (
        <mesh
          geometry={(nodes["SM_Sci-fi_Stool"] as THREE.Mesh).geometry}
          material={materials["M_Sci-fi_Stool"] ?? defaultMaterial}
          position={[-1.098, -0.009, -3.292]}
          rotation={[-Math.PI, 0.004, -Math.PI]}
          scale={1.116}
        />
      )}

      {/* Sci-fi Table */}
      {nodes["SM_Sci-fi_Table"]?.geometry && (
        <mesh
          geometry={(nodes["SM_Sci-fi_Table"] as THREE.Mesh).geometry}
          material={materials["M_Sci-fi_Table"] ?? defaultMaterial}
          position={[-3.076, -0.009, -0.057]}
          rotation={[-Math.PI, 0.004, -Math.PI]}
          scale={1.116}
        />
      )}

      {/* Walls */}
      {nodes.SM_Wall_01?.geometry && (
        <mesh
          geometry={(nodes.SM_Wall_01 as THREE.Mesh).geometry}
          material={materials.M_Wall ?? defaultMaterial}
          position={[3.044, -0.009, 3.798]}
          rotation={[-Math.PI, 0.004, -Math.PI]}
          scale={1.116}
        />
      )}

      {nodes.SM_WallWindow?.geometry && (
        <mesh
          geometry={(nodes.SM_WallWindow as THREE.Mesh).geometry}
          material={materials.M_WallWindow ?? defaultMaterial}
          position={[3.059, -0.009, -0.051]}
          rotation={[-Math.PI, 0.004, -Math.PI]}
          scale={1.116}
        />
      )}
    </group>
  );
}

useGLTF.preload("./models/Scene_update-transformed.glb");
