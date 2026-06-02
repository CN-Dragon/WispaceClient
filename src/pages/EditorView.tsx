import React, {useRef, useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, Grid, TransformControls, GizmoHelper, GizmoViewport} from '@react-three/drei';
import {Mesh} from 'three';
import {OpenAI} from "openai";
import {jsonrepair} from "jsonrepair";

const ICON_CLASS = 'w-8 h-8 rounded cursor-pointer text-[#555] hover:text-black hover:scale-110';

const geometryList = ['Box', 'Capsule', 'Circle', 'Cone', 'Cylinder', 'Dodecahedron',
    'Extrude', 'Icosahedron', 'Lathe', 'Octahedron', 'Plane','Ring','Shape','Sphere']

type Mode = 'scale' | 'translate' | 'rotate';
type Geometries = typeof geometryList[number];

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-d8431c0fffb8401abe495b519a8e0f5b',
    dangerouslyAllowBrowser: true
});

export default function EditorView() {
    // 选中实例物体
    const [selected, setSelected] = useState<Mesh | null>(null);
    // 几何体实例
    const [objects, setObjects] = useState<{
        id: string
        type: Geometries
        pos: [x: number, y: number, z: number]
        size: [width: number, height: number, depth: number]
        color: string
        roughness: number
        metalness: number
    }[]>([]);

    // 模式：移动 / 旋转 / 拉伸
    const [mode, setMode] = useState<Mode>('translate');
    const [dragging, setDragging] = useState(false)

    // 添加几何体实例
    const addObject = (value: Geometries) => {
        setObjects([
            ...objects,
            {
                id: Math.random().toString(36).slice(2), type: value, pos: [0, 0, 0],
                size: [1, 1, 1], color: '#fff', roughness: 1, metalness: 1
            }
        ]);
    };

    const addObjects = (values: any) => {
        setObjects([
            ...objects,
            ...values
        ]);
    };


    return (
        <section className={'w-4/5 h-full relative'}>
            <ModeBox mode={mode} setMode={setMode}/>
            <GeometriesBox addObject={addObject}/>
            <DialogBox addObjects={addObjects}/>
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
                    <mesh key={obj.id} position={obj.pos}
                          onClick={(e) => {
                              if (dragging) return
                              e.stopPropagation();
                              setSelected(e.object as Mesh);
                          }}>
                        {{
                            box: <boxGeometry args={obj.size}/>,
                            sphere: <sphereGeometry args={[0.7, 32, 32]}/>
                        }[obj.type]}
                        <meshStandardMaterial color={obj.color} roughness={obj.roughness} metalness={obj.metalness}/>
                    </mesh>
                ))}
            </Canvas>
        </section>
    );
}

function DialogBox({addObjects}: { addObjects: (values: any) => void }) {
    const input = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.current) {
                const completion = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "你是专业的3D建模师，精通 Three.js 的几何体、材质、网格以及物体结构和场景结构，请根据用户描述生成模型。\n" +
                                "支持的类型: boxGeometry\n" +
                                "输出格式为 JSON，示例：{result: [{type: 'boxGeometry', pos: [x,y,z], " +
                                "size: [width,height,depth], color: '#fff', roughness: 1, metalness: 1},...]}"
                        },
                        {
                            "role": "user",
                            "content": input.current.value
                        }],
                    model: "deepseek-v4-flash",
                });
                const content = completion.choices[0].message.content;
                const json = jsonrepair(content);
                const result = JSON.parse(json).result;
                console.log(result)
                result.forEach((item) => {
                    item.id = Math.random().toString(36).slice(2);
                });
                addObjects(result)
                // input.current.value = ''
            }
        }
    };

    return (
        <textarea
            ref={input}
            onKeyDown={handleKeyDown}
            className={'bg-white rounded-lg focus:outline-none absolute w-150 min-h-20 p-2 z-1 bottom-10 left-1/2 -translate-x-1/2'}
            style={{resize: 'none'}} placeholder={'发送消息进行Ai建模...'}/>
    )
}

function GeometriesBox({addObject}: { addObject: (value: Geometries) => void }) {
    return (
        <div className={'flex gap-2 rounded p-1 bg-white absolute z-1 top-5 left-1/2 -translate-x-1/2'}>
            {geometryList.map((geom) => (
                <svg
                    className={ICON_CLASS}
                    onClick={() => addObject(geom)}
                >
                    <use xlinkHref={'#' + geom}/>
                </svg>
            ))}
        </div>
    )
}

function ModeBox({mode, setMode}: { mode: Mode, setMode: (value: Mode) => void }) {
    return (
        <div className={'flex flex-col gap-1 absolute z-1 rounded p-1 bg-white top-5 left-5'}>
            <svg className={ICON_CLASS}
                 style={{backgroundColor: mode === 'translate' ? '#ddd' : 'transparent', padding: 4}}
                 onClick={() => setMode('translate')}>
                <use xlinkHref={'#translate'}/>
            </svg>
            <svg
                className={ICON_CLASS}
                style={{backgroundColor: mode === 'rotate' ? '#ddd' : 'transparent', padding: 4}}
                onClick={() => setMode('rotate')}>
                <use xlinkHref={'#rotate'}/>
            </svg>
            <svg
                className={ICON_CLASS}
                style={{backgroundColor: mode === 'scale' ? '#ddd' : 'transparent', padding: 4}}
                onClick={() => setMode('scale')}>
                <use xlinkHref={'#scale'}/>
            </svg>
        </div>
    )
}