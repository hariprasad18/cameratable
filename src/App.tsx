import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary'; 

const CameraTable = lazy(() => import('./components/CameraTable'));

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
      </header>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <CameraTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
