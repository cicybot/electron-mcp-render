import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Render } from './Render.tsx'
import { App } from "./App.tsx";


const Inner = () => {
    if (location.href.indexOf("render") > -1) {
        return <Render />
    } else {
        return <App />
    }

}
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Inner />
    </StrictMode>,
)
