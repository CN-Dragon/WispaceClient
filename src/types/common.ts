export const geometryList = ['Box', 'Sphere', 'Cylinder', 'Plane', 'Cone', 'Torus', 'Ring', 'Capsule',
    'Circle', 'TorusKnot', 'Icosahedron', 'Dodecahedron', 'Octahedron', 'Tetrahedron']

export type Mode = 'scale' | 'translate' | 'rotate';
export type Geometries = typeof geometryList[number];
export type GeometriesObject = {
    id: string
    geometry: Geometries
    position: [x: number, y: number, z: number]
    rotation: [x: number, y: number, z: number]
    args: number[]
    color: string
    roughness: number
    metalness: number
}