# SCP Mobile App

Flutter mobile application for the Supplier Consumer Platform (Consumer and Sales Representative access).

## Setup

1. Ensure Flutter is installed:
```bash
flutter --version
```

2. Get dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
flutter run
```

## Project Structure

```
mobile/
├── lib/
│   ├── models/        # Data models
│   ├── services/      # API services
│   ├── screens/       # Screen widgets
│   ├── widgets/       # Reusable widgets
│   ├── utils/         # Utility functions
│   └── main.dart      # Entry point
└── pubspec.yaml
```

## Features

- Consumer role: Browse catalogs, place orders, track orders, chat with suppliers
- Sales Representative role: Handle consumer communication, manage complaints, escalate issues

