const os = require('os');

// Get the default screen source based on the OS
function getDefaultSource() {
    const platform = os.platform();
    switch (platform) {
        case 'win32': return 'desktop';
        case 'darwin': return '0:'; // macOS default screen
        case 'linux': return ':0.0'; // Linux default screen
        default: throw new Error('Unsupported platform for recording.');
    }
}

// Get the default audio source based on the OS
function getDefaultAudioSource() {
    const platform = os.platform();
    switch (platform) {
        case 'win32': return 'Stereo Mix (Realtek(R) Audio)'; // Windows default audio input
        case 'darwin': return '1'; // macOS default audio input
        case 'linux': return 'pulse'; // PulseAudio on Linux
        default: return null;
    }
}

// Platform-specific FFmpeg input type
function getPlatformInput(platform) {
    switch (platform) {
        case 'win32': return 'gdigrab';
        case 'darwin': return 'avfoundation';
        case 'linux': return 'x11grab';
        default: throw new Error('Unsupported platform for recording.');
    }
}

module.exports = {
    getDefaultSource,
    getDefaultAudioSource,
    getPlatformInput
};
