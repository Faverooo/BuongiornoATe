const JSON_URL = 'photos/photos.json';

async function loadPhotos() {
    try {
        const response = await fetch(JSON_URL);
        const photos = await response.json();

        const containerToday = document.getElementById('today-photo');
        const containerArchive = document.getElementById('archive');

        const todayStr = new Date().toISOString().slice(0,10);
        let todayPhoto = photos.find(p => p.date === todayStr);
        if(!todayPhoto){
            todayPhoto = photos.filter(p => p.date <= todayStr).pop();
        }

        if(todayPhoto){
            const card = createPhotoCard(todayPhoto);
            card.classList.add('fade-in');
            containerToday.appendChild(card);
        } else {
            containerToday.textContent = 'Nessuna foto disponibile per oggi.';
        }

        photos.filter(p => p.date < todayStr).forEach(photo => {
            const card = createPhotoCard(photo);
            card.classList.add('fade-in');
            containerArchive.appendChild(card);
        });

        // Bottone mostra/nascondi archivio
document.getElementById('archive-toggle').addEventListener('click', () => {
    if (containerArchive.style.display === 'none' || containerArchive.style.display === '') {
        // Prima svuota l'archivio per non duplicare
        containerArchive.innerHTML = '';

        // Ordina le foto passate in ordine decrescente di data
        photos
          .filter(p => p.date < todayStr)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .forEach(photo => {
              const card = createPhotoCard(photo);
              card.classList.add('fade-in');
              containerArchive.appendChild(card);
          });

        containerArchive.style.display = 'block';
        document.getElementById('archive-toggle').textContent = 'Nascondi Archivio';
    } else {
        containerArchive.style.display = 'none';
        document.getElementById('archive-toggle').textContent = 'Mostra Archivio';
    }
});


    } catch(err) {
        console.error('Errore nel caricamento delle foto:', err);
        document.getElementById('today-photo').textContent = 'Errore nel caricamento delle foto.';
    }
}

function createPhotoCard(photo){
    const card = document.createElement('div');
    card.className = 'photo-card';
    if(photo.special) card.classList.add('special');

    const img = document.createElement('img');
    img.src = photo.src;
    card.appendChild(img);

    const title = document.createElement('div');
    title.className = 'photo-title';
    title.textContent = photo.title;
    card.appendChild(title);

    const caption = document.createElement('div');
    caption.className = 'photo-caption';
    caption.textContent = photo.caption;
    card.appendChild(caption);

    const date = document.createElement('div');
    date.className = 'photo-date';
    date.textContent = photo.date;
    card.appendChild(date);

    return card;
}

loadPhotos();
