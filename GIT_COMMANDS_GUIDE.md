# Basic Git Commands Guide

Git is a distributed version control system that helps you track changes in your code, collaborate with others, and manage different versions of your project. This guide covers the essential Git commands you need to get started.

## Table of Contents
1. [git init](#git-init)
2. [git clone](#git-clone)
3. [git status](#git-status)
4. [git add](#git-add)
5. [git commit](#git-commit)
6. [git push](#git-push)
7. [git pull](#git-pull)

---

## git init

**Purpose:** Initialize a new Git repository in the current directory.

**When to use:** When you want to start version control for an existing project that isn't already a Git repository.

**Basic syntax:**
```bash
git init
```

**Examples:**

```bash
# Initialize a new repository in the current directory
git init

# Initialize a new repository with a specific name
git init my-project

# Initialize a bare repository (typically for a central server)
git init --bare my-project.git
```

**What it does:**
- Creates a `.git` directory that contains all the repository metadata and history
- Sets up the necessary Git configuration files
- Your project is now ready to track changes

**Output example:**
```
Initialized empty Git repository in /path/to/project/.git/
```

---

## git clone

**Purpose:** Copy an existing Git repository from a remote server to your local machine.

**When to use:** When you want to work on an existing project, contribute to open source, or get the latest version of a codebase.

**Basic syntax:**
```bash
git clone <repository-url>
git clone <repository-url> <directory-name>
```

**Examples:**

```bash
# Clone a repository into a folder with the same name as the repo
git clone https://github.com/user/my-project.git

# Clone a repository and give it a different local folder name
git clone https://github.com/user/my-project.git my-local-folder

# Clone using SSH (requires SSH key setup)
git clone git@github.com:user/my-project.git

# Clone only the latest version (shallow clone - faster)
git clone --depth 1 https://github.com/user/my-project.git

# Clone a specific branch
git clone --branch main https://github.com/user/my-project.git
```

**What it does:**
- Downloads the entire repository history and all files
- Creates a local copy of the remote repository
- Automatically sets up the remote tracking branch `origin`
- Checks out the default branch (usually `main` or `master`)

**Output example:**
```
Cloning into 'my-project'...
remote: Enumerating objects: 256, done.
remote: Counting objects: 100% (256/256), done.
remote: Compressing objects: 100% (150/150), done.
Receiving objects: 100% (256/256), 45.32 KiB | 1.5 MiB/s, done.
Resolving deltas: 100% (100/100), done.
```

---

## git status

**Purpose:** Check the status of your working directory and staging area.

**When to use:** Frequently throughout your workflow to understand what changes exist and what needs to be committed.

**Basic syntax:**
```bash
git status
git status --short
```

**Examples:**

```bash
# Full status output
git status

# Short format (condensed output)
git status --short

# Status with branch information
git status -b

# Check status of a specific file
git status src/index.js
```

**What it does:**
- Shows which branch you're on
- Lists untracked files (new files not yet added to Git)
- Shows modified files (tracked but with changes)
- Shows staged files (ready to be committed)
- Displays any merge or rebase conflicts

**Output example:**
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md
        modified:   src/app.js

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        config.json
        logs/

nothing added to commit but untracked changes present (working directory)
```

**Short format example:**
```
M  README.md
M  src/app.js
?? config.json
?? logs/
```

---

## git add

**Purpose:** Stage changes to be included in the next commit (move files to the staging area).

**When to use:** After making changes and before committing. You can selectively choose which changes to include.

**Basic syntax:**
```bash
git add <file-or-directory>
git add .
git add -A
```

**Examples:**

```bash
# Stage a specific file
git add README.md

# Stage multiple specific files
git add src/app.js src/utils.js

# Stage all changes in a directory
git add src/

# Stage all changes in the entire repository
git add .

# Stage all changes (including deletions)
git add -A

# Stage changes interactively (choose which hunks to stage)
git add -p

# Stage only modified files (not new files)
git add -u

# Unstage a file (remove from staging area)
git reset HEAD filename.js
```

**What it does:**
- Moves changes from your working directory to the staging area
- Prepares files for the next commit
- Allows you to review and organize what will be committed
- You can stage files gradually or all at once

**Output example:**
```
# No output if successful; re-run git status to verify:
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   README.md
        new file:   config.json
```

---

## git commit

**Purpose:** Record staged changes into the repository history with a descriptive message.

**When to use:** After staging changes with `git add`. Create meaningful commits at logical stopping points in your work.

**Basic syntax:**
```bash
git commit -m "Commit message"
git commit -m "Title" -m "Detailed description"
git commit --amend
```

**Examples:**

```bash
# Commit with a simple message
git commit -m "Add user authentication feature"

# Commit with a title and detailed description
git commit -m "Fix login bug" -m "Users were unable to login with special characters in passwords. Updated validation regex to handle special chars."

# Commit all modified tracked files (skip staging)
git commit -am "Update configuration"

# Open an editor for a longer commit message
git commit

# Modify the previous commit (amend)
git commit --amend -m "New message"

# Amend without changing the message
git commit --amend --no-edit

# Sign your commit (requires GPG setup)
git commit -m "Release v1.0.0" -S
```

**What it does:**
- Creates a permanent snapshot of your staged changes
- Records the commit message describing what changed
- Saves author, date, and parent commit information
- Creates a new commit SHA (hash) that uniquely identifies this commit
- Moves the current branch pointer forward

**Good commit message practices:**
- Start with a verb: "Add", "Fix", "Update", "Remove", "Refactor"
- Keep the first line to 50 characters or less
- Use imperative mood: "Add feature" not "Added feature"
- Include context and reasoning in the body if needed

**Output example:**
```
[main abc123d] Add user authentication feature
 2 files changed, 45 insertions(+), 10 deletions(-)
 create mode 100644 src/auth.js
```

---

## git push

**Purpose:** Upload your local commits to a remote repository (like GitHub).

**When to use:** When you're ready to share your changes with the team or back up your work to a remote server.

**Basic syntax:**
```bash
git push
git push <remote> <branch>
git push --all
git push --tags
```

**Examples:**

```bash
# Push current branch to its tracked remote (usually origin/main)
git push

# Push to a specific remote and branch
git push origin main

# Push to a different branch
git push origin feature-branch

# Push all branches
git push --all

# Push tags
git push origin --tags

# Push a specific tag
git push origin v1.0.0

# Force push (use with caution! only if you know what you're doing)
git push --force

# Force push safely (rejects if someone else pushed)
git push --force-with-lease

# Delete a remote branch
git push origin --delete feature-branch

# Set upstream tracking and push (for new branches)
git push -u origin new-feature
```

**What it does:**
- Sends your local commits to the remote repository
- Updates the remote branch to match your local branch
- Makes your changes available to other team members
- Creates a backup of your work on the remote server

**Important notes:**
- You must have push access to the repository
- If others have pushed changes, you may need to pull first
- Use `git push -u` for new branches to set up tracking

**Output example:**
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 456 bytes | 456.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To https://github.com/user/my-project.git
   abc123d..def456e  main -> main
```

---

## git pull

**Purpose:** Fetch and integrate remote changes into your local branch.

**When to use:** Regularly to keep your local repository up to date with the remote, especially when collaborating with others.

**Basic syntax:**
```bash
git pull
git pull <remote> <branch>
git pull --rebase
```

**Examples:**

```bash
# Pull from the default remote and branch (usually origin/main)
git pull

# Pull from a specific remote and branch
git pull origin main

# Pull from a different branch
git pull origin feature-branch

# Pull with rebase instead of merge (cleaner history)
git pull --rebase

# Pull but don't auto-merge (fetch only)
git pull --no-commit

# Pull and forcefully overwrite local changes (caution!)
git pull --force

# Dry run - see what would be pulled without actually doing it
git pull --dry-run

# Pull and handle merge conflicts
git pull  # will pause if conflicts exist
# Edit conflicted files
git add .
git commit -m "Resolve merge conflicts"
```

**What it does:**
- Downloads changes from the remote repository (git fetch)
- Integrates those changes into your current branch (git merge or rebase)
- Updates your local branch to match the remote version
- Ensures you have the latest code before continuing work

**Output example:**
```
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (3/3), done.
Unpacking objects: 100% (3/3), 329 bytes | 329.00 KiB/s, done.
From https://github.com/user/my-project.git
   abc123d..def456e  main       -> origin/main
Updating abc123d..def456e
Fast-forward
 README.md | 5 +++++
 1 file changed, 5 insertions(+)
```

---

## Workflow Example: Complete Project Setup

Here's how these commands work together in a typical workflow:

```bash
# 1. Clone an existing repository
git clone https://github.com/user/my-project.git
cd my-project

# 2. Check the current status
git status

# 3. Create and make changes to files
echo "console.log('Hello');" > app.js

# 4. Check what changed
git status

# 5. Stage your changes
git add app.js

# 6. Verify staging
git status

# 7. Commit with a message
git commit -m "Add main app file"

# 8. Before pushing, pull latest changes from remote
git pull

# 9. Push your changes to remote
git push

# 10. Verify everything is synced
git status
```

---

## Quick Reference Cheat Sheet

| Command | Purpose |
|---------|---------|
| `git init` | Initialize a new repository |
| `git clone <url>` | Copy a remote repository |
| `git status` | Check current state |
| `git add <file>` | Stage changes |
| `git commit -m "msg"` | Save changes with message |
| `git push` | Upload to remote |
| `git pull` | Download from remote |
| `git add .` | Stage all changes |
| `git add -p` | Stage interactively |
| `git commit --amend` | Modify last commit |
| `git push -u origin <branch>` | Push new branch and set tracking |
| `git pull --rebase` | Pull with rebase (cleaner history) |

---

## Tips for Success

✅ **Do:**
- Commit frequently with meaningful messages
- Pull before pushing to avoid conflicts
- Review changes with `git status` and `git diff`
- Use branches for features or fixes
- Keep commits small and focused

❌ **Don't:**
- Use generic messages like "Update" or "Fix bug"
- Force push unless absolutely necessary
- Commit directly to main/master in team projects
- Forget to pull before starting work
- Make huge commits with unrelated changes

---

## Additional Useful Commands

While not covered in detail here, these commands are also helpful:

- `git log` - View commit history
- `git diff` - See what changed
- `git branch` - Manage branches
- `git checkout` - Switch branches
- `git merge` - Merge branches
- `git revert` - Undo commits
- `git stash` - Temporarily save changes
- `git tag` - Mark releases

---

**Happy coding! 🚀**
