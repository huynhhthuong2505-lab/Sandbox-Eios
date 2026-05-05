# 🎓 Các Tài Liệu Nâng Cao Git

## Phần 1: Branching & Merging

### Giới Thiệu Branch

**Branch** là một con đường phát triển độc lập. Nó cho phép bạn làm việc trên tính năng khác nhau mà không ảnh hưởng đến code chính (main branch).

### Các Lệnh Branch Cơ Bản

```bash
# Xem tất cả branch
git branch
git branch -a

# Tạo branch mới
git branch feature-login
git branch feature-dashboard

# Chuyển sang branch
git checkout feature-login
git checkout -b feature-payment  # Tạo và chuyển sang cùng lúc

# Xóa branch
git branch -d feature-old
git branch -D feature-remove-force  # Force delete

# Đổi tên branch
git branch -m old-name new-name
git branch -m new-name  # Đổi tên branch hiện tại
```

### Workflow Branching Thực Tế

```bash
# 1. Tạo branch mới từ main
git checkout main
git pull
git checkout -b feature/user-authentication

# 2. Làm việc trên tính năng
echo "def login():" >> auth.py
echo "    pass" >> auth.py
git add auth.py
git commit -m "Add login function"

# 3. Commit thêm
echo "def register():" >> auth.py
echo "    pass" >> auth.py
git add auth.py
git commit -m "Add register function"

# 4. Kiểm tra lịch sử
git log --oneline

# 5. Chuyển về main trước khi merge
git checkout main

# 6. Merge branch vào main
git merge feature/user-authentication

# 7. Xóa branch sau khi merge
git branch -d feature/user-authentication

# 8. Push lên remote
git push origin main
```

### Xung Đột Merge (Merge Conflicts)

```bash
# 1. Tình huống xung đột
# main branch: version = "1.0"
# feature branch: version = "2.0"

# 2. Khi merge
git merge feature/version-update

# 3. Lỗi xung đột
# CONFLICT (content): Merge conflict in file.txt

# 4. Mở file và sửa
# <<<<<<< HEAD
# version = "1.0"
# =======
# version = "2.0"
# >>>>>>> feature/version-update

# 5. Chọn version đúng, xóa các dấu conflict
# version = "2.0"

# 6. Commit merge
git add file.txt
git commit -m "Merge feature/version-update"

# 7. Hoàn tác merge nếu sai
git merge --abort
```

---

## Phần 2: Remote Repository & Push/Pull

### Cấu Hình Remote

```bash
# Xem remote repositories
git remote
git remote -v

# Thêm remote
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# Xóa remote
git remote remove origin

# Đổi tên remote
git remote rename origin upstream

# Thay đổi URL
git remote set-url origin https://github.com/user/new-repo.git
```

### Push & Pull Nâng Cao

```bash
# Push branch mới lên remote
git push -u origin feature-branch

# Push lên branch khác
git push origin main:staging

# Push tags
git push origin --tags
git push origin v1.0.0

# Force push (cẩn thận!)
git push --force
git push --force-with-lease  # Safer

# Pull từ remote khác
git pull upstream main

# Fetch mà không merge
git fetch origin
git fetch --all

# Xóa remote branch
git push origin --delete feature-branch
```

### Tracking Branches

```bash
# Set upstream cho branch
git branch -u origin/main
git branch --set-upstream-to=origin/main

# Xem upstream branch
git branch -vv

# Pull từ upstream tự động
git pull  # Sử dụng tracked branch
```

---

## Phần 3: Rebasing

**Rebase** thay đổi lịch sử commit. Nó giúp giữ lịch sử sạch và tuyến tính.

```bash
# Rebase branch
git rebase main

# Interactive rebase (chỉnh sửa commit)
git rebase -i HEAD~3  # Rebase 3 commit cuối

# Trong interactive mode:
# pick = sử dụng commit
# reword = sửa message
# squash = gộp vào commit trước
# fixup = gộp và bỏ message
# drop = xóa commit

# Ví dụ:
# pick abc123 Add feature
# squash def456 Fix bug
# reword ghi789 Update docs

# Tiếp tục sau conflict
git rebase --continue

# Hoàn tác rebase
git rebase --abort

# Force push sau rebase
git push --force-with-lease
```

