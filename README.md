# MovieStream — Frontend

Mô tả ngắn: Dự án website xem phim (MovieStream) được xây dựng bằng React + Vite. Ứng dụng hiển thị phim từ [TMDB](https://www.themoviedb.org/?language=vi) và từ backend hệ thống (system films), hỗ trợ đăng nhập / đăng ký, playlist, bình luận, quản trị (admin) và xem phim (player + lưu lịch sử xem).

## Những tính năng chính
- Trang demo / Featured: hiển thị phim trending từ TMDB.
- Home: duyệt phim (TMDB hoặc system), tìm kiếm, bộ lọc (thể loại, ngày phát hành), playlist và lịch sử xem.
- Xem chi tiết phim: `TmdbFilmDetail` (TMDB) và `SystemFilmDetail` (system films) — hiển thị thông tin, trailer, review, comment, like/dislike.
- Xem phim: trang `WatchFilm` (YouTube/embed hoặc video/iframe cho system films) với lưu thời gian xem.
- Authentication: `Login` / `Signup`, cookie-based session, quản lý thông tin người dùng (`UserDetail`).
- Admin: dashboard, upload/update system films, thống kê (popular hours, top views/likes).
- Thông báo thời gian thực bằng WebSocket/STOMP (`NotificationContext`).

## Kiến trúc & thư mục chính (thư mục `src/`)
- `src/pages` / `src/Pages`: các trang chính — `DemoPage`, `Home`, `Login`, `Signup`, `UserDetail`, `TmdbFilmDetail`, `SystemFilmDetail`, `WatchFilm`, `Admin`, `UploadSystemFilm`, `UpdateSystemFilm`.
- `src/components`: các component dùng lại (Header, Footer, Movie, MovieList, Playlist, Bookmark, Comment, Video, Image, SlideShowTopMovie, FeaturedMovie, Loading animations, Charts, v.v.).
- `src/context`: providers cho `AuthUserContext`, `NotificationContext`, `PageTransitionContext`.
- `src/services/api_service`: helper fetch (`FetchMoviesApi.jsx`) để gọi API với params/options.
- `src/constants`: URL templates cho TMDB và map API hệ thống/menu.
- `src/utils`: helper nhỏ (`formatDate.js`, `convertDataURLtoFile.js`, `cropImage.js`).

## Các route chính
- `/` → `DemoPage` (landing/demo)
- `/home` → `Home`
- `/login` → `Login`
- `/signup` → `Signup`
- `/my-info` → `UserDetail`
- `/watch-detail/theatrical-movie/:tmdbFilmId` → `TmdbFilmDetail`
- `/watch-detail/hot-movies/:systemFilmId` → `SystemFilmDetail`
- `/watch/:videoKey` → `WatchFilm`
- `/admin` → `Admin` (và `/admin/upload-film`, `/admin/update-film/:systemFilmId`)

## Thư viện & công nghệ chính
- React + Vite
- Tailwind CSS
- React Router v6
- Framer Motion (animation)
- Recharts (chart component)
- react-hook-form (form validation)
- STOMP over SockJS (`@stomp/stompjs`, `sockjs-client`) cho real-time notifications
- js-cookie để lưu cookie/session

## Giao tiếp với backend
- Các request tới backend sử dụng `fetch` với `credentials: 'include'` (cookie-based auth).
- Endpoint backend mẫu:
	- `/api/system-films/summary-list` — danh sách film hệ thống (home, admin)
	- `/api/users/*` — playlist, profile
	- `/api/watching/*` — save watching history, increase view
	- `/api/comment/*` — comment, reply, delete
	- `/admin/*` — các API quản trị
- WebSocket STOMP: kết nối đến `${VITE_WEBSITE_BASE_URL}/ws` và subscribe `/topic/new-movie`.

## Chạy dự án (local)
1. Cài đặt dependencies (dự án dùng `pnpm` nhưng `npm`/`yarn` cũng có thể chạy):

```bash
pnpm install
```

2. Chạy chế độ phát triển:

```bash
pnpm dev
```

3. Build production:

```bash
pnpm build
```

4. Preview production build (vite):

```bash
pnpm preview
```

Lưu ý: trước khi chạy, tạo file `.env` hoặc cấu hình biến môi trường tương ứng (ví dụ `.env.local`) chứa các `VITE_...` bên môi trường.

## Ghi chú vận hành / lưu ý
- Ứng dụng dùng cookie/session — backend phải bật CORS + credentials phù hợp.
- Thông báo real-time cần endpoint WebSocket và token (Authorization header trong STOMP connectHeaders).
- Một số component lưu tạm dữ liệu vào `localStorage` (ví dụ `movieVideos`, `savedTimeList`, `intervalIdsList`).
- Player: `WatchFilm` dùng YouTube iframe; `SystemFilmDetail` có thể dùng `video` tag hoặc `iframe` nếu `isUseSrc`.

## Một số file quan trọng để đọc nhanh
- `src/App.jsx` — định nghĩa routes chính.
- `src/index.jsx` — wrap với providers: `NotificationProvider`, `AuthUserProvider`, `PageTransitionProvider`.
- `src/context/NotificationContext.jsx` — WebSocket + realtime notifications.
- `src/components/Header/Header.jsx` — header, tìm kiếm, filter, menu user.
- `src/Pages/Home/Home.jsx` — logic lấy TMDB và system films, playlist, history.
