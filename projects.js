// projects.js

// ===============================
// Project Data
// ===============================
const projects = [
    {
        name: "COMP3000 Final Year Project",
        category: "University",
        image: "assets/images/projects/comp3000/COMP3000_home.png",
        banner: "assets/images/projects/comp3000/COMP3000_home.png",
        description: "3D puzzle game where you use basic logic gates to repair a hilariously broken office.",
        longDescription: "COMP3000 Final Year Project is a 3D puzzle game built in Godot. Play as a new tech hire in an incompetently set-up office where systems are broken or behaving oddly. Solve environmental puzzles by wiring and applying foundational logic gates (AND, NOT, XOR) to restore devices, servers and machinery. Designed to teach and apply computing logic through interactive level design. Currently in active development.",
        playable: null,
        links: [
            { label: "Godot", url: "https://godotengine.org" }
        ],
        screenshots: [
            // add screenshots when available
        ],
        tech: ["Godot", "GDScript", "GitHub"]
    },
    {
        name: "COMP3013 Group Project - Regal Mail",
        category: "University",
        image: "assets/images/projects/comp3013/COMP3013_home.png",
        banner: "assets/images/projects/comp3013/COMP3013_home.png",
        description: "Group project to build a marketable and published game.",
        longDescription: "COMP3013 Group Project - Regal Mail - You are a delivery worker who must deliver packages to all sorts of clients, make sure you get it right as clients tend to react badly to incorrect deliveries! Built in Godot using GDScript, Currently in active development with plans for publishing.",
        playable: null,
        links: [
            { label: "Godot", url: "https://godotengine.org" }
        ],
        screenshots: [
            // add screenshots when available
        ],
        tech: ["Godot", "GDScript", "GitHub"]
    },
    {
        name: "COMP3015 CW1 - Lightsaber Rendering Project",
        category: "University",
        image: "assets/images/projects/comp3015/COMP3015_CW1_home.png",
        banner: "assets/images/projects/comp3015/COMP3015_CW1_home.png",
        description: "An OpenGL graphics prototype centred on a rendered lightsaber with custom shaders, blade glow, and post-processing effects.",
        longDescription: "COMP3015 CW1 - Lightsaber Rendering Project is an OpenGL prototype focused on real-time lighting, texturing, and post-processing. The scene centres on a textured 3D lightsaber hilt using diffuse and normal mapping, alongside a toggleable glowing blade created through emissive rim lighting and additive blending. The project also includes optional visual effects such as fog, edge detection, and texture mixing, while using GLSL shaders and Blinn-Phong lighting to build a stylised but technically grounded rendering setup. This coursework helped strengthen my understanding of shader programming, material rendering, lighting behaviour, and visual effect implementation in real-time graphics.",
        playable: null,
        links: [
            { label: "GitHub", url: "https://github.com/gingeapple182/COMP3015-CW1" }
        ],
        screenshots: [
            "assets/images/projects/comp3015/CW1_base.png",
            "assets/images/projects/comp3015/CW1_blue.png",
            "assets/images/projects/comp3015/CW1_rust.png",
            "assets/images/projects/comp3015/CW1_demo.mp4"
        ],
        tech: ["CPlusPlus", "OpenGL", "GitHub"]
    },
    {
        name: "COMP3015 CW2 - X-Wing Racer",
        category: "University",
        image: "assets/images/projects/comp3015/COMP3015_CW2_home.png",
        banner: "assets/images/projects/comp3015/COMP3015_CW2_home.png",
        description: "A playable OpenGL lane-runner prototype combining real-time rendering, animated water, particle effects, shadow mapping, bitmap UI, and arcade-style obstacle gameplay.",
        longDescription: "COMP3015 CW2 - X-Wing Racer is a real-time OpenGL graphics project developed into a small playable lane-runner game. The project places the player in control of an X-Wing flying over an animated ocean while avoiding incoming TIE fighters, turning a technical graphics prototype into a more complete interactive experience. It combines several advanced rendering and gameplay systems, including layered procedural wave animation, shadow mapping, instanced engine particles, explosion and smoke effects, bitmap-based UI text rendering, audio integration, collision handling, score tracking, and increasing game speed over time. While earlier foundational features such as textured model rendering, normal mapping, skybox rendering, and Blinn-Phong lighting remain part of the final scene, the main focus of this coursework was on building new CW2 systems and integrating them into a cohesive game-like structure. This project helped strengthen my understanding of shader programming, particle systems, render passes, gameplay state management, and how to bring multiple graphics techniques together into a more polished real-time prototype.",
        playable: null,
        links: [
            { label: "GitHub", url: "https://github.com/gingeapple182/COMP3015-CW2" }
        ],
        screenshots: [
            "assets/images/projects/comp3015/CW2_start.png",
            "assets/images/projects/comp3015/CW2_play.png",
            "assets/images/projects/comp3015/CW2_end.png",
            "assets/images/projects/comp3015/CW2_demo.mp4"
        ],
        tech: ["CPlusPlus", "OpenGL", "GitHub"]
    },
    {
        name: "COMP3016 CW1 - Rescue Protocol",
        category: "University",
        image: "assets/images/projects/comp3016/COMP3016_CW1_home.png",
        banner: "assets/images/projects/comp3016/COMP3016_CW1_home.png",
        description: "Top-down sci-fi bullet-hell where you rescue survivors to grow your party — at a cost.",
        longDescription: "Rescue Protocol is a top-down sci-fi bullet-hell focused on survival and risk/reward. Rescue survivors scattered around the map to increase your health and party size — but a larger party makes you a bigger target. Enemy waves increase in number and attack variety across rounds. Built in C++ with SDL3 following OOP principles (player, enemies, object pooling, state machine). Currently a work-in-progress; a downloadable build will be provided once finalised.",
        playable: null,
        links: [
            { label: "GitHub", url: "https://github.com/gingeapple182/COMP3016-CW1" }
        ],
        screenshots: [
            "assets/images/projects/comp3016/CW1_start.png",
            "assets/images/projects/comp3016/CW1_instruction.png",
            "assets/images/projects/comp3016/CW1_play_1.png",
            "assets/images/projects/comp3016/CW1_play_2.png",
            "assets/images/projects/comp3016/CW1_end.png"
        ],
        tech: ["CPlusPlus", "OpenGL", "GitHub"]
    },
    {
        name: "COMP3016 CW2 - Beneath Ancient Sands",
        category: "University",
        image: "assets/images/projects/comp3016/COMP3016_CW2_home.png",
        banner: "assets/images/projects/comp3016/CW2_sands.png",
        description: "A first-person OpenGL exploration prototype set in an ancient desert with ruins, caves, and a hidden Sith artefact.",
        longDescription: "COMP3016 CW2 - Beneath Ancient Sands is a first-person exploration prototype developed in C++ using OpenGL 4.x. Set within an ancient desert landscape, the project features procedurally generated sand dunes, partially buried ruins, and a hidden cave containing the main objective: an ancient Sith artefact. The prototype focuses on real-time rendering, atmospheric environment design, player movement, and spatial audio, with collectible coins placed throughout the world to encourage exploration beyond the critical path. This project helped develop my understanding of environment construction, runtime model integration, terrain generation, and immersive scene presentation within a custom graphics pipeline.",
        playable: null,
        links: [
            { label: "GitHub", url: "https://github.com/gingeapple182/COMP3016-CW2" }
        ],
        screenshots: [
            "assets/images/projects/comp3016/CW2_sands.png",
            "assets/images/projects/comp3016/CW2_cave_exterior.png",
            "assets/images/projects/comp3016/CW2_cave_interior.png"
            //"assets/images/projects/comp3016/CW2_objective.mp4"
        ],
        tech: ["CPlusPlus", "OpenGL", "GitHub"]
    },
    {
        name: "COMP2003 - The Swiggles Game",
        category: "University",
        image: "assets/images/projects/swiggle/COMP2003_home.png",
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
        ],
        tech: ["HTML5", "CSS3", "JavaScript", "p5-JS", "GitHub"]
    },
    {
        name: "GRONK 2",
        category: "Personal",
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
        ],
        tech: ["Godot", "GitHub"]
    },
    {
        name: "COMP2007 - The Floor is Lava",
        category: "University",
        image: "assets/images/projects/tfil/COMP2007_home.png",
        banner: "assets/images/projects/tfil/tfil_banner.png",
        description: "A 3D platformer built in Unity where players must escape rising lava by interacting with the environment.",
        longDescription: "The Floor is Lava is a 3D platformer developed in Unity as a university assignment for my game development module. Players navigate a hazardous facility, using physics-based movement and interacting with the world—such as picking up objects, opening doors, and extending bridges—to escape rising lava that increases in speed. I was solely responsible for the project, combining Unity Asset Store resources with custom elements. The game received positive feedback, and with more time, I would have expanded its features further.",
        playable: "https://gingeapple182.itch.io/the-floor-is-lava",
        links: [
            { label: "Itch.io", url: "https://gingeapple182.itch.io/the-floor-is-lava" }
        ],
        screenshots: [],
        tech: ["Unity", "CSharp", "GitHub"]
    },
    {
        name: "COMP1004 - GRONK",
        category: "University",
        image: "assets/images/projects/gronk/COMP1004_home.png",
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
        ],
        tech: ["HTML5", "JavaScript", "p5-JS", "GitHub"]
    },
    /*{
        name: "Blender Projects",
        image: "assets/images/projects/blender/blender_home.png",
        banner: "assets/images/projects/blender/blender_banner.png",
        description: "A growing collection of 3D models and animations created as I learn Blender and 3D design.",
        longDescription: "This project is an ongoing showcase of my journey learning Blender and 3D modelling. Starting with beginner tutorials like the classic Blender doughnut, I am gradually exploring more advanced techniques, including modelling, texturing, rigging, and animation. Each model or animation represents a new skill or concept I've practiced, and this space will continue to grow as I take on new challenges and experiment with different styles and workflows. Whether it's following tutorials or creating original work, this collection highlights my progress and enthusiasm for 3D art.",
        playable: null,
        links: [
        ],
        screenshots: [
        ],
        tech: ["Blender"]
    },*/
    {
        name: "PICO-8 Projects",
        category: "Personal",
        image: "assets/images/projects/pico_8/pico8_home.png", // placeholder or logo
        banner: "assets/images/projects/pico_8/pico8_banner.png",
        description: "A collection of small, retro-inspired games made with PICO-8. All games are playable right here!",
        longDescription: "This card features my growing collection of PICO-8 games. Each project is designed to be quick to pick up and play, with classic retro vibes. You can play each game directly in your browser below.",
        playable: null,
        links: [
            { label: "PICO-8", url: "https://www.lexaloffle.com/pico-8.php" }
        ],
        screenshots: [
            // Optionally, add a collage or main screenshot here
        ],
        tech: ["Pico8", "Lua"],
        games: [
            // Example game entry
            {
                title: "Rugnar",
                description: `A Pico-8 rebuild of my first year university project, GRONK. This is a work-in-progress and currently unfinished. The inspiration for this game comes from my original vision for GRONK, which itself was inspired by the Grognak the Barbarian Pip-Boy minigame from Fallout 4, as well as classic games such as The Bard's Tale, Ultima, and Wasteland. Explore a top-down adventure world with keyboard controls. Best played on PC or Mac.`,
                embed: "assets/pico_8/gronk.html", // exported HTML from PICO-8
                screenshots: [
                    "assets/images/projects/gronk.p8.png"
                ]
            },
            // Add more games here
        ]
    },
    
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
// - tech:            (array) Technologies used, for display in modal
// ===============================

