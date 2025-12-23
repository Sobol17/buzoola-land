const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuClose = document.querySelector('.menu-close');
const mobileLinks = mobileMenu.querySelectorAll('a');

const openMenu = () => {
  mobileMenu.classList.add('active');
  document.body.classList.add('menu-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
};

const closeMenu = () => {
  mobileMenu.classList.remove('active');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
};

menuToggle.addEventListener('click', () => {
  const isActive = mobileMenu.classList.contains('active');
  if (isActive) {
    closeMenu();
  } else {
    openMenu();
  }
});

menuClose.addEventListener('click', closeMenu);
mobileMenu.addEventListener('click', (event) => {
  if (event.target === mobileMenu) {
    closeMenu();
  }
});
mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (targetId.length > 1) {
      event.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

const phoneInput = document.querySelector('input[data-mask="phone"]');

if (phoneInput) {
  const maskPattern = '# (###) ###-##-##';
  const maxDigits = (maskPattern.match(/#/g) || []).length;

  const formatValue = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, maxDigits);
    if (!digits.length) {
      return '';
    }
    let result = '+';
    let digitIndex = 0;

    for (const char of maskPattern) {
      if (char === '#') {
        if (digitIndex < digits.length) {
          result += digits[digitIndex];
          digitIndex += 1;
        } else {
          break;
        }
      } else if (digitIndex > 0) {
        result += char;
      }
    }

    return result;
  };

  phoneInput.addEventListener('input', (event) => {
    event.target.value = formatValue(event.target.value);
  });
}

const accordion = document.querySelector('[data-accordion]');

if (accordion) {
  const toggle = accordion.querySelector('.text-card__toggle');
  const content = accordion.querySelector('.text-card__accordion-content');
  const mobileQuery = window.matchMedia('(max-width: 768px)');

  const setContentHeight = (isOpen) => {
    if (!content) {
      return;
    }
    if (!mobileQuery.matches) {
      content.style.maxHeight = 'none';
      return;
    }
    content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : '0px';
  };

  const applyAccordionMode = () => {
    if (!toggle || !content) {
      return;
    }

    if (mobileQuery.matches) {
      const isOpen = accordion.classList.contains('is-open');
      toggle.disabled = false;
      toggle.setAttribute('aria-expanded', String(isOpen));
      content?.setAttribute('aria-hidden', String(!isOpen));
      setContentHeight(isOpen);
    } else {
      accordion.classList.add('is-open');
      toggle.disabled = true;
      toggle.setAttribute('aria-expanded', 'true');
      content?.setAttribute('aria-hidden', 'false');
      setContentHeight(true);
    }
  };

  const handleAccordionToggle = () => {
    if (!mobileQuery.matches || !toggle) {
      return;
    }
    accordion.classList.toggle('is-open');
    const isOpen = accordion.classList.contains('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    content?.setAttribute('aria-hidden', String(!isOpen));
    setContentHeight(isOpen);
  };

  toggle?.addEventListener('click', handleAccordionToggle);

  const handleViewportChange = () => {
    if (mobileQuery.matches) {
      accordion.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
      content?.setAttribute('aria-hidden', 'true');
    }
    applyAccordionMode();
  };

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', handleViewportChange);
  } else {
    mobileQuery.addListener(handleViewportChange);
  }

  if (mobileQuery.matches) {
    accordion.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    content?.setAttribute('aria-hidden', 'true');
  }

  applyAccordionMode();
}

const inventoryCardMobileQuery = window.matchMedia('(max-width: 900px)');
const inventoryCardControllers = [];

document.querySelectorAll('.inventory-card').forEach((card, index) => {
  const cardBody = card.querySelector('.card-body');
  const lists = cardBody?.querySelectorAll('ul');

  if (!cardBody || !lists?.length) {
    return;
  }

  const bodyId = cardBody.id || `inventory-card-body-${index + 1}`;
  cardBody.id = bodyId;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'inventory-card__toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', bodyId);
  toggle.innerHTML = `
    <span class="sr-only">Показать детали карточки</span>
    <span aria-hidden="true" class="inventory-card__toggle-icon"></span>
  `;

  card.appendChild(toggle);
  card.classList.add('inventory-card--collapsible');

  const handleToggle = () => {
    if (!inventoryCardMobileQuery.matches) {
      return;
    }
    card.classList.toggle('is-expanded');
    const isExpanded = card.classList.contains('is-expanded');
    toggle.setAttribute('aria-expanded', String(isExpanded));
  };

  toggle.addEventListener('click', handleToggle);
  inventoryCardControllers.push({ card, toggle });
});

if (inventoryCardControllers.length) {
  const applyInventoryCardState = () => {
    const isMobile = inventoryCardMobileQuery.matches;
    inventoryCardControllers.forEach(({ card, toggle }) => {
      if (isMobile) {
        card.classList.remove('is-expanded');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('is-expanded');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  };

  const handleInventoryViewportChange = () => {
    applyInventoryCardState();
  };

  if (inventoryCardMobileQuery.addEventListener) {
    inventoryCardMobileQuery.addEventListener(
      'change',
      handleInventoryViewportChange
    );
  } else {
    inventoryCardMobileQuery.addListener(handleInventoryViewportChange);
  }

  applyInventoryCardState();
}
