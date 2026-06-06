import {GizmoHelper, GizmoViewport, Grid, OrbitControls, TransformControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {useEffect, useMemo, useRef, useState} from "react";
import type {GeometriesObject, Mode} from "../../types/common.ts";
import {Box3, Object3D} from "three";

export default function ViewBox({mode, objects, click}: {
    mode: Mode,
    objects: GeometriesObject[],
    click: boolean,
}) {
    const [selected, setSelected] = useState<Object3D | null>(null);

    const [dragging, setDragging] = useState(false)

    const box = useMemo(() => new Box3(), []);

    useEffect(() => {
        if (selected) box.setFromObject(selected)
    }, [box, selected]);
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
            {selected && (
                <>
                    <TransformControls
                        object={selected}
                        mode={mode}
                        onMouseDown={() => setDragging(true)}
                        onMouseUp={() => setDragging(false)}
                        onObjectChange={() => box.setFromObject(selected)}
                    />
                    <box3Helper args={[box, 0xffff00]}/>
                </>
            )}

            {/*<group*/}
            {/*    onClick={(e) => {*/}
            {/*        e.stopPropagation()*/}
            {/*        if (e.shiftKey) setSelected(e.object)*/}
            {/*        else setSelected(e.eventObject)*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <mesh position={[0, 0, 0]}>*/}
            {/*        <boxGeometry args={[1, 1, 1]}/>*/}
            {/*        <meshStandardMaterial/>*/}
            {/*    </mesh>*/}
            {/*    <mesh position={[1, 1, 1]}>*/}
            {/*        <boxGeometry args={[1, 1, 1]}/>*/}
            {/*        <meshStandardMaterial/>*/}
            {/*    </mesh>*/}
            {/*</group>*/}

            {/* 遍历生成几何体 */}
            {objects.map((obj: GeometriesObject) => (
                <Geometry key={obj.id} obj={obj} setSelected={setSelected} dragging={dragging} click={click}/>
            ))}
        </Canvas>
    )
}

function Geometry({obj, setSelected, dragging, click}: {
    obj: GeometriesObject,
    setSelected: (value: Object3D) => void,
    dragging: boolean,
    click: boolean
}) {
    const meshRef = useRef(null);

    useEffect(() => {
        if (meshRef.current && click) setSelected(meshRef.current)
    }, [setSelected, click]);

    return (
        <mesh
            ref={meshRef}
            position={obj.position} rotation={obj.rotation}
            scale={obj.scale}
            onClick={(e) => {
                if (dragging) return
                e.stopPropagation();
                setSelected(e.eventObject);
            }}
        >
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
    )
}