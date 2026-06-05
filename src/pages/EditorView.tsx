import {useState} from 'react';
import {message} from 'antd';
import ViewBox from "../components/views/ViewBox.tsx";
import {MessageBox} from "../components/views/MessageBox.tsx";
import {ModeBox} from "../components/views/ModeBox.tsx";
import {GeometriesBox} from "../components/views/GeometriesBox.tsx";
import {DialogBox} from "../components/views/DialogBox.tsx";
import type {Geometries, GeometriesObject, Mode} from "../types/common.ts";

export default function EditorView() {
    const [objects, setObjects] = useState<GeometriesObject[]>([]);
    const [mode, setMode] = useState<Mode>('translate');
    const [thinking, setThinking] = useState(false);
    const [building, setBuilding] = useState(false);

    message.config({
        top: 70
    })

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
        <section className={'w-4/5 h-full relative'}>
            <MessageBox thinking={thinking} setThinking={setThinking} building={building} setBuilding={setBuilding}/>
            <ModeBox mode={mode} setMode={setMode}/>
            <GeometriesBox addObject={addObject}/>
            <DialogBox addObjects={addObjects} thinking={thinking} setThinking={setThinking} building={building}
                       setBuilding={setBuilding}/>
            <ViewBox mode={mode} objects={objects}/>
        </section>
    );
}