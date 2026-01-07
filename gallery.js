    const images = [
      {thumb: 'https://picsum.photos/id/1015/400/300', full: 'https://picsum.photos/id/1015/1200/900', alt: 'obrazek 1'},
      {thumb: 'https://picsum.photos/id/1016/400/300', full: 'https://picsum.photos/id/1016/1200/900', alt: 'obrazek 2'},
      {thumb: 'https://picsum.photos/id/1020/400/300', full: 'https://picsum.photos/id/1020/1200/900', alt: 'obrazek 3'},
      {thumb: 'https://picsum.photos/id/1024/400/300', full: 'https://picsum.photos/id/1024/1200/900', alt: 'obrazek 4'},
      {thumb: 'https://picsum.photos/id/1025/400/300', full: 'https://picsum.photos/id/1025/1200/900', alt: 'obrazek 5'},
      {thumb: 'https://picsum.photos/id/1035/400/300', full: 'https://picsum.photos/id/1035/1200/900', alt: 'obrazek 6'},
      {thumb: 'https://picsum.photos/id/1039/400/300', full: 'https://picsum.photos/id/1039/1200/900', alt: 'obrazek 7'},
      {thumb: 'https://picsum.photos/id/1043/400/300', full: 'https://picsum.photos/id/1043/1200/900', alt: 'obrazek 8'},
      {thumb: 'https://picsum.photos/id/1050/400/300', full: 'https://picsum.photos/id/1050/1200/900', alt: 'obrazek 9'}
    ];
  
    const galleryGrid = document.getElementById('galleryGrid');

    const blobUrlMap = new Map(); 

    images.forEach((imgData, idx) => {
      const card = document.createElement('div');
      card.className = 'thumb-card';
      card.setAttribute('data-thumb', imgData.thumb);
      card.setAttribute('data-full', imgData.full);
      card.setAttribute('data-alt', imgData.alt || `Image ${idx+1}`);

      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
      placeholder.textContent = 'Ładowanie...';
      card.appendChild(placeholder);

      const imgEl = document.createElement('img');
      imgEl.alt = imgData.alt || `Image ${idx+1}`;
      imgEl.style.display = 'none';
      card.appendChild(imgEl);

      galleryGrid.appendChild(card);
    });

    async function fetchImageAsBlob(url) {
      if (blobUrlMap.has(url)) return blobUrlMap.get(url);

      try {
        const resp = await fetch(url, {mode: 'cors'});
        if (!resp.ok) throw new Error('Network response was not ok');
        const blob = await resp.blob();
        const objectURL = URL.createObjectURL(blob);
        blobUrlMap.set(url, objectURL);
        return objectURL;
      } catch (err) {
        console.error('Błąd pobierania obrazu:', err);
        throw err;
      }
    }

    const observerOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          observer.unobserve(card);
          loadThumbnail(card);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.thumb-card').forEach(card => io.observe(card));

    async function loadThumbnail(card) {
      const thumbUrl = card.getAttribute('data-thumb');
      const imgEl = card.querySelector('img');
      const placeholder = card.querySelector('.placeholder');

      try {
        const objectURL = await fetchImageAsBlob(thumbUrl);
        imgEl.src = objectURL;
        imgEl.style.display = 'block';
        if (placeholder) placeholder.remove();

        imgEl.addEventListener('click', () => openModal(card));
      } catch (err) {
        if (placeholder) placeholder.textContent = 'Błąd ładowania';
      }
    }

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.getElementById('modalContent');

    async function openModal(card) {
      const fullUrl = card.getAttribute('data-full');
      const alt = card.getAttribute('data-alt') || '';
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('open');

      try {
        const objectURL = await fetchImageAsBlob(fullUrl);
        modalImage.src = objectURL;
        modalImage.alt = alt;
      } catch (err) {
        const thumbUrl = card.getAttribute('data-thumb');
        if (blobUrlMap.has(thumbUrl)) {
          modalImage.src = blobUrlMap.get(thumbUrl);
          modalImage.alt = alt;
        } else {
          modalImage.alt = 'Nie można załadować obrazu';
        }
      }

      modalClose.focus();
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modalImage.src = '';
    }

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (!modalContent.contains(e.target)) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    window.addEventListener('beforeunload', () => {
      blobUrlMap.forEach(url => {
        try { URL.revokeObjectURL(url); } catch(e) {}
      });
      blobUrlMap.clear();
    });
