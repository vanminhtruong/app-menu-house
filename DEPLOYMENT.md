# GitHub Pages Deployment Setup

Hướng dẫn deploy dự án Vue.js lên GitHub Pages sử dụng GitHub Actions.

## Cài đặt GitHub Repository

### 1. Tạo Repository trên GitHub
1. Tạo repository mới trên GitHub
2. Push code của bạn lên repository đó

### 2. Cấu hình GitHub Pages
1. Vào repository trên GitHub
2. Chọn **Settings** → **Pages**
3. Trong phần **Source**, chọn **GitHub Actions**

### 3. Cập nhật Base Path
Trong file `vite.config.ts`, thay đổi `repository-name` thành tên repository GitHub của bạn:

```typescript
base: process.env.NODE_ENV === 'production' ? '/TEN-REPOSITORY-CUA-BAN/' : '/',
```

Ví dụ: nếu repository của bạn là `my-vue-app`, thì:
```typescript
base: process.env.NODE_ENV === 'production' ? '/my-vue-app/' : '/',
```

## Deployment Process

### Tự động deploy
- Mỗi khi bạn push code lên nhánh `main` hoặc `master`, GitHub Actions sẽ tự động build và deploy
- Quá trình deploy thường mất 2-5 phút

### Manual deploy
Bạn có thể trigger deploy thủ công:
1. Vào repository trên GitHub
2. Chọn **Actions** tab
3. Chọn workflow **Deploy to GitHub Pages**
4. Click **Run workflow**

## Truy cập Website

Sau khi deploy thành công, website của bạn sẽ có thể truy cập tại:
```
https://USERNAME.github.io/REPOSITORY-NAME/
```

Thay `USERNAME` bằng username GitHub của bạn và `REPOSITORY-NAME` bằng tên repository.

## Troubleshooting

### Lỗi 404 khi truy cập
- Kiểm tra lại `base` path trong `vite.config.ts`
- Đảm bảo tên repository khớp với base path

### Build fails
- Kiểm tra GitHub Actions logs trong tab **Actions**
- Đảm bảo `package.json` có script `build`
- Kiểm tra dependencies có được cài đặt đúng

### Routing issues với Vue Router
Nếu sử dụng Vue Router với history mode, bạn có thể cần thêm file `public/404.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script type="text/javascript">
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

## Commands

### Development
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```
