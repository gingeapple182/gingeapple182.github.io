// projects.js
const projects = [
    {
        name: "GRONK 2",
        image: "assets/images/gronk_2_home.png",
        description: "A 2D platformer game built in Godot as a personal project to test my skills.",
        link: "https://gingeapple182.itch.io/gronk-2"
    },
    {
        name: "The Swiggles Game",
        image: "assets/images/swiggle_home.png",
        description: "An educational game focused on internet safety for children. Created in collaboration with other students and SWGfL",
        link: "assets/swiggle/index.html"
    },
    {
        name: "The Floor is Lava",
        image: "assets/images/tfil_home.png",
        description: "A 3D platformer-style game built in Unity where the player must escape the facility before the lava rises too high.",
        link: "https://gingeapple182.itch.io/the-floor-is-lava"
    },
    {
        name:"GRONK",
        image:"path/to/gronk-image.jpg",
        description: "A top down basic adventure game used as my first year uni project to develop a basic single page game.",
        link: "https://github.com/gingeapple182/COMP1004"
    }
    // Add more projects here
];

function generateProjectCards() {
    const container = document.getElementById("project-cards-container");
    container.innerHTML = ""; // Clear the container before adding cards

    // Check if we're on the homepage (index.html) or the projects page (projects.html)
    const isHomePage = window.location.pathname === "/index.html";

    // Limit the number of projects displayed on the homepage (first 2 projects)
    const projectsToDisplay = isHomePage ? projects.slice(0, 2) : projects;

    // Loop through the selected projects and create cards
    projectsToDisplay.forEach(project => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${project.image}" alt="${project.name}">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" class="button">View Project</a>
        `;
        
        container.appendChild(card);
    });
}
