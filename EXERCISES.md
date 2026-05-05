# 🎯 Bài Thực Hành Git Cơ Bản

Các bài thực hành này giúp bạn làm quen với các lệnh Git thông qua các ví dụ chạy được.

## 📝 Bài 1: Khởi Tạo Kho Lưu Trữ

**Mục đích:** Tạo một kho lưu trữ Git mới từ đầu

### Các Bước:

```bash
# 1. Tạo thư mục mới
mkdir git-practice-1
cd git-practice-1

# 2. Khởi tạo Git repository
git init

# 3. Kiểm tra trạng thái
git status

# 4. Tạo tệp đầu tiên
echo "# Project 1" > README.md
echo "My first Git project" >> README.md

# 5. Kiểm tra trạng thái (file chưa staged)
git status

# 6. Cấu hình Git (nếu chưa có)
git config user.name "Your Name"
git config user.email "your@email.com"

# 7. Thêm tệp vào staging
git add README.md

# 8. Kiểm tra trạng thái (file đã staged)
git status

# 9. Commit
git commit -m "Initial commit: Add README"

# 10. Xem lịch sử
git log

# 11. Xem chi tiết commit
git log --oneline
```

### Kết Quả Kỳ Vọng:

```
On branch master

No commits yet

nothing to commit (create/copy files and use "git add" to track)

... sau khi add ...

On branch master

No commits yet

Changes to be committed:
  (use "rm --cached <file>..." to unstage)
        new file:   README.md

... sau khi commit ...

commit abc123def (HEAD -> master)
Author: Your Name <your@email.com>
Date:   Mon May 5 10:00:00 2026 +0000

    Initial commit: Add README
```

---

## 📝 Bài 2: Làm Việc Với Thay Đổi

**Mục đích:** Hiểu cách theo dõi và quản lý các thay đổi file

### Các Bước:

```bash
# 1. Tạo thư mục bài 2
mkdir git-practice-2
cd git-practice-2
git init

# 2. Tạo tệp ban đầu
cat > app.py << 'EOF'
def hello():
    print("Hello, World!")

hello()
EOF

# 3. Commit lần 1
git add app.py
git commit -m "Add hello function"

# 4. Chỉnh sửa tệp
cat > app.py << 'EOF'
def hello(name):
    print(f"Hello, {name}!")

hello("Thương")
EOF

# 5. Xem thay đổi (diff)
git diff

# 6. Xem trạng thái
git status

# 7. Stage thay đổi
git add app.py

# 8. Xem staged changes
git diff --staged

# 9. Commit
git commit -m "Add parameter to hello function"

# 10. Xem lịch sử đầy đủ
git log --oneline

# 11. Xem chi tiết từng commit
git show HEAD
git show HEAD~1
```

### Kết Quả Kỳ Vọng:

```
diff --git a/app.py b/app.py
index 1234567..abcdefg 100644
--- a/app.py
+++ b/app.py
@@ -1,4 +1,4 @@
 def hello():
-    print("Hello, World!")
+def hello(name):
+    print(f"Hello, {name}!")

... lịch sử ...
commit xyz789abc (HEAD -> master)
Author: Your Name <your@email.com>
    Add parameter to hello function

commit abc123def
Author: Your Name <your@email.com>
    Add hello function
```

---

## 📝 Bài 3: Làm Việc Với Multiple Files

**Mục đích:** Thực hành thêm/xoá/sửa nhiều tệp cùng lúc

### Các Bước:

```bash
# 1. Tạo thư mục bài 3
mkdir git-practice-3
cd git-practice-3
git init

# 2. Tạo cấu trúc d�� án
mkdir src config docs

# 3. Tạo các tệp
cat > src/main.py << 'EOF'
import config

def main():
    settings = config.load()
    print(settings)

if __name__ == "__main__":
    main()
EOF

cat > config/settings.py << 'EOF'
def load():
    return {"debug": True, "port": 8080}
EOF

cat > README.md << 'EOF'
# My Application

This is a sample application.
EOF

# 4. Kiểm tra trạng thái
git status

# 5. Thêm tất cả thay đổi
git add .

# 6. Commit
git commit -m "Add project structure with main files"

# 7. Chỉnh sửa multiple files
cat >> README.md << 'EOF'

## Setup

Run: python src/main.py
EOF

cat > src/main.py << 'EOF'
import config

def main():
    settings = config.load()
    print(f"Starting with settings: {settings}")

if __name__ == "__main__":
    main()
EOF

# 8. Xem những gì thay đổi
git status

# 9. Xem diff chi tiết
git diff

# 10. Stage tất cả
git add .

# 11. Xem staged changes
git diff --staged

# 12. Commit
git commit -m "Update README and improve main script"

# 13. Xem lịch sử
git log --oneline --all
```

