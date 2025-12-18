// Socket.io Broadcast System
// This file handles real-time audio broadcasting to all connected clients

// Detect broadcast server URL
// If on localhost, use localhost:3000
// If on network, use same host as frontend with :3000
let BROADCAST_SERVER;

// Determine the correct server URL
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  BROADCAST_SERVER = "http://localhost:3000";
} else {
  // Running on network - use same host but different port
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  BROADCAST_SERVER = `${protocol}//${window.location.hostname}:3000`;
}

let socket = null;
let audioPlayingQueue = [];

function initBroadcast() {
  try {
    // Check if Socket.io is available
    if (typeof io === "undefined") {
      console.error("❌ Socket.io library not loaded! Check CDN connection.");
      return;
    }

    console.log("📡 Frontend URL:", window.location.href);
    console.log("📡 Attempting to connect to:", BROADCAST_SERVER);
    socket = io(BROADCAST_SERVER, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Connected to broadcast server");
      console.log("Socket ID:", socket.id);
      showNotification("🔌 Terhubung ke server broadcast", "success");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from broadcast server");
      showNotification("🔌 Terputus dari server broadcast", "error");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      console.error("Server URL:", BROADCAST_SERVER);
      console.error("Error details:", error.message);
      console.warn(
        "⚠️ Broadcast server tidak tersedia. Audio hanya akan diputar di device ini."
      );
    });

    // Listen for announcement broadcast
    socket.on("play-announcement", (data) => {
      console.log("📢 Menerima broadcast announcement");
      playBroadcastAnnouncement(data);
    });

    // Listen for code broadcast
    socket.on("play-code", (data) => {
      console.log(`🚨 Menerima broadcast code: ${data.codeName}`);
      playBroadcastCode(data);
    });
  } catch (error) {
    console.error("Error initializing broadcast:", error);
  }
}

// Broadcast announcement to all devices
function broadcastAnnouncement(audioUrl, duration) {
  if (!socket || !socket.connected) {
    console.warn("Socket not connected. Playing locally only.");
    return;
  }

  socket.emit("broadcast-announcement", {
    audioUrl: audioUrl,
    duration: duration,
  });

  console.log("📤 Announcement broadcast sent to server");
}

// Broadcast code to all devices
function broadcastCode(codeName, location = null) {
  if (!socket || !socket.connected) {
    console.warn("Socket not connected. Playing locally only.");
    return;
  }

  socket.emit("broadcast-code", {
    codeName: codeName,
    location: location,
  });

  console.log(`📤 Code ${codeName} broadcast sent to server`);
}

// Play announcement on this device
function playBroadcastAnnouncement(data) {
  if (!data.audioUrl) {
    console.error("No audio URL provided");
    return;
  }

  // Create audio element for announcement
  const audio = new Audio(data.audioUrl);
  audio.volume = 0.8;

  audio.onplay = () => {
    console.log("🔊 Playing broadcast announcement");
  };

  audio.onerror = (error) => {
    console.error("Error playing announcement:", error);
  };

  audio.onended = () => {
    console.log("✅ Announcement playback finished");
  };

  // Play the announcement
  audio.play().catch((error) => {
    console.error("Failed to play announcement:", error);
  });
}

// Play code on this device
function playBroadcastCode(data) {
  const codeName = data.codeName;
  const audioPath = `assets/audio/code/${codeName
    .toLowerCase()
    .replace(/ /g, "-")}.mp3`;

  console.log(`🎵 Playing code audio: ${audioPath}`);

  const audio = new Audio(audioPath);
  audio.volume = 0.8;

  // Check if this is CODE BLUE (special handling)
  if (codeName === "CODE BLUE") {
    // Play CODE BLUE twice
    let playCount = 0;
    audio.onended = () => {
      playCount++;
      if (playCount < 2) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error("Error replaying CODE BLUE:", error);
        });
      } else {
        console.log("✅ CODE BLUE playback finished");
      }
    };
  } else {
    // Other codes play once
    audio.onended = () => {
      console.log(`✅ ${codeName} playback finished`);
    };
  }

  audio.onerror = (error) => {
    console.error(`Error playing ${codeName}:`, error);
  };

  // Play the code audio
  audio.play().catch((error) => {
    console.error(`Failed to play ${codeName}:`, error);
  });
}

// Initialize broadcast system when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Small delay to ensure DOM is fully ready
  setTimeout(() => {
    console.log("🚀 Initializing broadcast system...");
    console.log(
      "Socket.io library:",
      typeof io !== "undefined" ? "✅ LOADED" : "❌ NOT LOADED"
    );
    initBroadcast();
  }, 500);
});

// Also try to initialize immediately if document is already ready
if (document.readyState === "loading") {
  // Already handled by event listener
} else {
  // Document is already loaded
  setTimeout(() => {
    console.log("🚀 Initializing broadcast system (direct)...");
    console.log(
      "Socket.io library:",
      typeof io !== "undefined" ? "✅ LOADED" : "❌ NOT LOADED"
    );
    if (!socket) {
      initBroadcast();
    }
  }, 500);
}
