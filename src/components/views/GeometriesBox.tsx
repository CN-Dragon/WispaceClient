import {type Geometries, geometryList} from "../../types/common.ts";

const ICON_CLASS = 'w-8 h-8 rounded cursor-pointer text-[#555] hover:text-black hover:scale-110';

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

export function GeometriesBox({addObject}: { addObject: (value: Geometries) => void }) {
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