### Kết Quả Kỳ Vọng:

```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md
        config/
        src/

... sau commit ...

commit abc123def (HEAD -> master)
Author: Your Name <your@email.com>
    Update README and improve main script

commit xyz789abc
Author: Your Name <your@email.com>
    Add project structure with main files
```

---

## 📝 Bài 4: Staging Tuyển Chọn (Interactive Add)

**Mục đích:** Học cách stage một phần của file, không phải toàn bộ

### Các Bước:

```bash
# 1. Tạo thư mục bài 4
mkdir git-practice-4
cd git-practice-4
git init

# 2. Tạo tệp ban đầu
cat > features.txt << 'EOF'
Feature 1: Login
Feature 2: Dashboard
Feature 3: Settings
EOF

git add features.txt
git commit -m "Add initial features list"

# 3. Chỉnh sửa file (thêm nhiều thay đổi)
cat > features.txt << 'EOF'
Feature 1: Login - DONE
Feature 2: Dashboard - IN PROGRESS
Feature 3: Settings - PENDING
Feature 4: User Profile - NEW
Feature 5: Notifications - NEW
EOF

# 4. Xem thay đổi
git diff

# 5. Interactive staging (chọn hunks để stage)
git add -p

# Bạn sẽ thấy:
# (1/2) Stage this hunk [y,n,q,a,d,j,J,g,e,?]? 
# - y = stage, n = skip, a = stage all, d = discard

# Trả lời: y (stage first hunk)
# Trả lời: n (skip second hunk)

# 6. Kiểm tra staged changes
git diff --staged

# 7. Kiểm tra unstaged changes
git diff

# 8. Commit staged changes
git commit -m "Mark completed features"

# 9. Stage phần còn lại
git add .

# 10. Commit
git commit -m "Add new features to backlog"

# 11. Xem lịch sử
git log --oneline
```

### Kết Quả Kỳ Vọng:

```
Stage this hunk [y,n,q,a,d,j,J,g,e,?]? 

... sau đó ...

On branch master
Changes to be committed:
  modified:   features.txt

Changes not staged for commit:
  modified:   features.txt
```

---

## 📝 Bài 5: Amend Commit (Sửa Commit Cuối)

**Mục đích:** Học cách chỉnh sửa commit cuối cùng

### Các Bước:

```bash
# 1. Tạo thư mục bài 5
mkdir git-practice-5
cd git-practice-5
git init

# 2. Tạo tệp
cat > version.txt << 'EOF'
Version: 1.0.0
EOF

git add version.txt
git commit -m "Add version file"

# 3. Nhận ra quên thêm tệp khác
cat > changelog.md << 'EOF'
# Changelog

## v1.0.0
- Initial release
EOF

# 4. Thêm tệp quên
git add changelog.md

# 5. Amend commit (thêm file vào commit trước)
git commit --amend --no-edit

# 6. Xem lịch sử
git log --oneline

# 7. Xem commit chi tiết
git log -p

# 8. Thay đổi commit message
cat >> version.txt << 'EOF'
Released: May 5, 2026
EOF

git add version.txt

# 9. Amend với message mới
git commit --amend -m "Add version file and changelog"

# 10. Xem lịch sử
git log --oneline
```

### Kết Quả Kỳ Vọng:

```
commit abc123def (HEAD -> master)
Author: Your Name <your@email.com>
Date:   Mon May 5 10:00:00 2026 +0000

    Add version file and changelog

    Includes both version and changelog files
```

---

## 📝 Bài 6: Quay Lại Commit Trước

**Mục đích:** Học cách hoàn tác thay đổi

### Các Bước:

