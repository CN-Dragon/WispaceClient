export default function EditorPanel() {
    return (
        <section className={'w-1/5 flex flex-col'}>
            <SceneView/>
            <PropertyView/>
        </section>
    )
}

function SceneView() {
    return (
        <div className={'flex-1 m-2 border rounded'}>
            <div className={'flex justify-between items-center border-b border-black p-1'}>
                <p style={{color: 'gray'}}>场景面板</p>
                <svg className={'cursor-pointer'} height={25} width={25}>
                    <use xlinkHref={'#newFolder'}/>
                </svg>
            </div>
            <div className={'p-1 overflow-y-auto'}>
                <div className={'flex items-center justify-between'} draggable={'true'}>
                    <div className={'flex gap-1'}>
                        <svg height={20} width={20}>
                            <use xlinkHref={'#folder'}/>
                        </svg>
                        <p className={'truncate'}>Group</p>
                    </div>
                    <svg className={'cursor-pointer'} height={20} width={20}>
                        <use xlinkHref={'#delete'}/>
                    </svg>
                </div>
                <div className={'flex items-center justify-between'} draggable={'true'}>
                    <div className={'flex gap-1'}>
                        <svg height={20} width={20}>
                            <use xlinkHref={'#folder'}/>
                        </svg>
                        <p className={'truncate'}>Group</p>
                    </div>
                    <svg className={'cursor-pointer'} height={20} width={20}>
                        <use xlinkHref={'#delete'}/>
                    </svg>
                </div>
            </div>
        </div>
    )
}

function PropertyView() {
    return (
        <div className={'flex-1 m-2 border rounded'}>
            <p className={'border-b border-black p-1'} style={{color: 'gray'}}>属性面板</p>
            <div className={'p-1'}>

            </div>
        </div>
    )
}