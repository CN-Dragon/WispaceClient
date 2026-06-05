import type {Mode} from "../../types/common.ts";

const ICON_CLASS = 'w-8 h-8 rounded cursor-pointer text-[#555] hover:text-black hover:scale-110';

export function ModeBox({mode, setMode}: { mode: Mode, setMode: (value: Mode) => void }) {
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