// projects.js
const projects = [
    {
        name: "GRONK 2",
        image: "assets/images/projects/gronk_2/gronk_2_home.png",
        banner: "",
        description: "A 2D platformer game built in Godot as a personal project to test my skills.",
        longDescription: "Gronk 2 is a 2D platformer game where players navigate through various levels, overcoming obstacles and enemies. The game features unique mechanics and a variety of environments to explore.",
        playable: "https://gingeapple182.itch.io/gronk-2", // URL if playable externally, or null/undefined
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
        banner: "",
        description: "An educational game focused on internet safety for children. Created in collaboration with other students and SWGfL.",
        longDescription: "The Swiggles Game teaches children about internet safety through fun and interactive gameplay. Developed in collaboration with SWGfL and fellow students.",
        playable: "assets/swiggle/index.html", // Local playable
        links: [],
        screenshots: [
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
        banner: "",
        description: "A 3D platformer-style game built in Unity where the player must escape the facility before the lava rises too high.",
        longDescription: "Escape the rising lava in this fast-paced 3D platformer. Built in Unity, featuring challenging levels and dynamic hazards.",
        playable: "https://gingeapple182.itch.io/the-floor-is-lava",
        links: [
            { label: "Itch.io", url: "https://gingeapple182.itch.io/the-floor-is-lava" }
        ],
        screenshots: []
    },
    {
        name: "GRONK",
        image: "path/to/gronk-image.jpg",
        banner: "",
        description: "A top down basic adventure game used as my first year uni project to develop a basic single page game.",
        longDescription: "GRONK is a simple top-down adventure game created as a university project, focusing on core gameplay mechanics and single-page design.",
        playable: null, // Not directly playable
        links: [
            { label: "GitHub", url: "https://github.com/gingeapple182/COMP1004" }
        ],
        screenshots: []
    }
    // Add more projects here
];

function generateProjectCards() {
    const container = document.getElementById("project-cards-container");
    container.innerHTML = "";

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

    // Add event listeners for "More Details" buttons
    document.querySelectorAll('.more-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-project-index');
            openProjectModal(projectsToDisplay[idx]);
        });
    });
}

// Modal logic
function openProjectModal(project) {
    // Build links HTML
    const linksHtml = project.links && project.links.length
        ? `<div class="project-modal-links">
            ${project.links.map(link =>
                `<a href="${link.url}" class="project-modal-link" target="_blank" rel="noopener">${link.label}</a>`
            ).join('')}
        </div>`
        : "";

    // Build screenshots HTML
    const screenshotsHtml = project.screenshots && project.screenshots.length
        ? `<div class="project-modal-screenshots">
            ${project.screenshots.map((src, i) =>
                `<img src="${src}" alt="${project.name} screenshot ${i+1}" class="project-modal-screenshot">`
            ).join('')}
        </div>`
        : "";

    // View Project button (only if playable)
    const viewProjectBtn = project.playable
        ? `<a href="${project.playable}" class="project-modal-view" target="_blank" rel="noopener">View Project</a>`
        : "";

    const bannerImg = project.banner ? project.banner : project.image;

    // Modal HTML
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

    // Inject modal into the root
    let modalRoot = document.getElementById('project-modal-root');
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'project-modal-root';
        document.body.appendChild(modalRoot);
    }
    modalRoot.innerHTML = modalHtml;

    // Prevent background scroll
    document.body.style.overflow = "hidden";

    // Focus for accessibility
    const overlay = modalRoot.querySelector('.project-modal-overlay');
    overlay.focus();

    // Close modal logic
    function closeModal() {
        modalRoot.innerHTML = "";
        document.removeEventListener('keydown', escListener);
        // Re-enable background scroll
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

// Call this function on page load as before
// generateProjectCards();
