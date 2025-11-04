// Calculator functionality for Live Karaoke website

let currentStep = 1;
const totalSteps = 5;
let calculatorData = {
    service: null,
    servicePrice: 0,
    duration: null,
    durationMultiplier: 1,
    additional: [],
    additionalPrice: 0
};

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
});

function initCalculator() {
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitCalculator');
    const form = document.getElementById('priceCalculator');

    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevStep);
    }

    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // Service selection
    const serviceOptions = document.querySelectorAll('input[name="service"]');
    serviceOptions.forEach(option => {
        option.addEventListener('change', function() {
            calculatorData.service = this.value;
            calculatorData.servicePrice = parseInt(this.dataset.price);
            updateSummary();
        });
    });

    // Duration selection
    const durationOptions = document.querySelectorAll('input[name="duration"]');
    durationOptions.forEach(option => {
        option.addEventListener('change', function() {
            calculatorData.duration = this.value;
            calculatorData.durationMultiplier = parseFloat(this.dataset.multiplier);
            updateSummary();
        });
    });

    // Additional options
    const additionalOptions = document.querySelectorAll('input[name="additional"]');
    additionalOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                calculatorData.additional.push({
                    value: this.value,
                    price: parseInt(this.dataset.price)
                });
            } else {
                calculatorData.additional = calculatorData.additional.filter(
                    item => item.value !== this.value
                );
            }
            updateSummary();
        });
    });
}

function nextStep() {
    if (!validateStep(currentStep)) {
        return;
    }

    if (currentStep < totalSteps) {
        // Hide current step
        const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        currentStepEl.classList.remove('active');

        // Show next step
        currentStep++;
        const nextStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        nextStepEl.classList.add('active');

        // Update navigation
        updateNavigation();
        updateProgress();
    }
}

function prevStep() {
    if (currentStep > 1) {
        // Hide current step
        const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        currentStepEl.classList.remove('active');

        // Show previous step
        currentStep--;
        const prevStepEl = document.querySelector(`[data-step="${currentStep}"]`);
        prevStepEl.classList.add('active');

        // Update navigation
        updateNavigation();
        updateProgress();
    }
}

function validateStep(step) {
    switch(step) {
        case 1:
            if (!calculatorData.service) {
                alert('Пожалуйста, выберите услугу');
                return false;
            }
            break;
        case 2:
            if (!calculatorData.duration) {
                alert('Пожалуйста, выберите длительность');
                return false;
            }
            break;
        case 4:
            const eventDate = document.getElementById('eventDate');
            const guestCount = document.getElementById('guestCount');
            const eventType = document.getElementById('eventType');
            const venue = document.getElementById('venue');

            if (!eventDate.value || !guestCount.value || !eventType.value || !venue.value) {
                alert('Пожалуйста, заполните все обязательные поля');
                return false;
            }
            break;
    }
    return true;
}

function updateNavigation() {
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitCalculator');

    // Show/hide prev button
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-flex';
    }

    // Show/hide next vs submit button
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepSpan = document.getElementById('currentStep');

    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = progress + '%';
    currentStepSpan.textContent = currentStep;
}

function updateSummary() {
    const summaryDetails = document.getElementById('summaryDetails');
    const summaryTotal = document.getElementById('summaryTotal');
    const totalAmount = document.getElementById('totalAmount');

    if (!calculatorData.service) {
        return;
    }

    // Calculate total
    let basePrice = calculatorData.servicePrice * calculatorData.durationMultiplier;
    let additionalTotal = calculatorData.additional.reduce((sum, item) => sum + item.price, 0);
    let total = basePrice + additionalTotal;

    // Build summary HTML
    let summaryHTML = '<div class="summary-items">';

    // Service
    summaryHTML += `
        <div class="summary-item">
            <span class="item-name">${getServiceName(calculatorData.service)}</span>
            <span class="item-price">${formatPrice(calculatorData.servicePrice)}</span>
        </div>
    `;

    // Duration
    if (calculatorData.duration) {
        summaryHTML += `
            <div class="summary-item">
                <span class="item-name">Длительность: ${calculatorData.duration} ч</span>
                <span class="item-price">×${calculatorData.durationMultiplier}</span>
            </div>
        `;
    }

    // Additional services
    calculatorData.additional.forEach(item => {
        summaryHTML += `
            <div class="summary-item">
                <span class="item-name">${getAdditionalName(item.value)}</span>
                <span class="item-price">+${formatPrice(item.price)}</span>
            </div>
        `;
    });

    summaryHTML += '</div>';

    summaryDetails.innerHTML = summaryHTML;
    totalAmount.textContent = formatPrice(total);
    summaryTotal.style.display = 'flex';
}

function getServiceName(service) {
    const names = {
        'cover-band': 'Кавер-группа',
        'live-karaoke': 'Live Karaoke',
        'combo': 'Комбо',
        'equipment': 'Аренда оборудования'
    };
    return names[service] || service;
}

function getAdditionalName(value) {
    const names = {
        'presenter': 'Ведущий мероприятия',
        'photo-video': 'Фото и видеосъёмка',
        'dj': 'DJ сет',
        'extra-lighting': 'Расширенное световое шоу'
    };
    return names[value] || value;
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₸';
}

function handleSubmit(e) {
    e.preventDefault();

    if (!validateStep(5)) {
        return;
    }

    // Get form data
    const formData = new FormData(e.target);
    const data = {
        ...calculatorData,
        clientName: formData.get('clientName'),
        clientPhone: formData.get('clientPhone'),
        clientEmail: formData.get('clientEmail'),
        eventDate: formData.get('eventDate'),
        guestCount: formData.get('guestCount'),
        eventType: formData.get('eventType'),
        venue: formData.get('venue'),
        comments: formData.get('comments')
    };

    console.log('Form submitted:', data);

    // Here you would typically send the data to a server
    // For now, we'll just show a success message
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');

    // Optionally reset the form
    // e.target.reset();
    // currentStep = 1;
    // updateNavigation();
    // updateProgress();
}
