// Social studies specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.lesson-card, .section-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('under-construction')) {
                this.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

function showConstruction() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: white; padding: 2rem; border-radius: 16px; text-align: center; max-width: 400px;">
                <i class="fas fa-hard-hat" style="font-size: 3rem; color: #fbbc04; margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 1rem;">Under Construction</h3>
                <p style="margin-bottom: 2rem; color: #666;">This lesson is currently being developed. Please check back soon!</p>
                <button onclick="this.closest('div').remove()" style="background: #1a73e8; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                    Got it
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}
