// Songs catalog filtering and search functionality

document.addEventListener('DOMContentLoaded', function() {
    initSongsFilter();
    initSongsSearch();
    initShowMoreButtons();
});

function initSongsFilter() {
    // Language filter
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.dataset.lang;

            // Update active button
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter songs
            filterSongs(lang, null);
        });
    });

    // Genre filter
    const genreSelect = document.getElementById('genreFilter');
    if (genreSelect) {
        genreSelect.addEventListener('change', function() {
            const genre = this.value;
            const activeLang = document.querySelector('.lang-btn.active').dataset.lang;
            filterSongs(activeLang, genre);
        });
    }
}

function initSongsSearch() {
    const searchInput = document.getElementById('songSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const songCards = document.querySelectorAll('.song-card, .song-item');

        songCards.forEach(card => {
            const title = card.querySelector('.song-title, h4');
            const artist = card.querySelector('.song-artist, p');

            if (title && artist) {
                const titleText = title.textContent.toLowerCase();
                const artistText = artist.textContent.toLowerCase();

                if (titleText.includes(searchTerm) || artistText.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
}

function filterSongs(lang, genre) {
    const songCards = document.querySelectorAll('.song-card');
    const songItems = document.querySelectorAll('.song-item');

    // Filter song cards
    songCards.forEach(card => {
        const songLang = card.querySelector('.song-lang');
        let showCard = true;

        if (lang !== 'all' && songLang) {
            const cardLangClass = songLang.classList.contains(lang);
            showCard = cardLangClass;
        }

        if (showCard && genre && genre !== 'all') {
            const songGenre = card.querySelector('.song-genre');
            if (songGenre && !songGenre.textContent.toLowerCase().includes(genre.toLowerCase())) {
                showCard = false;
            }
        }

        card.style.display = showCard ? '' : 'none';
    });

    // Filter song items
    songItems.forEach(item => {
        const songGenre = item.querySelector('.song-genre');
        let showItem = true;

        if (genre && genre !== 'all' && songGenre) {
            showItem = songGenre.textContent.toLowerCase().includes(genre.toLowerCase());
        }

        item.style.display = showItem ? '' : 'none';
    });
}

function initShowMoreButtons() {
    const showMoreButtons = document.querySelectorAll('.show-more-btn');

    showMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.closest('.song-category');
            const songsList = category.querySelector('.songs-list');

            if (songsList) {
                // In a real implementation, you would load more songs here
                alert('Здесь будут загружаться дополнительные песни');

                // Example: toggle expanded state
                songsList.classList.toggle('expanded');

                // Update button text
                if (songsList.classList.contains('expanded')) {
                    this.innerHTML = 'Показать меньше <i class="fas fa-chevron-up"></i>';
                } else {
                    this.innerHTML = 'Показать больше <i class="fas fa-chevron-down"></i>';
                }
            }
        });
    });
}
