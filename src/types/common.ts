export const geometryList = ['Box', 'Sphere', 'Cylinder', 'Plane', 'Cone', 'Torus', 'Ring', 'Capsule',
    'Circle', 'TorusKnot', 'Icosahedron', 'Dodecahedron', 'Octahedron', 'Tetrahedron']

export type Mode = 'scale' | 'translate' | 'rotate';
export type Geometries = typeof geometryList[number];

export type GeometriesObject = {
    id: string
    // label: string
    geometry: Geometries
    args: number[]
    position: [x: number, y: number, z: number]
    rotation: [x: number, y: number, z: number]
    scale: [x: number, y: number, z: number]
    color: string
    roughness: number
    metalness: number
}

export type Group = {
    id: string
    label: string
    children: GeometriesObject[]
}