// ===============================
// Card Generation Logic
// ===============================
// Dynamically creates project cards and inserts them into the container.
function generateProjectCards() {
    const container = document.getElementById("project-cards-container");

    // Show only a subset on the homepage, all on the projects page
    const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
    let projectsToDisplay;
    if (isHomePage) {
        // Always show first two, plus Blender project (if not already in top 2)
        const blenderIdx = projects.findIndex(p => p.name === "Blender Projects");
        projectsToDisplay = projects.slice(0, 2);
        if (blenderIdx > 1) {
            projectsToDisplay.push(projects[blenderIdx]);
        }
        container.classList.add('homepage-cards');
        container.innerHTML = "";
    } else {
        // On projects page, show university projects first in the main grid, then personal in a grid below
        const universityProjects = projects.filter(p => p.category !== "Personal");
        const personalProjects = projects.filter(p => p.category === "Personal");

        container.innerHTML = `
            <div class="project-category" id="project-category-university">
                <h3>University Projects</h3>
                <div class="cards" id="project-cards-university"></div>
            </div>
            <div class="project-category" id="project-category-personal">
                <h3>Personal Projects</h3>
                <div class="cards" id="project-cards-personal"></div>
            </div>
        `;

        // Render university projects in the main grid
        const uniContainer = document.getElementById("project-cards-university");
        universityProjects.forEach(project => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${project.image}" alt="${project.name}">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <button class="button more-details-btn">More Details</button>
            `;
            uniContainer.appendChild(card);
            const btn = card.querySelector('.more-details-btn');
            btn.addEventListener('click', () => openProjectModal(project));
        });

        // Render personal projects in their grid below
        const personalContainer = document.getElementById("project-cards-personal");
        personalProjects.forEach(project => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${project.image}" alt="${project.name}">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <button class="button more-details-btn">More Details</button>
            `;
            personalContainer.appendChild(card);
            const btn = card.querySelector('.more-details-btn');
            btn.addEventListener('click', () => openProjectModal(project));
        });

        return; // Skip the general loop
    }

    // General loop for homepage
    projectsToDisplay.forEach(project => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${project.image}" alt="${project.name}">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <button class="button more-details-btn">More Details</button>
        `;

        container.appendChild(card);

        const btn = card.querySelector('.more-details-btn');
        btn.addEventListener('click', () => openProjectModal(project));
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

    // Build links and tech icons row (links left, icons right)
    const linksAndIconsRow = `
      <div class="project-modal-links-icons-row">
        <div class="project-modal-links">
          ${project.links && project.links.length
            ? project.links.map(link =>
                `<a href="${link.url}" class="project-modal-link"${isExternal(link.url) ? ' target="_blank" rel="noopener"' : ''}>${link.label}</a>`
              ).join('')
            : ''}
        </div>
        <div class="project-modal-tech-inline">
          ${project.tech && project.tech.length
            ? project.tech.map(tech =>
                `<img src="assets/images/icons/${tech}.png" alt="${tech} icon" title="${tech}" class="project-tech-icon">`
              ).join('')
            : ''}
        </div>
      </div>
    `;

    // Build screenshots gallery if screenshots exist
    const screenshotsHtml = project.screenshots && project.screenshots.length
        ? `<div class="project-modal-screenshots">
            ${project.screenshots.map((src, i) => {
                const isVideo = src.toLowerCase().endsWith('.mp4');
                return isVideo
                    ? `<video src="${src}" controls class="project-modal-screenshot" alt="${project.name} screenshot ${i+1}"></video>`
                    : `<img src="${src}" alt="${project.name} screenshot ${i+1}" class="project-modal-screenshot">`;
            }).join('')}
        </div>`
        : "";

    // Show "View Project" button only if playable
    const viewProjectBtn = project.playable
        ? `<a href="${project.playable}" class="project-modal-view"${isExternal(project.playable) ? ' target="_blank" rel="noopener"' : ''}>View Project</a>`
        : "";

    // Use banner image if available, otherwise fallback to main image
    const bannerImg = project.banner ? project.banner : project.image;

    let pico8GamesHtml = "";
    if (project.name === "PICO-8 Projects" && Array.isArray(project.games) && project.games.length) {
        pico8GamesHtml = `
          <div class="pico8-games-list">
            ${project.games.map(game => `
              <div class="pico8-game-entry">
                <h4>${game.title}</h4>
                <p>${game.description}</p>
                <iframe src="${game.embed}" width="512" height="512" frameborder="0" allowfullscreen style="background:#222;border-radius:12px;margin-bottom:1.5rem;"></iframe>
              </div>
            `).join('')}
          </div>
        `;
    }

    // Modal HTML structure
    const modalHtml = `
        <div class="project-modal-overlay" tabindex="-1">
            <div class="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <button class="project-modal-close" aria-label="Close">&times;</button>
                <img class="project-modal-banner" src="${bannerImg}" alt="${project.name} banner">
                <h2 id="modal-title">${project.name}</h2>
                <p class="project-modal-description">${project.longDescription}</p>
                ${linksAndIconsRow}
                ${viewProjectBtn}
                ${pico8GamesHtml}
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

    // --- Lightbox logic for screenshots ---
    const screenshots = project.screenshots || [];
    const screenshotImgs = modalRoot.querySelectorAll('.project-modal-screenshot');
    if (screenshots.length > 0) {
        screenshotImgs.forEach((img, idx) => {
            img.style.cursor = "pointer";
            img.addEventListener('click', () => openLightbox(idx));
        });
    }

    function openLightbox(startIdx) {
        let currentIdx = startIdx;

        // Build lightbox HTML
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.tabIndex = -1;
        const isVideo = screenshots[currentIdx].toLowerCase().endsWith('.mp4');
        const mediaHtml = isVideo
            ? `<video src="${screenshots[currentIdx]}" controls class="lightbox-media" alt="Screenshot ${currentIdx + 1}"></video>`
            : `<img src="${screenshots[currentIdx]}" class="lightbox-media" alt="Screenshot ${currentIdx + 1}">`;
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <button class="lightbox-arrow lightbox-prev" aria-label="Previous">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M18 22L10 14L18 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                ${mediaHtml}
                <button class="lightbox-arrow lightbox-next" aria-label="Next">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M10 6L18 14L10 22" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
            </div>
        `;
        document.body.appendChild(lightbox);
        lightbox.focus();

        // Show/hide arrows
        function updateArrows() {
            lightbox.querySelector('.lightbox-prev').style.display = currentIdx === 0 ? 'none' : '';
            lightbox.querySelector('.lightbox-next').style.display = currentIdx === screenshots.length - 1 ? 'none' : '';
        }
        updateArrows();

        // Update media
        function showImage(idx) {
            currentIdx = idx;
            const isVideo = screenshots[currentIdx].toLowerCase().endsWith('.mp4');
            const mediaContainer = lightbox.querySelector('.lightbox-content');
            const mediaElement = mediaContainer.querySelector('.lightbox-media');
            const newMediaHtml = isVideo
                ? `<video src="${screenshots[currentIdx]}" controls class="lightbox-media" alt="Screenshot ${currentIdx + 1}"></video>`
                : `<img src="${screenshots[currentIdx]}" class="lightbox-media" alt="Screenshot ${currentIdx + 1}">`;
            mediaElement.outerHTML = newMediaHtml;
            updateArrows();
        }

        // Arrow events
        lightbox.querySelector('.lightbox-prev').onclick = e => {
            e.stopPropagation();
            if (currentIdx > 0) showImage(currentIdx - 1);
        };
        lightbox.querySelector('.lightbox-next').onclick = e => {
            e.stopPropagation();
            if (currentIdx < screenshots.length - 1) showImage(currentIdx + 1);
        };

        // Close logic
        function closeLightbox() {
            document.body.removeChild(lightbox);
            document.removeEventListener('keydown', keyHandler);
        }
        lightbox.querySelector('.lightbox-close').onclick = closeLightbox;
        lightbox.onclick = e => { if (e.target === lightbox) closeLightbox(); };
        function keyHandler(e) {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft" && currentIdx > 0) showImage(currentIdx - 1);
            if (e.key === "ArrowRight" && currentIdx < screenshots.length - 1) showImage(currentIdx + 1);
        }
        document.addEventListener('keydown', keyHandler);
    }

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
