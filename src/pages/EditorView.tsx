import {useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, Grid, TransformControls, GizmoHelper, GizmoViewport} from '@react-three/drei';
import {Mesh} from 'three';
import {OpenAI} from "openai";
import {jsonrepair} from "jsonrepair";
import {Button, Input, Select, Space, Spin, message} from 'antd';
import TextArea from "antd/es/input/TextArea";
import {useCommonStore} from "../store/commonStore.ts";

const ICON_CLASS = 'w-8 h-8 rounded cursor-pointer text-[#555] hover:text-black hover:scale-110';

const geometryList = ['Box', 'Sphere', 'Cylinder', 'Plane', 'Cone', 'Torus', 'Ring', 'Capsule',
    'Circle', 'TorusKnot', 'Icosahedron', 'Dodecahedron', 'Octahedron', 'Tetrahedron']

const geometryNames: Record<Geometries, string> = {
    Box: '立方体',
    Capsule: '胶囊体',
    Circle: '圆面',
    Cone: '圆锥',
    Cylinder: '圆柱',
    Dodecahedron: '十二面体',
    Icosahedron: '二十面体',
    Octahedron: '八面体',
    Plane: '平面',
    Ring: '圆环',
    Sphere: '球体',
    Tetrahedron: '四面体',
    Torus: '圆环结',
    TorusKnot: '环面结',
};


type Mode = 'scale' | 'translate' | 'rotate';
type Geometries = typeof geometryList[number];

export default function EditorView() {
    // 选中实例物体
    const [selected, setSelected] = useState<Mesh | null>(null);
    // 几何体实例
    const [objects, setObjects] = useState<{
        id: string
        geometry: Geometries
        position: [x: number, y: number, z: number]
        rotation: [x: number, y: number, z: number]
        args: number[]
        color: string
        roughness: number
        metalness: number
    }[]>([]);

    message.config({
        top: 70
    })

    // 模式：移动 / 旋转 / 拉伸
    const [mode, setMode] = useState<Mode>('translate');
    const [dragging, setDragging] = useState(false)
    const [thinking, setThinking] = useState(false);
    const [building, setBuilding] = useState(false);

    const argsMap: Record<string, number[]> = {
        Box: [1, 1, 1],
        Sphere: [1, 32, 16],
        Cylinder: [1, 1, 2],
        Plane: [1, 1],
        Cone: [1, 2],
        Torus: [1, 0.4, 12],
        Ring: [1, 2, 8],
        Capsule: [1, 1, 10, 20],
        Circle: [1, 32],
        TorusKnot: [1, 0.3, 64, 8, 2, 3],
        Icosahedron: [1, 0],
        Dodecahedron: [1, 0],
        Octahedron: [1, 0],
        Tetrahedron: [1, 0]
    };

    // 添加几何体实例
    const addObject = (value: Geometries) => {
        setObjects([
            ...objects,
            {
                id: Math.random().toString(36).slice(2), geometry: value, position: [0, 0, 0],
                rotation: [0, 0, 0], args: argsMap[value], color: '#fff', roughness: 1, metalness: 1
            }
        ]);
    };

    const addObjects = (values: any) => {
        values.id = Math.random().toString(36).slice(2);
        values.position[1] += 0.1
        setObjects(prev => [...prev, values]);
    };


    return (
        <section className={'w-5/5 h-full relative'}>
            <MessageBox thinking={thinking} setThinking={setThinking} building={building} setBuilding={setBuilding}/>
            <ModeBox mode={mode} setMode={setMode}/>
            <GeometriesBox addObject={addObject}/>
            <DialogBox addObjects={addObjects} thinking={thinking} setThinking={setThinking} building={building}
                       setBuilding={setBuilding}/>
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
                              e.stopPropagation();
                              setSelected(e.object as Mesh);
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
        </section>
    );
}

function MessageBox({thinking, setThinking, building, setBuilding}: {
    thinking: boolean,
    setThinking: (value: boolean) => void,
    building: boolean,
    setBuilding: (value: boolean) => void
}) {
    return (
        <>
            {thinking && <div
                className={'absolute left-1/2 -translate-x-1/2 z-1 top-20 bg-white p-2 rounded-xl flex items-center gap-2'}>
                <Spin/>
                {building ? <p>Ai建模中...</p> : <p>Ai思考中...</p>}
                <Button size={'small'} danger onClick={() => {
                    setThinking(false)
                    setBuilding(false)
                }}>取消</Button>
            </div>
            }
        </>
    )
}

