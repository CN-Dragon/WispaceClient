import {useState, useRef} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, Grid, TransformControls, GizmoHelper, GizmoViewport} from '@react-three/drei';

export default function Editor() {
    // 选中的物体
    const [selected, setSelected] = useState();
    // 模式：移动 / 旋转 / 拉伸
    const [mode, setMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
    // 物体引用
    const boxRef = useRef(null);

    const ICON_CLASS = 'rounded cursor-pointer p-1 w-8 h-8';

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <div className={'absolute z-1 rounded p-1 m-5'} style={{backgroundColor: '#fff'}}>
                <svg className={ICON_CLASS}
                     style={{backgroundColor: mode === 'translate' ? '#ddd' : 'transparent', color: '#555'}}
                     onClick={() => setMode('translate')}>
                    <use xlinkHref={'#translate'}/>
                </svg>
                <svg
                    className={ICON_CLASS}
                    style={{backgroundColor: mode === 'rotate' ? '#ddd' : 'transparent', color: '#555'}}
                    onClick={() => setMode('rotate')}>
                    <use xlinkHref={'#rotate'}/>
                </svg>
                <svg
                    className={ICON_CLASS}
                    style={{backgroundColor: mode === 'scale' ? '#ddd' : 'transparent', color: '#555'}}
                    onClick={() => setMode('scale')}>
                    <use xlinkHref={'#scale'}/>
                </svg>
            </div>

            <Canvas camera={{position: [0, 2, 5], fov: 50}}
                    onPointerMissed={() => setSelected(null)}>
                {/* 灰色背景 */}
                <color attach="background" args={['rgb(170, 170, 170)']}/>

                {/* 灯光 */}
                <ambientLight intensity={0.5}/>
                <directionalLight position={[5, 5, 5]} intensity={1}/>

                {/* 网格水平线 */}
                <Grid
                    args={[30, 30]}
                    cellSize={1}
                    sectionSize={5}
                    cellColor="#555555"
                    sectionColor="#888888"
                />

                {/* 坐标轴指示器 */}
                <GizmoHelper alignment="top-right" margin={[70, 70]}>
                    <GizmoViewport/>
                </GizmoHelper>

                {/* 几何体 */}
                <mesh
                    ref={boxRef}
                    position={[0, 0, 0]}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelected(boxRef.current);
                    }}>
                    <boxGeometry args={[1, 1, 1]}/>
                    <meshStandardMaterial color="orange"/>
                </mesh>

                {/* 镜头控制器 */}
                <OrbitControls makeDefault/>

                {/* 实例控制器 */}
                {selected && <TransformControls
                    object={selected}
                    mode={mode}
                />}
            </Canvas>
        </div>
    );
}