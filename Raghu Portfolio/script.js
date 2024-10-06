// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 7000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('3dCanvas'), antialias: true });
renderer.setClearColor(0x000000); // Match the background color

// Create a torus knot geometry with a bigger size
const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 20);
const material = new THREE.MeshStandardMaterial({
    color: 0xF3CC30,
    emissive: 0xF3CC30,
    emissiveIntensity: 0
});

const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add a point light for reflections
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Add a moving spotlight for dynamic lighting
const spotlight = new THREE.SpotLight(0xffffff, 1);
spotlight.position.set(10, 10, 10);
spotlight.castShadow = true;
scene.add(spotlight);

// Position the camera
camera.position.z = 5;

// Mouse movement for interaction
window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    torusKnot.rotation.y = x * Math.PI; // Rotate the knot based on mouse X
    torusKnot.rotation.x = y * Math.PI; // Rotate the knot based on mouse Y
});

// Raycaster for detecting hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;

// Animation function
function animate() {
    requestAnimationFrame(animate);

    // Rotate the torus knot for dynamic effect
    torusKnot.rotation.z += 0.01;

    // Update point light position for dynamic lighting effect
    pointLight.position.x = 5 * Math.sin(Date.now() * 0.003);
    pointLight.position.z = 5 * Math.cos(Date.now() * 0.003);

    // Raycasting to detect hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([torusKnot]);

    if (intersects.length > 0) {
        hoveredObject = torusKnot;
        torusKnot.material.color.set(0xFFD700); // Highlight color
    } else {
        hoveredObject = null;
        torusKnot.material.color.set(0xF3CC30); // Default color
    }

    renderer.render(scene, camera);
}

// Handle window resize for responsiveness
function handleResize() {
    const canvas = renderer.domElement;
    const container = document.querySelector('.image-container');
    const width = container.clientWidth;
    const height = 800; // Fixed height; adjust if needed

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', handleResize);
handleResize(); // Call initially to set the correct size

// Initial call to start the animation
animate();


// PROGRESS BAR
document.addEventListener("DOMContentLoaded", function() {
    // Select all progress bars
    const progressBars = document.querySelectorAll('.progress-bar');

    // Function to animate the progress bar
    function animateProgressBar(bar) {
        const width = bar.getAttribute('data-width');  // Get the data-width attribute value
        bar.style.width = width + '%';  // Set the width to the actual value
    }

    // Using IntersectionObserver to detect when the skill section is in view
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate progress bars
                progressBars.forEach(bar => {
                    animateProgressBar(bar);
                });
                // Stop observing after the animation is triggered
                observer.disconnect();
            }
        });
    });

    // Observe the skill section
    const skillSection = document.querySelector('.skill');
    observer.observe(skillSection);
});

// contact form
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('.contact-form');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        
        // Validate inputs
        let isValid = true;
        const inputs = form.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.classList.add('is-invalid'); // Add invalid class
                isValid = false; // Mark form as invalid
            } else {
                input.classList.remove('is-invalid'); // Remove invalid class
            }
        });

        if (isValid) {
            // Simulate form submission success (replace this with actual form submission logic)
            formMessage.textContent = "Your message has been sent successfully!";
            formMessage.style.color = "green"; // Change message color
            form.reset(); // Reset form fields

            // Optional: Add animation to the message
            formMessage.classList.add('fade-in'); // Add a class for fade-in animation
            setTimeout(() => {
                formMessage.classList.remove('fade-in'); // Remove class after animation
            }, 3000); // Adjust timing as needed
        } else {
            formMessage.textContent = "Please fill out all fields correctly.";
            formMessage.style.color = "red"; // Change message color
        }
    });
});

// FORM SUBMISSIOn
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formMessage = document.getElementById('formMessage');
    const formData = new FormData(this);

    // Send the form data using Fetch API
    fetch(this.action, {
        method: this.method,
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            // Display success message
            formMessage.innerHTML = '<div class="alert alert-success" role="alert">Message sent successfully!</div>';
        } else {
            // Display error message
            formMessage.innerHTML = '<div class="alert alert-danger" role="alert">An error occurred. Please try again later.</div>';
        }
        formMessage.style.display = 'block'; // Show the message
        this.reset(); // Reset the form fields
    })
    .catch(error => {
        // Display error message
        formMessage.innerHTML = '<div class="alert alert-danger" role="alert">An error occurred. Please try again later.</div>';
        formMessage.style.display = 'block'; // Show the message
    });
});