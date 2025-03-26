<<<<<<< HEAD
# CGHGOLF
=======
# 청구회 골프 모임 웹사이트

청구회 골프 모임을 위한 웹사이트 프로젝트입니다. 청구회는 1957년부터 이어져 온 전통 있는 골프 모임으로, 매년 8회의 정기 모임을 개최하고 있습니다.

## 프로젝트 개요

- 청구회는 매년 8회 정기 모임(3,4,5,6,8,9,10,11월 4째주 화요일)을 갖는 골프 모임
- 이천 뉴스프링빌CC에서 모임 진행
- 5월에는 청구회장배, 10월에는 총동창회장배 대회 개최
- 2025년 3월 25일 기준 총 410회 모임 진행

## 기술 스택

- **프론트엔드**: React.js
- **상태 관리**: Context API
- **스타일링**: Tailwind CSS
- **차트 라이브러리**: Recharts
- **데이터 처리**: Lodash
- **배포**: GitHub Pages

## 개발 환경 설정

### 필요 조건

- Node.js v14.0.0 이상
- npm v6.0.0 이상

### 설치 방법

1. 저장소 클론하기:
```bash
git clone https://github.com/yourusername/chunggu-golf.git
cd chunggu-golf
```

2. 종속성 설치:
```bash
npm install
```

3. 개발 서버 실행:
```bash
npm start
```

4. 웹사이트 접속:
```
http://localhost:3000
```

## 배포 방법

GitHub Pages에 배포하려면:

```bash
npm run deploy
```

## 프로젝트 구조

```
chunggu-golf/
├── public/             # 정적 파일
├── src/                # 소스 코드
│   ├── assets/         # 이미지, 폰트 등
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── common/     # 공통 컴포넌트
│   │   └── layout/     # 레이아웃 관련 컴포넌트
│   ├── contexts/       # React Context API 파일들
│   ├── hooks/          # 커스텀 React 훅
│   ├── pages/          # 페이지 컴포넌트
│   ├── styles/         # 스타일 파일
│   ├── utils/          # 유틸리티 함수
│   ├── App.js          # 앱 컴포넌트
│   ├── index.js        # 앱 진입점
│   └── routes.js       # 라우트 정의
├── .gitignore          # Git 무시 파일 목록
├── package.json        # 프로젝트 메타데이터 및 종속성
├── tailwind.config.js  # Tailwind CSS 설정
└── README.md           # 프로젝트 문서
```

## 기능

1. **홈페이지**: 주요 정보 및 다가오는 이벤트 표시
2. **청구회 소개**: 모임 역사 및 소개
3. **모임 일정**: 연간 골프 모임 일정 및 장소
4. **갤러리**: 모임 사진 및 영상 갤러리
5. **회원 목록**: 회원 정보 및 프로필
6. **경기 결과**: 과거 모임 결과 및 통계

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 연락처

질문이나 제안이 있으시면 [이메일](mailto:contact@chunggu.org)로 연락해주세요.
>>>>>>> 4f9240e (Initial commit: Chunggu Golf Project)
