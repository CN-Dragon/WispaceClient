import {Tree, type TreeDataNode, type TreeProps} from "antd";
import {useState} from "react";

export default function EditorPanel() {
    return (
        <section className={'w-1/5 flex flex-col'}>
            <SceneView/>
            <PropertyView/>
        </section>
    )
}

function SceneView() {
    const defaultData: TreeDataNode[] = [
        {
            title: 'parent 1',
            key: '0-0',
            children: [
                {
                    title: 'leaf',
                    key: '0-0-0',
                },
                {
                    title: 'leaf',
                    key: '0-0-1',
                    children: [
                        {
                            title: 'leaf',
                            key: '0-0-1-1',
                        },
                        {
                            title: 'leaf',
                            key: '0-0-1-2',
                        },
                    ],
                },
            ],
        },
    ];

    // const generateData = (_level: number, _preKey?: React.Key, _tns?: TreeDataNode[]) => {
    //     const preKey = _preKey || '0';
    //     const tns = _tns || defaultData;
    //
    //     const children: React.Key[] = [];
    //     for (let i = 0; i < x; i++) {
    //         const key = `${preKey}-${i}`;
    //         tns.push({title: key, key,});
    //         if (i < y) {
    //             children.push(key);
    //         }
    //     }
    //     if (_level < 0) {
    //         return tns;
    //     }
    //     const level = _level - 1;
    //     children.forEach((key, index) => {
    //         tns[index].children = [];
    //         generateData(level, key, tns[index].children);
    //     });
    // };
    // generateData(z);

    const [gData, setGData] = useState(defaultData);
    const [expandedKeys] = useState(['0-0', '0-0-1']);

    const onDrop: TreeProps['onDrop'] = (info) => {
        console.log(info);
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

        const loop = (
            data: TreeDataNode[],
            key: React.Key,
            callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void,
        ) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children!, key, callback);
                }
            }
        };
        const data = [...gData];

        // Find dragObject
        let dragObj: TreeDataNode;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                item.children.unshift(dragObj);
            });
        } else {
            let ar: TreeDataNode[] = [];
            let i: number;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                // Drop on the top of the drop node
                ar.splice(i!, 0, dragObj!);
            } else {
                // Drop on the bottom of the drop node
                ar.splice(i! + 1, 0, dragObj!);
            }
        }
        setGData(data);
    };

    return (
        <div className={'flex flex-col h-1/2 m-2 border rounded'}>
            <div className={'flex justify-between items-center border-b border-black p-1'}>
                <p style={{color: 'gray'}}>场景面板</p>
                <svg className={'cursor-pointer'} height={25} width={25}>
                    <use xlinkHref={'#newFolder'}/>
                </svg>
            </div>
            <Tree
                defaultExpandedKeys={expandedKeys}
                draggable={{icon: false}}
                showLine={true}
                showIcon={true}
                blockNode
                onDrop={onDrop}
                treeData={gData}
            />
        </div>
    )
}

function PropertyView() {
    return (
        <div className={'h-1/2 m-2 border rounded'}>
            <p className={'border-b border-black p-1'} style={{color: 'gray'}}>属性面板</p>
            <div className={'p-1'}>

            </div>
        </div>
    )
}