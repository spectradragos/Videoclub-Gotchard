(function() {
    const audio = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const overlay = document.getElementById('overlay-bienvenida');

    if (!audio || !muteBtn) return;

    audio.volume = 0.3;
    audio.loop = true;

    // Si hay overlay (solo en index), lo usamos; si no, intentamos autoplay
    if (overlay) {
        audio.play().catch(() => {
            console.log('Autoplay bloqueado, esperando clic del usuario...');
        });

        function arrancarMusica() {
            audio.play().then(() => {
                overlay.classList.add('oculto');
            }).catch(err => {
                console.log('Error al reproducir:', err);
            });
            document.removeEventListener('click', arrancarMusica);
            document.removeEventListener('touchstart', arrancarMusica);
        }

        document.addEventListener('click', arrancarMusica);
        document.addEventListener('touchstart', arrancarMusica);
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            arrancarMusica();
        });
    } else {
        // En páginas secundarias, intentamos reproducir directamente
        // Guardamos el estado del mute en localStorage para que se mantenga entre páginas
        const mutedGuardado = localStorage.getItem('musicaMuted');
        if (mutedGuardado === 'true') {
            audio.muted = true;
            muteBtn.textContent = '🔇';
            muteBtn.title = 'Activar música';
        }

        audio.play().catch(() => {
            console.log('Autoplay bloqueado en página secundaria.');
        });
    }

    // Botón de mute
    muteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        audio.muted = !audio.muted;
        muteBtn.textContent = audio.muted ? '🔇' : '🔊';
        muteBtn.title = audio.muted ? 'Activar música' : 'Silenciar música';
        localStorage.setItem('musicaMuted', audio.muted);
    });

    // Refuerzo del bucle
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play();
    });

    // Guardar el tiempo actual de reproducción al salir (opcional)
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('musicaTiempo', audio.currentTime);
    });

    // Restaurar el tiempo al cargar (opcional)
    const tiempoGuardado = localStorage.getItem('musicaTiempo');
    if (tiempoGuardado && !overlay) {
        audio.currentTime = parseFloat(tiempoGuardado);
    }
})();