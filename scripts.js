const allPublications = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
let showingSelected = true;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('toggle-publications')?.addEventListener('click', togglePublications);
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('imageModal')?.addEventListener('click', (event) => {
    if (event.target.id === 'imageModal') closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
  if (allPublications.length > 0) {
    renderPublications(true);
  } else {
    document.getElementById('publications-container').textContent = 'Unable to load publications.';
  }
});

function togglePublications() {
  showingSelected = !showingSelected;
  renderPublications(showingSelected);

  document.getElementById('toggle-publications').textContent = showingSelected ? 'Show all' : 'Show selected';
  document.getElementById('toggle-header').textContent = showingSelected ? 'Selected Publications' : 'All Publications';
}

function renderPublications(selectedOnly) {
  const container = document.getElementById('publications-container');
  const publications = selectedOnly
    ? allPublications.filter((publication) => publication.selected === 1)
    : allPublications;

  container.replaceChildren(...publications.map(createPublicationElement));
}

function createPublicationElement(publication) {
  const item = document.createElement('article');
  item.className = 'publication-item';

  if (publication.thumbnail) {
    const thumbnail = document.createElement('button');
    thumbnail.className = 'pub-thumbnail';
    thumbnail.type = 'button';
    thumbnail.setAttribute('aria-label', `View figure for ${publication.title}`);
    thumbnail.addEventListener('click', () => openModal(publication.thumbnail, publication.title));

    const image = document.createElement('img');
    image.src = publication.thumbnail;
    image.alt = `Figure from ${publication.title}`;
    image.loading = 'lazy';
    thumbnail.appendChild(image);
    item.appendChild(thumbnail);
  }

  const content = document.createElement('div');
  content.className = 'pub-content';

  const title = document.createElement('h3');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);

  const authors = document.createElement('p');
  authors.className = 'pub-authors';
  publication.authors.forEach((author, index) => {
    const node = author.replace(/\*$/, '') === 'Mario Michelessa' ? document.createElement('strong') : document.createTextNode(author);
    if (node instanceof HTMLElement) {
      node.className = 'highlight-name';
      node.textContent = author;
    }
    authors.appendChild(node);
    if (index < publication.authors.length - 1) authors.append(', ');
  });
  content.appendChild(authors);

  const details = document.createElement('div');
  details.className = 'pub-details';

  const venue = document.createElement('span');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  details.appendChild(venue);

  if (publication.award) {
    const award = document.createElement('span');
    award.className = 'pub-award';
    award.textContent = publication.award;
    details.appendChild(award);
  }
  content.appendChild(details);

  if (publication.links) {
    const labels = { paper: 'Paper', code: 'Code', doi: 'DOI', project: 'Project' };
    const links = document.createElement('div');
    links.className = 'pub-links';

    Object.entries(publication.links).forEach(([type, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = labels[type] || type;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      links.appendChild(link);
    });
    content.appendChild(links);
  }

  item.appendChild(content);
  return item;
}

function openModal(imageSrc, title) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  modalImage.src = imageSrc;
  modalImage.alt = `Figure from ${title}`;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('modal-close').focus();
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  if (!modal.classList.contains('show')) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}
