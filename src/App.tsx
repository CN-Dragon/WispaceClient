import EditorView from './pages/EditorView'
import CommonIcons from "./components/icons/CommonIcons.tsx";
// import EditorPanel from "./pages/EditorPanel.tsx";
import GeometriesIcons from "./components/icons/GeometriesIcons.tsx";

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
