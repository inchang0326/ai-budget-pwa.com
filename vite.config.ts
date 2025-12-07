import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // PWA 플러그인

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const useProxy = env.VITE_USE_PROXY === "true";

  return {
    build: {
      emptyOutDir: true, // 빌드 시작 전에 dist 자동 비우기
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "prompt", // 새로운 SW(Service Worker) 발견 시, autoUpdate: 백그라운드 설치 + 즉시 업데이트, prompt: 유저의 선택에 따름(디폴트)
        includeAssets: [
          // manifest 외 정적 자산을 캐시에 포함
          "favicon.ico", // 브라우저 탭/북마크 아이콘 (public/favicon.ico)
          "robots.txt", // 크롤러 규칙 파일 (public/robots.txt)
          "apple-touch-icon.png", // iOS 홈 화면 아이콘 (public/apple-touch-icon.png)
        ],
        manifest: {
          // 웹 앱 매니페스트 (설치 메타 정보)
          name: "가계부 PWA", // 설치 시 전체 이름
          short_name: "가계부", // 홈 화면에 보일 짧은 이름
          description: "React + Vite + TS 기반 가계부 PWA", // 스토어/설치 정보 등에서 표시
          theme_color: "#0ea5e9", // 브라우저 UI 테마색
          background_color: "#ffffff", // 스플래시 배경색
          display: "standalone", // 앱처럼 보이기(주소창 숨김)
          start_url: "/", // 앱 시작 경로(서브경로 배포면 '/subpath/')
          scope: "/", // 서비스워커 영향 범위(서브경로 배포면 '/subpath/')
          icons: [
            // 안드로이드/크롬에서 설치에 쓰일 아이콘들
            {
              src: "/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            // maskable: 다양한 마스크(원형/라운드 등)에서도 안전한 가시 영역 확보
            {
              src: "/icons/icon-512x512-maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          skipWaiting: false, // 대기 없이 새 SW 활성화 여부: registerType가 autoUpdate면 true / prompt면 false 조합
          clientsClaim: false, // 새 SW가 즉시 페이지 제어 여부: registerType가 autoUpdate면 true / prompt면 false 조합
          cleanupOutdatedCaches: true, // 예전 캐시 정리
          // Workbox 설정(런타임 캐싱 전략 + SPA 라우팅 처리)
          navigateFallback: "/index.html", // 브라우저가 직접 라우트로 접근(새로고침/딥링크) 시 index.html 반환 → SPA 404 방지
          runtimeCaching: [
            {
              // 1) API 요청: 최신성 중요 + 네트워크 지연 시 캐시 폴백을 위해 NetworkFirst 권장
              urlPattern: new RegExp(`^${env.VITE_API_BASE_URL || "http://localhost:8000"}/.*$`, "i"),
              handler: "NetworkFirst", // 네트워크 우선, 타임아웃 후 캐시 폴백
              options: {
                cacheName: "api-cache",
                // NetworkFirst에서만 사용 가능: 타임아웃 내 응답 없으면 캐시 사용
                networkTimeoutSeconds: 5, // ← (중요) 이전 오류 원인 해결: NetworkFirst에서만 허용
                cacheableResponse: { statuses: [0, 200] }, // 0: opaque(타 도메인), 200: 정상 응답
                expiration: {
                  maxEntries: 100, // 캐시에 보관할 최대 엔트리 수
                  maxAgeSeconds: 60 * 60, // 최대 보관 시간(1시간)
                },
              },
            },
            {
              // 2) 이미지 요청: 오프라인 친화/속도 우선 → CacheFirst
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst", // 캐시 우선, 없으면 네트워크
              options: {
                cacheName: "image-cache",
                // 이미지 캐시는 용량/수명 정책만 두고 타임아웃 옵션은 사용하지 않음
                expiration: {
                  maxEntries: 200, // 이미지 캐시 엔트리 제한
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 최대 30일 보관
                },
                // cacheableResponse: { statuses: [0, 200] }, // 필요 시 활성화
              },
            },
            // 필요 시 폰트/서드파티 CDN, JSON 파일 등 규칙을 추가
            // {
            //   urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            //   handler: "CacheFirst",
            //   options: {
            //     cacheName: "font-cache",
            //     expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            //   },
            // },
          ],
        },
        // 개발 서버에서도 SW를 강제로 켜고 싶다면 true
        // 단, HMR/캐시 혼동이 잦아 일반적으로 배포 빌드/프리뷰에서 검증 권장
        devOptions: {
          enabled: false,
        },
      }),
    ],
    server: {
      proxy: useProxy
        ? {
            "/api": {
              target: env.VITE_API_BASE_URL,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          }
        : undefined,
    },
  };
});