function DialogBox({addObjects, thinking, setThinking, building, setBuilding}: {
    addObjects: (values: any) => void,
    thinking: boolean,
    setThinking: (value: boolean) => void,
    building: boolean,
    setBuilding: (value: boolean) => void
}) {
    const model = useCommonStore((state: any) => state.model);
    const deepSeekKey = useCommonStore((state: any) => state.deepSeekKey);
    const douBaoKey = useCommonStore((state: any) => state.douBaoKey);
    const setModel = useCommonStore((state: any) => state.setModel);
    const setDeepSeekKey = useCommonStore((state: any) => state.setDeepSeekKey);
    const setDouBaoKey = useCommonStore((state: any) => state.setDouBaoKey);

    const apiKey = model.startsWith('deepseek') ? deepSeekKey : douBaoKey;

    const baseURL = model.startsWith('deepseek')
        ? 'https://api.deepseek.com'
        : 'https://ark.cn-beijing.volces.com/api/v3';

    const openai = apiKey ? new OpenAI({
        baseURL,
        apiKey,
        dangerouslyAllowBrowser: true
    }) : null;

    const [input, setInput] = useState('');

    const handleKeyDown = async () => {
        if (!openai) return message.warning('请输入模型API Key')
        if (input && !thinking) {
            setThinking(true)
            try {
                const stream = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "你是专业的3D建模师，精通 Three.js 的几何体、材质、网格以及物体结构和场景结构。请根据用户的自然语言描述，生成一个符合物理常识、无穿模、无悬浮的 Three.js 场景模型，输出为严格的 JSON 格式。\n" +
                                "## 规则\n" +
                                "1. 使用Plane和Circle创建地面时角度旋转(x=Math.PI / 2)。\n" +
                                "2. 严格控制位置距离，避免模型之间出现悬浮或穿模现象。" +
                                "## 支持的几何体geometry以及参数args\n" +
                                "- Box: [width, height, depth]\n" +
                                "- Sphere: [radius, widthSegments,heightSegments]\n" +
                                "- Cylinder: [radiusTop, radiusBottom, height]\n" +
                                "- Plane: [width, height]\n" +
                                "- Cone: [radius, height]\n" +
                                "- Torus: [radius, tube, radialSegments]\n" +
                                "- Ring: [innerRadius, outerRadius, thetaSegments]\n" +
                                "- Capsule: [radius, height, capSegments, radialSegments]\n" +
                                "- Circle: [radius, segments]\n" +
                                "- TorusKnot: [radius, tube, tubularSegments, radialSegments, p, q]\n" +
                                "- Icosahedron / Dodecahedron / Octahedron / Tetrahedron: [radius, detail]" +
                                "输出格式为 JSON，示例：{result: [{geometry: 'Box', position: [x,y,z], rotation: [x,y,z]," +
                                "args: [width,height,depth], color: '#fff', roughness: 1, metalness: 1},...]}"
                        },
                        {
                            "role": "user",
                            "content": input
                        }],
                    model: model,
                    stream: true
                })
                let fullContent = '';
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        if (!building) setBuilding(true)
                        fullContent += content;
                        if (fullContent.includes('result')) fullContent = ''
                        const match = fullContent.match(/\{.*?}/s);
                        if (match) {
                            const check = jsonrepair(match[0]);
                            const json = JSON.parse(check);
                            console.log(json)
                            fullContent = ''
                            addObjects(json)
                        }
                    }
                }
            } catch (err) {
                message.error(err.toString())
            } finally {
                // setBuilding(false)
                // setThinking(false);
            }
        }
    };

    return (
        <div className={'absolute w-150 z-1 bottom-5 left-1/2 -translate-x-1/2'}>
            <Space.Compact style={{width: '100%'}}>
                <Select
                    style={{width: 230, textAlign: 'center'}}
                    value={model}
                    onChange={setModel}
                    options={[
                        {value: 'doubao-seed-2-0-pro', label: 'doubao seed 2.0 pro'},
                        {value: 'doubao-seed-2-0-lite', label: 'doubao seed 2.0 lite'},
                        {value: 'doubao-seed-2-0-mini', label: 'doubao seed 2.0 mini'},
                        {value: 'deepseek-v4-flash', label: 'deepseek v4 flash'},
                        {value: 'deepseek-v4-pro', label: 'deepseek v4 pro'},
                    ]}
                />
                <Input.Password
                    placeholder="api key"
                    allowClear
                    value={apiKey}
                    onChange={(e) => {
                        if (model.startsWith('deepseek'))
                            setDeepSeekKey(e.target.value);
                        else setDouBaoKey(e.target.value);
                    }}
                />
            </Space.Compact>
            <div className={'rounded-lg bg-white p-2 mt-2'}>
                <TextArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{border: 'none', boxShadow: 'none'}}
                    placeholder="发送消息进行Ai建模..."
                    onPressEnter={(e) => {
                        e.preventDefault();
                        handleKeyDown()
                    }}
                    autoSize={{minRows: 3, maxRows: 5}}
                />
                <div className={'flex justify-between mt-2'}>
                    <div className={'flex gap-2'}>
                        <Space.Compact>
                            <Space.Addon>模型精度</Space.Addon>
                            <Select defaultValue="low"
                                    options={[{value: 'low', label: '低'},
                                        {value: 'medium', label: '中'},
                                        {value: 'high', label: '高'}]}/>
                        </Space.Compact>
                        <Button>提示词优化</Button>
                    </div>
                    <div className={'flex gap-4'}>
                        <svg width={32} height={32} className={'cursor-pointer'}>
                            <title>图片生成模型</title>
                            <use xlinkHref={'#picture'}/>
                        </svg>
                        <Button type={'primary'} loading={thinking} onClick={handleKeyDown}>发送 (Enter)</Button>
                    </div>
                </div>
            </div>
        </div>
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
                    <title>{geometryNames[geom]}</title>
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