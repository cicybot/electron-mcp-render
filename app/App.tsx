
import { RpcProvider } from './RpcContext';
import { Dashboard } from './Dashboard';

export const App = () => {
    return <RpcProvider>
        <Dashboard />
    </RpcProvider>
}

