// script.js
const JSON_URL = 'photos/photos.json';

async function loadPhotos() {
    try {
        const response = await fetch(JSON_URL);
        const photos = await response.json();

        const containerToday = document.getElementById('today-photo');
        const containerArchive = document.getElementById('archive');
        const toggleBtn = document.getElementById('archive-toggle');

        const todayStr = new Date().toISOString().slice(0, 10);

        // Foto del giorno
        let todayPhoto = photos.find(p => p.date === todayStr);
        if (!todayPhoto) {
            todayPhoto = photos.filter(p => p.date <= todayStr).pop();
        }

        if (todayPhoto) {
            const card = createPhotoCard(todayPhoto);
            card.classList.add('fade-in');
            containerToday.appendChild(card);
        } else {
            containerToday.textContent = 'Nessuna foto disponibile per oggi.';
        }

        // Toggle archivio
        toggleBtn.addEventListener('click', () => {
            if (containerArchive.style.display === 'none' || containerArchive.style.display === '') {
                // Svuota l'archivio per non duplicare
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
                toggleBtn.textContent = 'Nascondi Archivio';
            } else {
                containerArchive.style.display = 'none';
                toggleBtn.textContent = 'Mostra Archivio';
            }
        });

        // ✅ Avvio: archivio nascosto e bottone coerente
        containerArchive.style.display = 'none';
        toggleBtn.textContent = 'Mostra Archivio';

    } catch (err) {
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
    // Aggiungi l'evento click all'immagine per aprire la modale
    img.addEventListener('click', () => {
        const modal = document.getElementById('photo-modal');
        const modalImg = document.getElementById('modal-image');
        
        modal.style.display = 'block';
        modalImg.src = photo.src;
        document.body.classList.add('modal-open'); // Blocca lo scroll del body
    });
    card.appendChild(img);

    const caption = document.createElement('div');
    caption.className = 'photo-caption';
    caption.textContent = photo.caption;
    card.appendChild(caption);

    const date = document.createElement('div');
    date.className = 'photo-date';
    date.textContent = photo.date;
    card.appendChild(date);

    // Bottone salva immagine
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾 Salva immagine';
    saveBtn.className = 'save-btn';
    
    saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = photo.src;
        link.download = photo.title.replace(/\s+/g, '_');
        link.click();
    });

    card.appendChild(saveBtn);
    return card;
}



// Avvio
loadPhotos();
