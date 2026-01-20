
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RpcProvider } from './app/RpcContext';
import { Render } from './app/Render.tsx';
import { App } from "./app/App.tsx";

const Inner = () => {
    // If the URL contains "render", we show the specific window/desktop view
    if (location.href.indexOf("render") > -1) {
        return <Render />;
    } else {
        return <Render />;
    }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RpcProvider>
        <Inner />
    </RpcProvider>
  </React.StrictMode>
);
