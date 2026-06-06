import {useCommonStore} from "../../store/commonStore.ts";
import {OpenAI} from "openai";
import {useState} from "react";
import {Button, Input, message, Select, Space} from "antd";
import {jsonrepair} from "jsonrepair";
import TextArea from "antd/es/input/TextArea";

export function DialogBox({addObjects, thinking, setThinking, building, setBuilding}: {
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
                            content: "你是专业的3D建模师，精通 Three.js 的几何体、材质、网格以及物体结构和场景结构。请根据用户的自然语言描述，生成一个符合物理常识，物体结构合理，无穿模、无悬浮的 Three.js 场景模型，输出为严格的 JSON 格式。\n" +
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
                                "输出格式为 JSON，示例：{result: [{geometry: 'Box', args: [width,height,depth]," +
                                "position: [x,y,z], rotation: [x,y,z], scale:[x,y,z] color: '#fff', roughness: 1," +
                                "metalness: 1},...]}"
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
                            // console.log(json)
                            fullContent = ''
                            addObjects(json)
                        }
                    }
                }
            } catch (err) {
                if (err instanceof Error) {
                    message.error(err.message);
                } else {
                    message.error(String(err));
                }
            } finally {
                setBuilding(false)
                setThinking(false)
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
                        {/*<Space.Compact>*/}
                        {/*    <Space.Addon>模型精度</Space.Addon>*/}
                        {/*    <Select defaultValue="low"*/}
                        {/*            options={[{value: 'low', label: '低'},*/}
                        {/*                {value: 'medium', label: '中'},*/}
                        {/*                {value: 'high', label: '高'}]}/>*/}
                        {/*</Space.Compact>*/}
                        <Button>提示词优化</Button>
                    </div>
                    <div className={'flex gap-4'}>
                        {/*<svg width={32} height={32} className={'cursor-pointer'}>*/}
                        {/*    <title>图片生成模型</title>*/}
                        {/*    <use xlinkHref={'#picture'}/>*/}
                        {/*</svg>*/}
                        <Button type={'primary'} loading={thinking} onClick={handleKeyDown}>发送 (Enter)</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}