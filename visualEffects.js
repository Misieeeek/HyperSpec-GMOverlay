class VisualEffects {
    constructor() {
        this.confettiColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
        this.tomatoEmoji = '🍅';
    }

    triggerConfetti() {
        const duration = 2000;
        const particleCount = 100;
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '99999';
        document.body.appendChild(container);

        for (let i = 0; i < particleCount; i++) {
            this.createConfettiParticle(container);
        }

        setTimeout(() => {
            container.remove();
        }, duration);
    }

    createConfettiParticle(container) {
        const particle = document.createElement('div');
        const size = Math.random() * 10 + 5;
        const color = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
        const startX = Math.random() * window.innerWidth;
        const startY = -20;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = window.innerHeight + 20;
        const duration = Math.random() * 2000 + 1000;
        const rotation = Math.random() * 720;

        particle.style.position = 'absolute';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = color;
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

        container.appendChild(particle);

        particle.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
    }

    triggerTomatoes() {
        const duration = 2000;
        const tomatoCount = 15;
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '99999';
        document.body.appendChild(container);

        for (let i = 0; i < tomatoCount; i++) {
            setTimeout(() => {
                this.createTomatoParticle(container);
            }, i * 100);
        }

        setTimeout(() => {
            container.remove();
        }, duration + 1000);
    }

    createTomatoParticle(container) {
        const tomato = document.createElement('div');
        const size = Math.random() * 30 + 30;
        const startX = Math.random() * window.innerWidth;
        const startY = -50;
        const endX = startX + (Math.random() - 0.5) * 100;
        const endY = Math.random() * (window.innerHeight * 0.7) + window.innerHeight * 0.3;
        const duration = Math.random() * 800 + 600;
        const rotation = Math.random() * 360;

        tomato.style.position = 'absolute';
        tomato.style.fontSize = size + 'px';
        tomato.style.left = startX + 'px';
        tomato.style.top = startY + 'px';
        tomato.innerText = this.tomatoEmoji;
        tomato.style.userSelect = 'none';

        container.appendChild(tomato);

        const animation = tomato.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${rotation}deg)`,
                opacity: 1
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.5, 0, 0.75, 0)',
            fill: 'forwards'
        });

        animation.onfinish = () => {
            this.createSplat(endX, endY);
            tomato.remove();
        };
    }

    createSplat(x, y) {
        const splat = document.createElement('div');
        splat.innerText = '💥';
        splat.style.position = 'fixed';
        splat.style.left = x + 'px';
        splat.style.top = y + 'px';
        splat.style.fontSize = '40px';
        splat.style.zIndex = '99999';
        splat.style.pointerEvents = 'none';

        document.body.appendChild(splat);

        splat.animate([
            { opacity: 1, transform: 'scale(0.5)' },
            { opacity: 0, transform: 'scale(2)' }
        ], {
            duration: 500,
            easing: 'ease-out'
        }).onfinish = () => splat.remove();
    }
}

window.visualEffects = new VisualEffects();
