# 🧩 Quy tắc code dự án Kết Nối Giao Thương (LoginPage Style)

Đọc kĩ nhé

## 1️⃣ Cấu trúc thư mục

```
src/
├── components/   # Thành phần dùng chung (Button, Input, Navbar, ...)
├── pages/        # Trang giao diện (Public, Private, Layout)
├── routes/       # Cấu hình định tuyến
├── assets/       # Hình ảnh, icon, font
└── main.jsx, App.jsx
```

---

## 2️⃣ Cấu trúc component React (chuẩn LoginPage)

Tất cả component viết theo **arrow function**, có `export default` cuối file:

```jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - FORM */}
      {/* RIGHT SIDE - BACKGROUND IMAGE */}
    </div>
  );
};

export default LoginPage;
```

---

## 3️⃣ Quy tắc đặt tên và format

| Loại                   | Quy tắc              | Ví dụ                               |
| ---------------------- | -------------------- | ----------------------------------- |
| **Component React**    | PascalCase           | `LoginPage.jsx`, `RegisterPage.jsx` |
| **Biến / Hàm / State** | camelCase            | `handleSubmit()`, `formData`        |
| **Thư mục**            | lowercase            | `components`, `pages`               |
| **Ảnh / icon**         | lowercase + gạch nối | `login-bg.jpg`                      |
| **File JSX**           | PascalCase + .jsx    | `Navbar.jsx`                        |

**Format code:**

- Indent: 2 spaces
- Dấu nháy: double quotes `" "`
- Có `;` ở cuối dòng
- Không để dòng trống cuối file
- Comment khu vực rõ ràng bằng JSX comment `{/* ... */}`

---

<!-- ## 4️⃣ Quy tắc TailwindCSS
- Theo thứ tự: layout → spacing → color → typography → border → animation
```jsx
<button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg py-3 rounded-full transition-all">
  Submit
</button>
``` -->

---

## 5️⃣ Quy tắc form & event

- Sử dụng `useState()` để quản lý dữ liệu form.
- Bắt buộc có `e.preventDefault()` trong `handleSubmit`.
- Không gọi API trong `return`.

---

## 6️⃣ Quy tắc Routing

```jsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<HomePage />} />
  <Route path="login" element={<LoginPage />} />
  <Route path="register" element={<RegisterPage />} />
</Route>
```

---

<!-- ## 7️⃣ Quy tắc Commit & Branch

| Mục đích | Tiền tố | Ví dụ |
|----------|----------|--------|
| Thêm tính năng | feat: | feat: thêm trang đăng ký |
| Sửa lỗi | fix: | fix: lỗi nhập mật khẩu |
| Chỉnh UI | style: | style: chỉnh màu login |
| Cấu hình | chore: | chore: thêm prettier |

**Branch làm việc:**
- `feature/<tên>` → thêm mới
- `fix/<tên>` → sửa lỗi
- `chore/<tên>` → cấu hình   -->

---

<!-- ## 8️⃣ Không commit các thư mục sau:
```
node_modules/
dist/
.env
.vscode/
``` -->

---

## 9️⃣ Mục tiêu

> Code rõ ràng – chia bố cục hợp lý – class Tailwind nhất quán – comment đúng vị trí.
> Mọi người đọc LoginPage.jsx là hiểu cách code toàn dự án.
