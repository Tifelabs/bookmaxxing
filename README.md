# Bookmark Manager

A simple, elegant bookmark management system that allows users to save and organize their favorite websites. Built with vanilla JavaScript and Firebase, this application offers both free and premium tiers for users.

## Features

### Core Functionality
- Save bookmarks with title, URL, and category
- Drag and drop functionality to reorder bookmarks
- Delete unwanted bookmarks
- Responsive and clean user interface

### User Management
- Google Authentication integration
- Personalized bookmark lists for each user
- Secure data storage using Firebase

### Premium Features
- Free tier: Up to 7 bookmarks
- Premium tier ($5): Unlimited bookmarks
- One-time payment upgrade system

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Firebase
  - Authentication
  - Firestore Database
  - Real-time updates

## Prerequisites

Before you begin, ensure you have the following installed:
- A modern web browser
- A code editor (VS Code, Sublime Text, etc.)
- Node.js (for running a local development server)
- A Firebase account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bookmark-manager.git
cd bookmark-manager
```

2. Create a Firebase project:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Google Authentication
   - Create a Firestore database
   - Get your Firebase configuration

3. Update Firebase configuration:
   - Open `app.js`
   - Replace the `firebaseConfig` object with your Firebase configuration:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};
```

4. Set up a local development server:
   - Using Node.js and `http-server`:
```bash
npm install -g http-server
http-server
```
   - Or using Python:
```bash
# Python 3
python -m http.server 8080
```

5. Open your browser and navigate to:
```
http://localhost:8080
```

## File Structure

```
bookmark-manager/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── app.js             # Application logic
└── README.md          # Documentation
```

## Firebase Security Rules

Add these security rules to your Firebase console for proper database security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookmarks/{bookmark} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

## Usage

1. Sign in using your Google account
2. Add bookmarks using the form at the top
3. Drag and drop bookmarks to reorder them
4. Delete bookmarks using the delete button
5. Upgrade to premium when you reach the 7-bookmark limit

## Development

To modify the application:

1. HTML (`index.html`): Contains the structure and UI elements
2. CSS (`styles.css`): Modify for styling changes
3. JavaScript (`app.js`): Contains all the application logic

### Key JavaScript Functions

- `handleSignIn()`: Manages Google authentication
- `handleBookmarkSubmit()`: Processes new bookmark submissions
- `loadBookmarks()`: Retrieves and displays user's bookmarks
- `handleDrop()`: Manages drag and drop functionality
- `handleUpgrade()`: Processes premium upgrades

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firebase team for their excellent documentation
- Google Authentication for secure user management
- The open-source community for inspiration and best practices

## Support

For support, please:
1. Check existing issues or create a new one
2. Contact the development team
3. Review the Firebase documentation for platform-specific issues

## Future Enhancements

- [ ] Tag-based organization system
- [ ] Bookmark sharing capabilities
- [ ] Browser extension integration
- [ ] Import/export functionality
- [ ] Advanced search and filtering