```bash
# 1. Tạo thư mục bài 6
mkdir git-practice-6
cd git-practice-6
git init

# 2. Tạo tệp
echo "Data v1" > data.txt
git add data.txt
git commit -m "Add data v1"

# 3. Commit 2
echo "Data v2" > data.txt
git add data.txt
git commit -m "Add data v2"

# 4. Commit 3
echo "Data v3" > data.txt
git add data.txt
git commit -m "Add data v3"

# 5. Kiểm tra lịch sử
git log --oneline

# 6. Quay lại trước commit (soft reset - giữ changes)
git reset --soft HEAD~1

# 7. Kiểm tra trạng thái
git status

# Tạo commit mới
git commit -m "Update data v2-3 combined"

# 8. Quay lại bằng hard reset (mất changes)
git reset --hard HEAD~2

# 9. Kiểm tra file
cat data.txt  # Sẽ là "Data v1"

# 10. Xem lịch sử
git log --oneline

# 11. Dùng revert thay vì reset (an toàn hơn)
echo "Data v4" > data.txt
git add data.txt
git commit -m "Add data v4"

git revert HEAD

# 12. Kiểm tra
git log --oneline
```

### Kết Quả Kỳ Vọng:

```
Before reset:
* abc123d (HEAD -> master) Add data v3
* def456e Add data v2
* ghi789f Add data v1

After soft reset:
* def456e (HEAD -> master) Update data v2-3 combined
* ghi789f Add data v1

After hard reset:
* ghi789f (HEAD -> master) Add data v1
```

---

## 📝 Bài 7: Tạo .gitignore

**Mục đích:** Học cách exclude tệp khỏi Git tracking

### Các Bước:

```bash
# 1. Tạo thư mục bài 7
mkdir git-practice-7
cd git-practice-7
git init

# 2. Tạo các tệp
echo "# Project" > README.md
echo "API_KEY=secret123" > .env
echo "Debug logs" > debug.log
mkdir node_modules
echo "dependencies" > node_modules/package.json

# 3. Kiểm tra trạng thái (sẽ thấy tất cả file)
git status

# 4. Tạo .gitignore
cat > .gitignore << 'EOF'
# Environment variables
.env

# Logs
*.log
debug.log

# Dependencies
node_modules/

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.bak
*.swp
EOF

# 5. Kiểm tra trạng thái (file bị ignore sẽ biến mất)
git status

# 6. Add và commit
git add .
git commit -m "Add gitignore and README"

# 7. Kiểm tra files được tracked
git ls-files

# 8. Tạo file mới
echo "temp data" > temp.bak
echo "new env" > .env.local

# 9. Kiểm tra (nên không thấy những file trong .gitignore)
git status

# 10. Nếu quên add file vào .gitignore trước
git rm --cached .env

# 11. Cập nhật .gitignore
echo ".env.local" >> .gitignore

# 12. Commit
git add .gitignore
git commit -m "Update gitignore"

# 13. Xem lịch sử
git log --oneline
```

### Kết Quả Kỳ Vọng:

```
Before .gitignore:
Untracked files:
  .env
  README.md
  debug.log
  node_modules/

After .gitignore:
Untracked files:
  .gitignore
  README.md

Files being tracked:
git ls-files
.gitignore
README.md
```

---

## 🎓 Tóm Tắt Bài Học

| Bài | Chủ Đề | Kỹ Năng |
|-----|--------|--------|
| 1 | Khởi tạo | `git init`, `git add`, `git commit` |
| 2 | Theo dõi thay đổi | `git diff`, `git status` |
| 3 | Multiple files | `git add .`, Cấu trúc dự án |
| 4 | Staging tuyển chọn | `git add -p` |
| 5 | Sửa commit | `git commit --amend` |
| 6 | Hoàn tác | `git reset`, `git revert` |
| 7 | Gitignore | `.gitignore`, `git rm --cached` |

---

## 📋 Danh Sách Kiểm Tra Hoàn Thành

Sau khi hoàn thành tất cả bài tập:

- [ ] Tôi hiểu `git init` và cách khởi tạo repository
- [ ] Tôi có thể sử dụng `git add` và `git commit`
- [ ] Tôi biết cách xem thay đổi với `git diff`
- [ ] Tôi có thể quản lý multiple files
- [ ] Tôi biết cách staging tuyển chọn
- [ ] Tôi có thể sửa commit với `--amend`
- [ ] Tôi biết cách hoàn tác thay đổi
- [ ] Tôi hiểu .gitignore

---

**Chúc bạn luyện tập thành công! 🚀**
