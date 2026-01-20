
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import { RpcProvider } from './app/RpcContext';
import { App } from "./app/App.tsx";
import { Render } from "./app/Render.tsx";
import  View from "./app/View.tsx";

function InitWindow(){
    const [bounds, setBounds] = useState({width :0,height:0,x:0,y:0})
    useEffect(() => {
        //@ts-ignore
        window.__setBounds = (l)=>{
            setBounds((r)=>{
                return {
                    ...r,...l,
                }
            })
        }
    }, []);
    return  <View w100vw h100vh column jSpaceBetween>
        <View rowVCenter jSpaceBetween>
            <View p12>x:{bounds.x},y:{bounds.y}</View>
            <View p12>x:{bounds.x +bounds.width},y:{bounds.y}</View>
        </View>
        <View rowVCenter center>width:{bounds.width},height:{bounds.height}</View>
        <View rowVCenter jSpaceBetween>
            <View p12>x:{bounds.x},y:{bounds.y + bounds.height}</View>
            <View p12>x:{bounds.x +bounds.width},y:{bounds.y+ bounds.height}</View>
        </View>
    </View>
}
const Inner = () => {
    // If the URL contains "render", we show the specific window/desktop view
    if (location.href.indexOf("/render") > -1) {
        return <Render />;
    }else if (location.href.indexOf("/initWindow") > -1) {
        return <InitWindow />;
    } else {
        return <App />;
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
