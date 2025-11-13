# Flutter Installation Guide for macOS

This guide will walk you through installing Flutter on your Mac step by step.

## Prerequisites Check

First, let's check your Mac setup:

1. **Check your Mac chipset** (Apple Silicon M1/M2/M3 or Intel):
   ```bash
   uname -m
   ```
   - `arm64` = Apple Silicon (M1/M2/M3)
   - `x86_64` = Intel

## Step 1: Install Xcode Command Line Tools

Xcode Command Line Tools are required for Flutter development.

```bash
xcode-select --install
```

This will open a dialog. Click "Install" and wait for it to complete (this may take 10-20 minutes).

**Verify installation:**
```bash
xcode-select -p
```
Should output: `/Library/Developer/CommandLineTools` or `/Applications/Xcode.app/Contents/Developer`

## Step 2: Install Homebrew (Package Manager)

Homebrew makes it easier to install dependencies.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the on-screen instructions. You may be asked for your password.

**After installation**, you might need to add Homebrew to your PATH. The installer will show you commands like:
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Verify Homebrew:**
```bash
brew --version
```

## Step 3: Install Flutter SDK

### Option A: Using Homebrew (Recommended - Easiest)

```bash
brew install --cask flutter
```

### Option B: Manual Installation

1. **Download Flutter SDK:**
   - For Apple Silicon (M1/M2/M3): https://storage.googleapis.com/flutter_infra_release/releases/stable/macos/flutter_macos_arm64_3.24.5-stable.zip
   - For Intel: https://storage.googleapis.com/flutter_infra_release/releases/stable/macos/flutter_macos_3.24.5-stable.zip

2. **Extract the ZIP file:**
   ```bash
   cd ~
   unzip ~/Downloads/flutter_macos_*.zip
   ```
   Or extract using Finder to `~/development/flutter` or `~/flutter`

3. **Add Flutter to PATH:**
   ```bash
   nano ~/.zshrc
   ```
   
   Add this line at the end (adjust path if you extracted elsewhere):
   ```bash
   export PATH="$PATH:$HOME/flutter/bin"
   ```
   
   Save and exit (Ctrl+X, then Y, then Enter)
   
   **Reload your shell:**
   ```bash
   source ~/.zshrc
   ```

## Step 4: Verify Flutter Installation

```bash
flutter --version
```

You should see Flutter version information.

## Step 5: Run Flutter Doctor

This checks your setup and tells you what's missing:

```bash
flutter doctor
```

This will show you:
- ✅ What's installed correctly
- ❌ What needs to be fixed
- ⚠️ What's optional

## Step 6: Install CocoaPods (for iOS development)

CocoaPods is needed for iOS dependencies:

```bash
sudo gem install cocoapods
```

You may need to enter your password.

**Note:** If you get permission errors, you might need to use:
```bash
sudo gem install -n /usr/local/bin cocoapods
```

## Step 7: Accept Xcode License (if using Xcode)

If you plan to develop for iOS, you'll need to accept the Xcode license:

```bash
sudo xcodebuild -license accept
```

## Step 8: Install Android Studio (Optional - for Android development)

If you want to develop for Android:

1. Download Android Studio: https://developer.android.com/studio
2. Install it
3. Open Android Studio and go through the setup wizard
4. Install Android SDK and Android SDK Platform-Tools

## Step 9: Final Verification

Run Flutter doctor again to see your progress:

```bash
flutter doctor -v
```

The `-v` flag shows detailed information.

**Common issues and fixes:**

- **"Flutter requires Git"**: Install Git: `brew install git`
- **"Android toolchain"**: Install Android Studio (optional if only doing iOS/web)
- **"iOS toolchain"**: Install Xcode from App Store (optional if only doing Android/web)
- **"CocoaPods"**: Run `sudo gem install cocoapods`

## Step 10: Test Flutter Installation

Create a test app to verify everything works:

```bash
flutter create test_app
cd test_app
flutter run
```

Or for your project:

```bash
cd /Users/ramberdev/swe-project-final/mobile
flutter pub get
flutter doctor
```

## Troubleshooting

### If Flutter command not found:
- Make sure you added Flutter to PATH and reloaded your shell
- Try: `source ~/.zshrc`
- Verify path: `echo $PATH` should include Flutter bin directory

### If you get permission errors:
- Make sure you're using `sudo` where needed
- Check file permissions: `ls -la ~/flutter/bin/flutter`

### If Homebrew installation fails:
- Check your internet connection
- Try: `brew update` first
- Check Homebrew website for latest install command

### If CocoaPods installation fails:
- Try: `brew install cocoapods` instead
- Or: `sudo gem install -n /usr/local/bin cocoapods`

## Quick Reference Commands

```bash
# Check Flutter version
flutter --version

# Check setup status
flutter doctor

# Update Flutter
flutter upgrade

# Get dependencies for your project
cd mobile
flutter pub get

# Run your app
flutter run

# List available devices
flutter devices
```

## Next Steps

Once Flutter is installed:

1. Navigate to your mobile project:
   ```bash
   cd /Users/ramberdev/swe-project-final/mobile
   ```

2. Get dependencies:
   ```bash
   flutter pub get
   ```

3. Check for connected devices:
   ```bash
   flutter devices
   ```

4. Run the app:
   ```bash
   flutter run
   ```

---

**Need help?** Run `flutter doctor -v` and share the output if you encounter specific errors.


