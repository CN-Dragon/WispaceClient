import {GizmoHelper, GizmoViewport, Grid, OrbitControls, TransformControls} from "@react-three/drei";
import {Mesh} from "three";
import {Canvas} from "@react-three/fiber";
import {useState} from "react";
import type {GeometriesObject, Mode} from "../../types/common.ts";

export default function ViewBox({mode, objects}: { mode: Mode, objects: GeometriesObject[] }) {
    const [selected, setSelected] = useState<Mesh | null>(null);

    const [dragging, setDragging] = useState(false)

    return (
        <Canvas camera={{position: [0, 3, 5], fov: 80}} onPointerMissed={() => setSelected(null)}>
            {/* 灰色背景 */}
            <color attach="background" args={['rgb(170, 170, 170)']}/>

            {/* 环境光 */}
            <ambientLight intensity={0.5}/>
            {/* 方向光 */}
            <directionalLight position={[5, 5, 5]} intensity={1}/>

            {/* 网格水平线 */}
            <Grid
                args={[30, 30]}
                cellSize={1}
                sectionSize={5}
                cellColor="#555"
                sectionColor="#888"
            />

            {/* 坐标轴指示器 */}
            <GizmoHelper alignment="top-right" margin={[70, 70]}>
                <GizmoViewport/>
            </GizmoHelper>

            {/* 镜头控制器 */}
            <OrbitControls makeDefault/>

            {/* 实例控制器 */}
            {selected && <TransformControls
                object={selected}
                mode={mode}
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
            />}

            {/* 遍历生成几何体 */}
            {objects.map((obj) => (
                <mesh key={obj.id} position={obj.position} rotation={obj.rotation}
                      onClick={(e) => {
                          if (dragging) return
                          console.log(e.object)
                          e.stopPropagation();
                          setSelected(e.object as Mesh);
                          // console.log(selected)
                      }}>
                    {{
                        Box: <boxGeometry args={obj.args as any}/>,
                        Sphere: <sphereGeometry args={obj.args as any}/>,
                        Cylinder: <cylinderGeometry args={obj.args as any}/>,
                        Plane: <planeGeometry args={obj.args as any}/>,
                        Cone: <coneGeometry args={obj.args as any}/>,
                        Torus: <torusGeometry args={obj.args as any}/>,
                        Ring: <ringGeometry args={obj.args as any}/>,
                        Capsule: <capsuleGeometry args={obj.args as any}/>,
                        Circle: <circleGeometry args={obj.args as any}/>,
                        TorusKnot: <torusKnotGeometry args={obj.args as any}/>,
                        Icosahedron: <icosahedronGeometry args={obj.args as any}/>,
                        Dodecahedron: <dodecahedronGeometry args={obj.args as any}/>,
                        Octahedron: <octahedronGeometry args={obj.args as any}/>,
                        Tetrahedron: <tetrahedronGeometry args={obj.args as any}/>,
                    }[obj.geometry]}
                    <meshStandardMaterial side={2} color={obj.color} roughness={obj.roughness}
                                          metalness={obj.metalness}/>
                </mesh>
            ))}
        </Canvas>
    )
}