---

## Phần 4: Stashing - Tạm Lưu Thay Đổi

**Stash** cho phép tạm thời lưu thay đổi mà không commit.

```bash
# Stash thay đổi
git stash

# Stash với message
git stash save "WIP: feature in progress"
git stash push -m "message"

# Xem stash
git stash list
git stash show
git stash show -p  # Chi tiết

# Lấy stash back
git stash pop  # Lấy stash cuối và xóa
git stash apply  # Lấy stash mà không xóa
git stash apply stash@{2}  # Lấy stash cụ thể

# Xóa stash
git stash drop
git stash drop stash@{2}
git stash clear  # Xóa tất c���

# Ứng dụng thực tế
git stash
git pull
git stash pop
```

---

## Phần 5: Tagging & Versioning

**Tags** đánh dấu các commit quan trọng (thường là release versions).

```bash
# Tạo lightweight tag
git tag v1.0.0

# Tạo annotated tag (có message)
git tag -a v1.0.0 -m "Version 1.0.0 Release"

# Xem tags
git tag
git tag -l "v1.*"

# Xem chi tiết tag
git show v1.0.0

# Xóa tag
git tag -d v1.0.0

# Push tags
git push origin v1.0.0
git push origin --tags

# Tag trên commit cụ thể
git tag v1.0.0 abc123

# Hoàn tác tag
git push origin -d v1.0.0  # Xóa trên remote
```

---

## Phần 6: Reviewing Commit History

```bash
# Log với format tùy chỉnh
git log --oneline
git log --graph --oneline --all
git log --stat  # Thống kê thay đổi
git log -p  # Hiển thị diff

# Log ngày cụ thể
git log --since="2 weeks ago"
git log --until="2026-05-01"

# Log của tác giả
git log --author="Your Name"
git log --grep="keyword"

# Log của file cụ thể
git log -- filename.txt
git log -p -- filename.txt

# Log của range commits
git log abc123..def456
git log main..feature  # Commits trong feature chưa có trong main
```

---

## Phần 7: Finding Bugs - Blame & Bisect

### Git Blame

```bash
# Xem ai viết từng dòng
git blame filename.txt

# Chi tiết hơn
git blame -l filename.txt  # Full SHA

# Blame đặc tính
git blame --date=short filename.txt
```

### Git Bisect - Tìm Commit Gây Bug

```bash
# Bắt đầu bisect
git bisect start

# Đánh dấu commit xấu (hiện tại - có bug)
git bisect bad

# Chuyển về commit tốt
git checkout abc123  # Commit cũ không có bug
git bisect good

# Git sẽ tự động checkout commit giữa để test
# Kiểm tra xem bug có ở commit này không

# Đánh dấu
git bisect good  # Commit này tốt
# hoặc
git bisect bad  # Commit này xấu

# Lặp lại cho đến khi tìm được commit gây bug
git bisect reset  # Kết thúc bisect
```

---

## 🎓 Mẹo & Thủ Thuật

### Aliases Hữu Ích

```bash
# Tạo alias
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'

# Sử dụng
git st
git co main
git visual
```

### Cherry-pick - Lấy Commit Từ Branch Khác

```bash
# Copy commit từ branch khác
git cherry-pick abc123

# Copy multiple commits
git cherry-pick abc123..def456

# Cherry-pick với edit
git cherry-pick -e abc123

# Continue sau conflict
git cherry-pick --continue
```

### Reflog - Lịch Sử Tham Chiếu

```bash
# Xem tất cả thay đổi HEAD
git reflog

# Khôi phục từ reflog
git reset --hard HEAD@{2}
```

---

## 📚 Tài Liệu Tham Khảo Thêm

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git)

---

**Happy Learning! 🚀**
