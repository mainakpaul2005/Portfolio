document.addEventListener('DOMContentLoaded', () => {
  // Observer for fade-in animations
  const sections = document.querySelectorAll('section');
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // Section Indicator (Scroll Spy) functionality
  const indicatorLinks = document.querySelectorAll('.section-indicator a');
  const sectionsWithId = document.querySelectorAll('section[id]');
  const scrollContainer = document.querySelector('.scroll-container');
  const isDesktop = window.matchMedia("(min-width: 901px)").matches;

  const scrollHandler = () => {
    let currentSectionId = '';
    const scrollPosition = isDesktop ? scrollContainer.scrollTop : window.scrollY;

    sectionsWithId.forEach(section => {
      // Check if the section is in the viewport
      if (scrollPosition >= section.offsetTop - 150) { // 150px offset to trigger highlight sooner
        currentSectionId = section.getAttribute('id');
      }
    });

    indicatorLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  const scrollable = isDesktop ? scrollContainer : window;
  if (scrollable) {
    scrollable.addEventListener('scroll', scrollHandler);
    scrollHandler(); // Initial check on page load
  }
});
