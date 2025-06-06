// projects.js

// ===============================
// Project Data
// ===============================
const projects = [
    {
        name: "GRONK 2",
        image: "assets/images/projects/gronk_2/gronk_2_home.png",
        banner: "assets/images/projects/gronk_2/gronk_2_banner.png",
        description: "A 2D platformer built in Godot as a personal project, inspired by classic platformers like Mario.",
        longDescription: "GRONK 2 is a personal project developed in Godot to expand my skills in coding and game design, drawing inspiration from classic 2D platformers such as Mario. The game features core platformer mechanics, including enemy encounters, coin collection, and basic player movement. I am solely responsible for all aspects of development, using a mix of asset packs and my own growing art skills. Future plans include adding more enemy types, dynamic player movement, and expanded interactions. The name 'GRONK 2' is a nod to my first-year university project, as I'm admittedly not great at naming games. Feedback from friends has been positive and motivates ongoing development.",
        playable: "https://gingeapple182.itch.io/gronk-2",
        links: [
            { label: "Itch.io", url: "https://gingeapple182.itch.io/gronk-2" },
            { label: "GitHub", url: "https://github.com/gingeapple182/GRONK-2" }
        ],
        screenshots: [
            "assets/images/projects/gronk_2/gronk_2_1.png",
            "assets/images/projects/gronk_2/gronk_2_2.png",
            "assets/images/projects/gronk_2/gronk_2_3.png"
        ]
    },
    {
        name: "The Swiggles Game",
        image: "assets/images/projects/swiggle/swiggle_home.png",
        banner: "assets/images/projects/swiggle/swiggle_banner.png",
        description: "A web game for children aged 5–9, teaching internet safety through interactive minigames. Developed as a university team project with SWGfL.",
        longDescription: "The Swiggles Game is an educational web game designed to teach children aged 5–9 about internet safety, with a particular focus on safe searching. Developed as a year-long university team project in collaboration with SWGfL, the game features three engaging minigames: a wordsearch, a drag-and-drop sorting activity, and a quiz that allows children to review their answers. Built using HTML, CSS, JavaScript, and the P5.js library, I served as team lead and was responsible for the quiz minigame as well as client communication. Our client was extremely pleased with the outcome and expressed interest in using the game as a future learning tool for children.",
        playable: "assets/swiggle/index.html",
        links: [
            { label: "SWGfL (Client)", url: "https://swiggle.org.uk" }
        ],
        screenshots: [
            "assets/images/projects/swiggle/swiggle_home.png",
            "assets/images/projects/swiggle/swiggle_1.png",
            "assets/images/projects/swiggle/swiggle_2.png",
            "assets/images/projects/swiggle/swiggle_3.png",
            "assets/images/projects/swiggle/swiggle_4.png",
            "assets/images/projects/swiggle/swiggle_5.png",
        ]
    },
    {
        name: "The Floor is Lava",
        image: "assets/images/projects/tfil/tfil_home.png",
        banner: "assets/images/projects/tfil/tfil_banner.png",
        description: "A 3D platformer built in Unity where players must escape rising lava by interacting with the environment.",
        longDescription: "The Floor is Lava is a 3D platformer developed in Unity as a university assignment for my game development module. Players navigate a hazardous facility, using physics-based movement and interacting with the world—such as picking up objects, opening doors, and extending bridges—to escape rising lava that increases in speed. I was solely responsible for the project, combining Unity Asset Store resources with custom elements. The game received positive feedback, and with more time, I would have expanded its features further.",
        playable: "https://gingeapple182.itch.io/the-floor-is-lava",
        links: [
            { label: "Itch.io", url: "https://gingeapple182.itch.io/the-floor-is-lava" }
        ],
        screenshots: []
    },
    {
        name: "GRONK",
        image: "assets/images/projects/gronk/gronk_home.png",
        banner: "assets/images/projects/gronk/gronk_banner.png",
        description: "A top-down adventure game built as a single-page web app for my first year university project.",
        longDescription: "GRONK is a top-down adventure game developed as a single-page web application for my first year university project. Players control a character using only the keyboard to explore a map, interact with enemies, and experience encounter screens where choices can be made. The game was built entirely by myself using HTML, JavaScript, and the P5.js library, with no prior coding or game design experience. This project marked my introduction to programming and game development, and was well received by my lecturers.",
        playable: null,
        links: [
            { label: "GitHub", url: "https://github.com/gingeapple182/COMP1004" }
        ],
        screenshots: [
            "assets/images/projects/gronk/gronk_1.png",
            "assets/images/projects/gronk/gronk_2.png",
            "assets/images/projects/gronk/gronk_3.png"
        ]
    }
    // Add more projects here
];
    // ===============================
    // Project Data Template
    // ===============================
    // To add a new project, use the following fields:
    // - name:            (string) Project title
    // - image:           (string) Path to main card image (required)
    // - banner:          (string) Path to banner image for modal (optional)
    // - description:     (string) Short description for card
    // - longDescription: (string) Detailed description for modal
    // - playable:        (string|null) URL to playable version, or null if not playable
    // - links:           (array) Extra links, each as { label, url }
    // - screenshots:     (array) Screenshot image paths for modal gallery
    // ===============================

