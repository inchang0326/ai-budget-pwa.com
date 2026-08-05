import BudgetApp from "./components/BudgetApp";
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { usePWA } from "./hooks/PWA/usePWA";
import GlobalLoader from "./components/feedback/GlobalLoader";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ThemeToggle from "./components/feedback/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

const cli = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

// 로그인 되어있으면 메인으로 보내는 래퍼
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  if (session) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  const { needRefresh, confirmUpdate } = usePWA();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <div style={{ height: "100%", width: "100%" }}>
            <ThemeToggle />
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
                    <Routes>
                      <Route 
                        path="/login" 
                        element={
                          <PublicRoute>
                            <Login />
                          </PublicRoute>
                        } 
                      />
                      <Route 
                        path="/signup" 
                        element={
                          <PublicRoute>
                            <Signup />
                          </PublicRoute>
                        } 
                      />
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <BudgetApp />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ErrorBoundary>
                )}
              </QueryErrorResetBoundary>
              <GlobalLoader />
            </QueryClientProvider>

            {needRefresh && (
              <div className="toast">
                <span className="toast__message">새 버전이 있습니다.</span>
                <button className="toast__action" onClick={confirmUpdate}>
                  업데이트
                </button>
              </div>
            )}
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
