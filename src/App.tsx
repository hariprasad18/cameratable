import React from 'react';
import CameraTable from './components/CameraTable';
import ErrorBoundary from './ErrorBoundary'; 

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
      </header>
      <ErrorBoundary>
        <CameraTable />
      </ErrorBoundary>
    </div>
  );
};

export default App;
