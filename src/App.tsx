import EditorView from './pages/EditorView'
import CommonIcons from "./components/Icons/CommonIcons.tsx";
import EditorPanel from "./pages/EditorPanel.tsx";
import GeometriesIcons from "./components/Icons/GeometriesIcons.tsx";

function App() {
    return (
        <>
            <CommonIcons/>
            <GeometriesIcons/>
            <main className={'w-screen h-screen flex'}>
                <EditorView/>
                {/*<EditorPanel/>*/}
            </main>
        </>
    )
}

export default App
