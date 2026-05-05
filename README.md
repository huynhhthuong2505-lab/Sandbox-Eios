# 🎓 Sandbox-Eios

> Một không gian học tập và thực hành các khái niệm Git và kiểm soát phiên bản

[![GitHub](https://img.shields.io/badge/GitHub-huynhhthuong2505--lab-blue?logo=github)](https://github.com/huynhhthuong2505-lab)
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 📖 Giới Thiệu

**Sandbox-Eios** là một kho lưu trữ sandbox (hộp cát) được thiết kế để:
- 🎯 Học tập các lệnh Git cơ bản
- 🔧 Thực hành kiểm soát phiên bản
- 📚 Hiểu rõ hơn về cách hoạt động của Git
- 🚀 Phát triển kỹ năng cộng tác trên GitHub

Đây là nơi hoàn hảo để thử nghiệm, học hỏi và phát triển mà không sợ phá vỡ dự án thực tế.

---

## 📁 Cấu Trúc Dự Án

```
Sandbox-Eios/
├── README.md                  # Tệp này - hướng dẫn dự án
├── GIT_COMMANDS_GUIDE.md      # Hướng dẫn chi tiết về các lệnh Git
└── [các thư mục khác]         # Các bài học và ví dụ thực hành
```

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu

- **Git** (phiên bản 2.20 hoặc cao hơn)
- **Trình soạn thảo văn bản** (VS Code, Sublime, Vim, v.v.)
- **Terminal/Command Prompt** (để chạy các lệnh Git)

### Cài Đặt

1. **Clone kho lưu trữ này:**
   ```bash
   git clone https://github.com/huynhhthuong2505-lab/Sandbox-Eios.git
   cd Sandbox-Eios
   ```

2. **Kiểm tra trạng thái:**
   ```bash
   git status
   ```

3. **Xem lịch sử commit:**
   ```bash
   git log
   ```

---

## 📚 Nội Dung Học Tập

### 1. **Hướng Dẫn Lệnh Git** 
📄 `GIT_COMMANDS_GUIDE.md`

Tài liệu chi tiết về các lệnh Git cơ bản bao gồm:
- ✅ `git init` - Khởi tạo kho lưu trữ
- ✅ `git clone` - Sao chép kho lưu trữ
- ✅ `git status` - Kiểm tra trạng thái
- ✅ `git add` - Staging thay đổi
- ✅ `git commit` - Lưu thay đổi
- ✅ `git push` - Tải lên từ xa
- ✅ `git pull` - Tải xuống từ xa

**[Đọc hướng dẫn đầy đủ →](./GIT_COMMANDS_GUIDE.md)**

---

## 💡 Các Khái Niệm Quan Trọng

### **Quy Trình Làm Việc Cơ Bản**

```
┌─────────────────────────────────────────────┐
│  1. Chỉnh sửa tệp tin trong thư mục làm việc │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  2. Kiểm tra trạng thái: git status         │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  3. Thêm thay đổi: git add <file>           │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  4. Commit thay đổi: git commit -m "msg"    │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  5. Đẩy lên: git push                       │
└─────────────────────────────────────────────┘
```

### **Các Phần Của Kho Lưu Trữ Git**

```
Working Directory (Thư mục làm việc)
    ↓ git add
Staging Area (Khu vực staging)
    ↓ git commit
Local Repository (Kho lưu trữ cục bộ)
    ↓ git push
Remote Repository (Kho lưu trữ từ xa)
```

---

## 🎯 Các Bài Thực Hành

### **Bài 1: Khởi Tạo Kho Lưu Trữ**
```bash
# Tạo thư mục mới
mkdir my-project
cd my-project

# Khởi tạo kho lưu trữ Git
git init

# Tạo tệp README
echo "# My Project" > README.md

# Kiểm tra trạng thái
git status

# Thêm tệp vào staging
git add README.md

# Commit
git commit -m "Initial commit"
```

### **Bài 2: Làm Việc Với Thay Đổi**
```bash
# Chỉnh sửa tệp
echo "## Description" >> README.md

# Xem thay đổi
git diff

# Thêm thay đổi vào staging
git add README.md

# Commit
git commit -m "Add description to README"

# Xem lịch sử
git log
```

### **Bài 3: Đẩy Lên GitHub**
```bash
# Thêm remote repository
git remote add origin https://github.com/your-username/your-repo.git

# Tạo branch main
git branch -M main

# Đẩy lên
git push -u origin main
```

---

## 📖 Các Lệnh Git Thường Dùng

| Lệnh | Mô Tả |
|------|-------|
| `git init` | Khởi tạo kho lưu trữ mới |
| `git clone <url>` | Sao chép kho lưu trữ |
| `git status` | Kiểm tra trạng thái |
| `git add <file>` | Thêm tệp vào staging |
| `git add .` | Thêm tất cả thay đổi |
| `git commit -m "msg"` | Lưu thay đổi |
| `git push` | Đẩy lên kho lưu trữ từ xa |
| `git pull` | Tải xuống từ kho lưu trữ từ xa |
| `git log` | Xem lịch sử commit |
| `git diff` | Xem thay đổi |
| `git branch` | Quản lý branch |
| `git checkout -b <branch>` | Tạo và chuyển sang branch mới |
| `git merge <branch>` | Hợp nhất branch |
| `git stash` | Tạm thời lưu thay đổi |
| `git reset` | Hoàn tác thay đổi |

---

## 🔗 Tài Nguyên Bổ Sung

### **Tài Liệu Chính Thức**
- 📘 [Tài liệu Git Chính Thức](https://git-scm.com/doc)
- 📖 [Pro Git Book](https://git-scm.com/book/en/v2)
- 🐙 [GitHub Docs](https://docs.github.com)

### **Công Cụ và Tiện Ích**
- 🖥️ [GitHub Desktop](https://desktop.github.com/) - Client Git với giao diện đồ họa
- 🎨 [Gitk](https://git-scm.com/docs/gitk) - Công cụ trực quan hóa Git
- 📊 [GitKraken](https://www.gitkraken.com/) - Client Git mạnh mẽ

### **Tạo Hành Động Thực Hành**
- 🎮 [Learn Git Branching](https://learngitbranching.js.org/) - Game học Git tương tác
- 📝 [Git Exercises](https://gitexercises.fracz.com/) - Bài tập Git thực hành
- 🚀 [Codecademy Git Course](https://www.codecademy.com/learn/learn-git) - Khóa học Git

---

## 💻 Ví Dụ Thực Tế: Quy Trình Hoàn Chỉnh

```bash
# 1. Sao chép kho lưu trữ
git clone https://github.com/huynhhthuong2505-lab/Sandbox-Eios.git
cd Sandbox-Eios

# 2. Tạo branch mới cho tính năng
git checkout -b feature/my-feature

# 3. Chỉnh sửa tệp
echo "Nội dung mới" > new-file.txt

# 4. Kiểm tra thay đổi
git status
git diff

# 5. Thêm thay đổi
git add new-file.txt

# 6. Commit
git commit -m "Add new feature: my-feature"

# 7. Đẩy lên
git push origin feature/my-feature

# 8. Tạo Pull Request trên GitHub
# (Truy cập GitHub và nhấp vào "Compare & Pull Request")
```

---

## ⚠️ Những Sai Lầm Thường Gặp

### **1. Quên Pull Trước Khi Push**
```bash
# ❌ Sai - Có thể gặp xung đột
git push

# ✅ Đúng - Luôn pull trước
git pull
git push
```

### **2. Commit Message Không Rõ Ràng**
```bash
# ❌ Sai
git commit -m "update"
git commit -m "fix"

# ✅ Đúng
git commit -m "Fix login bug for special characters"
git commit -m "Add user authentication feature"
```

### **3. Force Push Không Cần Thiết**
```bash
# ❌ Nguy Hiểm - Có thể mất dữ liệu
git push --force

# ✅ An Toàn Hơn - Kiểm tra trước
git push --force-with-lease
```

### **4. Quên Staging Thay Đổi**
```bash
# ❌ Sai - Commit không có thay đổi
git commit -m "Update readme"

# ✅ Đúng - Thêm tệp trước
git add README.md
git commit -m "Update readme"
```

---

## 🤝 Cách Đóng Góp

1. 🔀 **Fork** kho lưu trữ này
2. 🌿 **Tạo branch** cho tính năng của bạn (`git checkout -b feature/amazing-feature`)
3. ✍️ **Commit** các thay đổi của bạn (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** đến branch (`git push origin feature/amazing-feature`)
5. 🔁 **Tạo Pull Request** để được xem xét

---

## 📋 Danh Sách Kiểm Tra Trước Khi Push

- [ ] Tôi đã kiểm tra `git status`
- [ ] Tôi đã xem `git diff` để xem thay đổi
- [ ] Tôi đã thêm tệp với `git add`
- [ ] Tôi đã commit với thông điệp rõ ràng
- [ ] Tôi đã chạy `git pull` để kiểm tra cập nhật
- [ ] Tôi đã kiểm tra xung đột nếu có
- [ ] Tôi sẵn sàng để `git push`

---

## 📝 License

Dự án này được cấp phép dưới giấy phép **MIT**. Xem tệp [LICENSE](LICENSE) để biết chi tiết.

---

## 👤 Tác Giả

- **Hộp cát-Eios** (huynhhthuong2505-lab)
- GitHub: [@huynhhthuong2505-lab](https://github.com/huynhhthuong2505-lab)

---

## 💬 Hỗ Trợ

Nếu bạn có câu hỏi hoặc cần trợ giúp:

1. 📖 Đọc [GIT_COMMANDS_GUIDE.md](./GIT_COMMANDS_GUIDE.md)
2. 🔍 Kiểm tra [GitHub Issues](https://github.com/huynhhthuong2505-lab/Sandbox-Eios/issues)
3. 📧 Liên hệ thông qua GitHub Discussions
4. 🌐 Tham khảo [tài liệu Git chính thức](https://git-scm.com/doc)

---

## 🎓 Mục Tiêu Học Tập

Sau khi hoàn thành các bài học này, bạn sẽ hiểu:

✅ Các lệnh Git cơ bản  
✅ Cách quản lý phiên bản code  
✅ Cách làm việc với remote repository  
✅ Cách tạo và hợp nhất branch  
✅ Cách cộng tác trên GitHub  
✅ Cách giải quyết xung đột Git  
✅ Các thực hành tốt nhất của Git  

---

## ⭐ Nếu Bạn Thích Dự Án Này

Vui lòng để lại một ⭐ **Star** để ủng hộ!

---

**Hạnh phúc học tập! 🚀 Happy Learning!**

---

*Cập nhật lần cuối: 05-05-2026*
