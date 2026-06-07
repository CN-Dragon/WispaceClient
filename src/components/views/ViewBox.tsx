import {GizmoHelper, GizmoViewport, Grid, OrbitControls, TransformControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {useEffect, useMemo, useRef, useState} from "react";
import type {GeometryObject, GroupObject, Mode} from "../../types/common.ts";
import {Box3, Object3D} from "three";

export default function ViewBox({mode, objects, click}: {
    mode: Mode,
    objects: Array<GeometryObject | GroupObject>,
    click: boolean,
}) {
    const [selected, setSelected] = useState<Object3D | null>(null);

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
                        onObjectChange={() => box.setFromObject(selected)}
                    />
                    <box3Helper args={[box, 0xffff00]}/>
                </>
            )}

            {/* 遍历生成几何体 */}
            {objects.map((obj: GeometryObject | GroupObject, index) =>
                <Object key={index} obj={obj} objects={objects} selected={selected} setSelected={setSelected}
                        click={click}/>
            )}
        </Canvas>
    )
}

function Object({obj, objects, selected, setSelected, click}: {
    obj: GeometryObject | GroupObject,
    objects: Array<GeometryObject | GroupObject>,
    selected: Object3D | null,
    setSelected: (value: Object3D | null) => void,
    click: boolean
}) {
    if ('children' in obj) {
        return (
            <group>
                {obj.children.map((child, index) => (
                    <Object
                        key={index}
                        obj={child}
                        objects={objects}
                        selected={selected}
                        setSelected={setSelected}
                        click={click}
                    />
                ))}
            </group>
        );
    }
    return <GeometryObject obj={obj} objects={objects} selected={selected} setSelected={setSelected} click={click}/>
}

function GeometryObject({obj, objects, selected, setSelected, click}: {
    obj: GeometryObject,
    objects: Array<GeometryObject | GroupObject>,
    selected: Object3D | null,
    setSelected: (value: Object3D | null) => void,
    click: boolean
}) {
    const meshRef = useRef(null);

    useEffect(() => {
        if (meshRef.current && click) setSelected(meshRef.current)
    }, [setSelected, click]);

    return (
        <mesh
            uuid={obj.uuid}
            ref={meshRef}
            position={obj.position} rotation={obj.rotation}
            scale={obj.scale}
            onClick={(e) => {
                // if (e.ctrlKey) {
                //     // console.log(e.object.uuid);
                //     // console.log(objects)
                //     console.log(objects.find(obj => obj.uuid === e.object.uuid));
                // }
                e.stopPropagation()
                if (e.delta > 2) return
                const object = e.object;
                const isGroupParent = object.parent?.type === 'Group';
                const target = isGroupParent ? (e.shiftKey ? object : object.parent) : object;
                setSelected(selected === target ? null : target);
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
    )
}