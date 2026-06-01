import EditorView from './pages/EditorView'
import Icons from "./components/Icons.tsx";
import EditorPanel from "./pages/EditorPanel.tsx";

function App() {
    return (
        <>
            <Icons/>
            <main className={'w-screen h-screen flex'}>
                <EditorView/>
                <EditorPanel/>
            </main>
        </>
    )
}

export default App
