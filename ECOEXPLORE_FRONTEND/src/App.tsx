import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/providers/AuthProvider';
import { UIProvider } from '@/providers/UIProvider';
import RootRoutes from '@/routes/RootRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <RootRoutes />
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
