export const isMobile = () => { return ('ontouchstart' in document.documentElement); }

export const toggleFullScreen = (isFullscreen) => {
    isFullscreen ? document.documentElement.requestFullscreen() : document.exitFullscreen();
}