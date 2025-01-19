
// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut 
} from 'https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    updateDoc
} from 'https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "bookmaxxing-1.firebaseapp.com",
    projectId: "bookmaxxing-1",
    storageBucket: "bookmaxxing-1.firebasestorage.app",
    messagingSenderId: "96734768539",
    appId: "1:96734768539:web:4af0d392c2c99af310053e",
    measurementId: "G-GSQ86J0H7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// DOM elements
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const bookmarkForm = document.getElementById('bookmarkForm');
const bookmarkList = document.getElementById('bookmarkList');
const upgradeBanner = document.getElementById('upgradeBanner');
const upgradeBtn = document.getElementById('upgradeBtn');

// Global variables
let currentUser = null;
let isPremium = false;
let bookmarkCount = 0;
let draggedItem = null;

// Event listeners
signInBtn?.addEventListener('click', handleSignIn);
signOutBtn?.addEventListener('click', handleSignOut);
bookmarkForm?.addEventListener('submit', handleBookmarkSubmit);
upgradeBtn?.addEventListener('click', handleUpgrade);

// Auth state change handler
onAuthStateChanged(auth, handleAuthStateChange);

// Authentication functions
async function handleSignIn() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error('Error signing in:', error);
    }
}

async function handleSignOut() {
    try {
        await signOut(auth);
        bookmarkList.innerHTML = '';
        toggleAuthButtons(false);
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

function handleAuthStateChange(user) {
    currentUser = user;
    if (user) {
        toggleAuthButtons(true);
        loadBookmarks();
        checkPremiumStatus();
    } else {
        toggleAuthButtons(false);
    }
}

// Helper function to toggle auth buttons
function toggleAuthButtons(isSignedIn) {
    signInBtn.style.display = isSignedIn ? 'none' : 'block';
    signOutBtn.style.display = isSignedIn ? 'block' : 'none';
}

// Bookmark management functions
async function handleBookmarkSubmit(e) {
    e.preventDefault();
    if (!currentUser) return;

    if (bookmarkCount >= 7 && !isPremium) {
        upgradeBanner.style.display = 'block';
        return;
    }

    const bookmarkData = {
        url: document.getElementById('url').value,
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        userId: currentUser.uid,
        order: bookmarkCount,
        createdAt: new Date().toISOString()
    };

    try {
        const docRef = doc(collection(db, 'bookmarks'));
        await setDoc(docRef, bookmarkData);
        bookmarkForm.reset();
        await loadBookmarks();
    } catch (error) {
        console.error('Error adding bookmark:', error);
    }
}

async function loadBookmarks() {
    if (!currentUser) return;

    try {
        const q = query(
            collection(db, 'bookmarks'),
            where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        
        bookmarkCount = querySnapshot.size;
        bookmarkList.innerHTML = '';
        
        const bookmarks = [];
        querySnapshot.forEach((doc) => {
            bookmarks.push({ id: doc.id, ...doc.data() });
        });

        bookmarks
            .sort((a, b) => a.order - b.order)
            .forEach((bookmark) => {
                addBookmarkToList(bookmark);
            });

        if (bookmarkCount >= 7 && !isPremium) {
            upgradeBanner.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading bookmarks:', error);
    }
}

function addBookmarkToList(bookmark) {
    const li = document.createElement('li');
    li.className = 'bookmark-item';
    li.draggable = true;
    li.dataset.id = bookmark.id;

    li.innerHTML = `
        <div>
            <h3>${bookmark.title}</h3>
            <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
            <span class="category">${bookmark.category}</span>
        </div>
        <button class="delete-btn" data-id="${bookmark.id}">Delete</button>
    `;

    li.querySelector('.delete-btn').addEventListener('click', deleteBookmark);
    
    // Add drag and drop handlers
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('dragend', handleDragEnd);

    bookmarkList.appendChild(li);
}

async function deleteBookmark(e) {
    const bookmarkId = e.target.dataset.id;
    try {
        await deleteDoc(doc(db, 'bookmarks', bookmarkId));
        await loadBookmarks();
    } catch (error) {
        console.error('Error deleting bookmark:', error);
    }
}

// Drag and drop functions
function handleDragStart(e) {
    draggedItem = e.target;
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

async function handleDrop(e) {
    e.preventDefault();
    const dropTarget = e.target.closest('.bookmark-item');
    
    if (dropTarget && draggedItem !== dropTarget) {
        const items = [...bookmarkList.children];
        const draggedIndex = items.indexOf(draggedItem);
        const dropIndex = items.indexOf(dropTarget);

        if (draggedIndex > dropIndex) {
            dropTarget.parentNode.insertBefore(draggedItem, dropTarget);
        } else {
            dropTarget.parentNode.insertBefore(draggedItem, dropTarget.nextSibling);
        }

        // Update order in database
        const updates = items.map((item, index) => {
            return updateDoc(doc(db, 'bookmarks', item.dataset.id), {
                order: index
            });
        });

        try {
            await Promise.all(updates);
        } catch (error) {
            console.error('Error updating bookmark order:', error);
        }
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedItem = null;
}

// Premium management functions
async function checkPremiumStatus() {
    // Simulate premium status check
    isPremium = localStorage.getItem(`premium_${currentUser.uid}`) === 'true';
}

async function handleUpgrade() {
    try {
        isPremium = true;
        localStorage.setItem(`premium_${currentUser.uid}`, 'true');
        upgradeBanner.style.display = 'none';
        alert('Upgrade successful! You can now add unlimited bookmarks.');
    } catch (error) {
        console.error('Error processing upgrade:', error);
    }
}