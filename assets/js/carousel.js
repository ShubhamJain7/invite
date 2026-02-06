export function initCarousel() {
    const carousel = document.getElementById('photo-carousel');
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-image');
    if (images.length === 0) return;

    let currentIndex = 0;

    // Initialize: show first image
    images[currentIndex].classList.add('active');

    function showNextImage() {
        // Hide current image
        images[currentIndex].classList.remove('active');

        // Move to next image
        currentIndex = (currentIndex + 1) % images.length;

        // Show next image
        images[currentIndex].classList.add('active');
    }

    // Change image every 4 seconds
    setInterval(showNextImage, 4000);
}
