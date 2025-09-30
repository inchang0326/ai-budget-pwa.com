import BudgetApp from "./components/BudgetApp";
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { usePWA } from "./hooks/usePWA";
import GlobalLoader from "./components/feedback/GlobalLoader";
import "./App.css";

const cli = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

function App() {
  const { needRefresh, confirmUpdate } = usePWA();

  return (
    <div>
      <QueryClientProvider client={cli}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <div role="alert">
                  <p>오류 발생: {error.message}</p>
                  <button onClick={() => resetErrorBoundary()}>
                    다시 시도
                  </button>
                </div>
              )}
            >
              <BudgetApp></BudgetApp>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <GlobalLoader></GlobalLoader>
      </QueryClientProvider>

      {needRefresh && (
        <div className="toast">
          새 버전이 있습니다.
          <button onClick={confirmUpdate}>업데이트</button>
        </div>
      )}
    </div>
  );
}

export default App;