// ===============================
// Card Generation Logic
// ===============================
// Dynamically creates project cards and inserts them into the container.
function generateProjectCards() {
    const container = document.getElementById("project-cards-container");
    container.innerHTML = "";

    // Show only a subset on the homepage, all on the projects page
    const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    const projectsToDisplay = isHomePage ? projects.slice(0, 2) : projects;

    projectsToDisplay.forEach((project, idx) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${project.image}" alt="${project.name}">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <button class="button more-details-btn" data-project-index="${idx}">More Details</button>
        `;

        container.appendChild(card);
    });

    // Attach event listeners to "More Details" buttons to open the modal
    document.querySelectorAll('.more-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-project-index');
            openProjectModal(projectsToDisplay[idx]);
        });
    });
}

// ===============================
// Modal Logic
// ===============================
// Builds and displays the project details modal.
function openProjectModal(project) {
    // Helper to check if a link is external
    function isExternal(url) {
        return /^https?:\/\//i.test(url);
    }

    // Build extra links section if links exist
    const linksHtml = project.links && project.links.length
        ? `<div class="project-modal-links">
            ${project.links.map(link =>
                `<a href="${link.url}" class="project-modal-link"${isExternal(link.url) ? ' target="_blank" rel="noopener"' : ''}>${link.label}</a>`
            ).join('')}
        </div>`
        : "";

    // Build screenshots gallery if screenshots exist
    const screenshotsHtml = project.screenshots && project.screenshots.length
        ? `<div class="project-modal-screenshots">
            ${project.screenshots.map((src, i) =>
                `<img src="${src}" alt="${project.name} screenshot ${i+1}" class="project-modal-screenshot">`
            ).join('')}
        </div>`
        : "";

    // Show "View Project" button only if playable
    const viewProjectBtn = project.playable
        ? `<a href="${project.playable}" class="project-modal-view"${isExternal(project.playable) ? ' target="_blank" rel="noopener"' : ''}>View Project</a>`
        : "";

    // Use banner image if available, otherwise fallback to main image
    const bannerImg = project.banner ? project.banner : project.image;

    // Modal HTML structure
    const modalHtml = `
        <div class="project-modal-overlay" tabindex="-1">
            <div class="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <button class="project-modal-close" aria-label="Close">&times;</button>
                <img class="project-modal-banner" src="${bannerImg}" alt="${project.name} banner">
                <h2 id="modal-title">${project.name}</h2>
                <p class="project-modal-description">${project.longDescription}</p>
                ${linksHtml}
                ${viewProjectBtn}
                ${screenshotsHtml}
            </div>
        </div>
    `;

    // Inject modal into the root element (create if missing)
    let modalRoot = document.getElementById('project-modal-root');
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'project-modal-root';
        document.body.appendChild(modalRoot);
    }
    modalRoot.innerHTML = modalHtml;

    // Prevent background scroll while modal is open
    document.body.style.overflow = "hidden";

    // Focus overlay for accessibility
    const overlay = modalRoot.querySelector('.project-modal-overlay');
    overlay.focus();

    // Close modal and restore scroll
    function closeModal() {
        modalRoot.innerHTML = "";
        document.removeEventListener('keydown', escListener);
        document.body.style.overflow = "";
    }
    // ESC key closes modal
    function escListener(e) {
        if (e.key === "Escape") closeModal();
    }
    document.addEventListener('keydown', escListener);

    // Close button
    modalRoot.querySelector('.project-modal-close').onclick = closeModal;
    // Clicking overlay (not modal) closes modal
    overlay.onclick = function(e) {
        if (e.target === overlay) closeModal();
    };
}

// ===============================
// Initialisation
// ===============================
// Call this function on page load to render cards
// generateProjectCards();
