import {Button, Spin} from "antd";

export function MessageBox({thinking, setThinking, building, setBuilding}: {
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