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
        // Ora controlliamo la presenza di una classe, non di uno stile inline
        if (!containerArchive.classList.contains('archive-visible')) {
            // Svuota l'archivio per non duplicare
            containerArchive.innerHTML = '';
    
            // Ordina le foto passate in ordine decrescente di data
            photos
                .filter(p => p.date < todayStr)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .forEach(photo => {
                    const card = createPhotoCard(photo);
                    containerArchive.appendChild(card);
                });
    
            // Aggiungiamo la classe per rendere l'archivio visibile
            containerArchive.classList.add('archive-visible');
            toggleBtn.textContent = 'Nascondi Archivio';
        } else {
            // Rimuoviamo la classe per nascondere l'archivio
            containerArchive.classList.remove('archive-visible');
            toggleBtn.textContent = 'Mostra Archivio';
        }
    });

    // Rimuovi o commenta questa riga: containerArchive.style.display = 'none';
    // Lo stato iniziale è ora gestito dal CSS.
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

    // Per centrare serve creare il wrapper
    const imageWrapper = document.createElement('div'); 
    imageWrapper.className = 'photo-image-wrapper';
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
    imageWrapper.appendChild(img); // Mettiamo l'immagine dentro il wrapper
    card.appendChild(imageWrapper); // E il wrapper dentro la card

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
    // 1. Crea un elemento link <a> invisibile
    const link = document.createElement('a');
    link.href = photo.src;

    // 2. Imposta il nome del file per il download (es. 2025-08-17.jpg)
    const filename = photo.src.split('/').pop();
    link.download = filename;
    
    // 3. Aggiungi il link alla pagina, cliccalo e rimuovilo subito dopo.
    // Questo è il trucco per farlo funzionare su tutti i browser.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    });

    card.appendChild(saveBtn);
    return card;
}



// Avvio
loadPhotos();
// Logica per chiudere la modale

// Recupera gli elementi della modale una sola volta
const modal = document.getElementById('photo-modal');
const modalCloseBtn = document.querySelector('.modal-close');

// Funzione per chiudere la modale
function closeModal() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open'); // Riattiva lo scroll del body
}

// Chiudi la modale quando si clicca sulla 'X'
modalCloseBtn.addEventListener('click', closeModal);

// Chiudi la modale anche quando si clicca sull'overlay (lo sfondo scuro)
modal.addEventListener('click', (event) => {
    // Controlla se il click è avvenuto direttamente sulla modale (lo sfondo)
    // e non sull'immagine al suo interno.
    if (event.target === modal) {
        closeModal();
    }
});
