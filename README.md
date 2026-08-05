# AI Budget PWA Project

Developed with react-ts on Vite

## Skills

- States, props management: Context API + useReducer
- Re-rendering optimization with React Hooks(useCallback, useMemo, memo)
- Routing: react-router-dom
- React-query wrapping Axios for REST API
- Authentication: Supabase Auth, JWT
- PWA(Progressive Web App) build

## Features

- Basic functions: create/retrieve/update/delete transactions
- Budget visualization with charts(calendar, wordcloud, pie, bar)
- Open banking cards payment history synchronization
- Authentication: Sign up, Log in/Log out
- AI-driven investment recommendation based on the balance

## Web Structure

- Home
  - Auth
    - Login
    - Signup
  - Budget
    - Data
    - Summary
      - Investment
    - Charts
    - Transactions

## Detail Images

| Auth | Budget (Home) |
|---|---|
| <img width="100%" alt="Auth" src="https://github.com/user-attachments/assets/78c777e3-3e81-48b5-8e37-eb2cc7daf40a" /> | <img width="100%" alt="Budget Home" src="https://github.com/user-attachments/assets/e67c88c4-4d70-4158-a195-3b21611727df" /> |

| Data (by sync, by date) | Data by sync |
|---|---|
| <img width="100%" alt="Data sync" src="https://github.com/user-attachments/assets/5d9f9193-2515-4363-b433-f3414542f021" /> | <img width="100%" alt="Data sync" src="https://github.com/user-attachments/assets/9f1c0094-bbcb-44b3-b4bb-ea67491978d5" /> |

| Summary (balance, income, expense) | Investment (AI-driven) |
|---|---|
| <img width="100%" alt="Summary" src="https://github.com/user-attachments/assets/2fa2c853-4737-40ed-be98-676849b2838e" /> | <div align="center">AI studying...</div> |

| Calendar Chart | Wordcloud Chart |
|---|---|
| <img width="100%" alt="Calendar" src="https://github.com/user-attachments/assets/80341c97-12f7-4ef9-a18d-c5ca5dccae9f" /> | <img width="100%" alt="Wordcloud" src="https://github.com/user-attachments/assets/843a7c71-e898-4b2e-891c-3a13058bcd21" /> |

| Pie Chart | Bar Chart |
|---|---|
| <img width="100%" alt="Pie" src="https://github.com/user-attachments/assets/5cf7b403-3ffb-4a0d-a336-2a7ddd5e2c0d" /> | <img width="100%" alt="Bar" src="https://github.com/user-attachments/assets/68ca51c6-0cc7-4795-a232-89d5521fc9e2" /> |

| Transaction list | Transaction add |
|---|---|
| <img width="100%" alt="Transaction list" src="https://github.com/user-attachments/assets/f3a920ed-8287-4a95-91d5-62db0caf7160" /> | <img width="100%" alt="Transaction add" src="https://github.com/user-attachments/assets/29ee1344-791c-466f-85bb-fe017e2b5dd7" /> |

| Transaction edit | Transaction delete |
|---|---|
| <img width="100%" alt="Transaction edit" src="https://github.com/user-attachments/assets/c7368641-5506-4d4a-a38a-b1de1047bf16" /> | <img width="100%" alt="Transaction delete" src="https://github.com/user-attachments/assets/f469a760-8f65-485d-bf09-c5a33fc6f707" /> |

## Getting Started to dev

- node_modules 설치
  ```
  npm install
  ```
- tsconfig 내 moduleResolution의 bundler 설정으로 의존성 문제 발생 시 조치법
- IDE에서 프로젝트 TS 버전이 아닌 내장 TS 버전을 사용하면서 발생한 버전 문제
  ```
  .ts 파일 선택 → Shift + Command + P → TypeScript: Select TypeScript Version → Use Workspace Version
  ```
- DEV 서버 실행
  ```
  npm run dev
  ```
- PWA 빌드 및 실행
  ```
  npm run build
  npm run preview
  ```
