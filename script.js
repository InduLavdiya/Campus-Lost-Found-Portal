/* ==========================================================
   FIREBASE IMPORTS
========================================================== */

import {

    db,

    collection,

    addDoc,

    getDocs,

    doc,

    setDoc,

    updateDoc,

    deleteDoc,

    query,

    orderBy,

    onSnapshot

} from "./firebase.js";

/* ==========================================================
   CHECK USER LOGIN
========================================================== */

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if (!currentUser) {

    alert("Please login first.");

    window.location.href = "login.html";

}

/* ==========================================================
   CAMPUS LOST & FOUND PORTAL
========================================================== */

/* ==========================================================
   WAIT UNTIL THE PAGE IS FULLY LOADED
========================================================== */

window.onload = function () {

    setTimeout(function () {

        document.getElementById("loader").style.display = "none";

        document.getElementById("main-content").style.display = "block";

        document.body.style.overflow = "auto";

    }, 2000);

};

/* ==========================================================
   REPORT ITEM MODAL
========================================================== */

/* ==========================================================
   SELECT HTML ELEMENTS
========================================================== */

const reportModal = document.getElementById("reportModal");

const lostButton = document.getElementById("lostButton");

const foundButton = document.getElementById("foundButton");

const closeModal = document.getElementById("closeModal");

const cancelModal = document.getElementById("cancelModal");

const itemType = document.getElementById("itemType");

/* ==========================================================
   OPEN MODAL FOR LOST ITEM
========================================================== */

lostButton.addEventListener("click", function(){

    reportModal.style.display = "flex";

    itemType.value = "Lost";

});

/* ==========================================================
   OPEN MODAL FOR FOUND ITEM
========================================================== */

foundButton.addEventListener("click", function(){

    reportModal.style.display = "flex";

    itemType.value = "Found";

});

/* ==========================================================
   CLOSE MODAL USING X BUTTON
========================================================== */


closeModal.addEventListener("click", function(){

    reportModal.style.display = "none";

});



/* ==========================================================
   CLOSE MODAL USING CANCEL BUTTON
========================================================== */


cancelModal.addEventListener("click", function(){

    reportModal.style.display = "none";

});



/* ==========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE BOX
========================================================== */


window.addEventListener("click", function(event){

    if(event.target === reportModal){

        reportModal.style.display = "none";

    }

});

/* ==========================================================
   UPLOAD IMAGE TO CLOUDINARY
========================================================== */

async function uploadImageToCloudinary(file) {

    // If no image selected, return default image
    if (!file) {

        return "images/no-image.png";

    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(

        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

        {

            method: "POST",

            body: formData

        }

    );

    const data = await response.json();

    return data.secure_url;

}
/* ==========================================================
   REPORT FORM SUBMISSION
========================================================== */


/* ==========================================================
   SELECT FORM
========================================================== */

const reportForm = document.getElementById("reportForm");



/* ==========================================================
   FIRESTORE REPORTS ARRAY
========================================================== */

let reports = [];

/* ==========================================================
   CLOUDINARY CONFIGURATION
========================================================== */

const CLOUD_NAME = "sly4e0oy";

const UPLOAD_PRESET = "campus_lost_found";


/* ==========================================================
   SUBMIT REPORT
========================================================== */

reportForm.addEventListener("submit", async function(event){

    event.preventDefault();

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );
/* ======================================================
   UPLOAD IMAGE
====================================================== */

const imageFile = document.getElementById("image").files[0];

const imageUrl = await uploadImageToCloudinary(imageFile);


    const report = {

        type: document.getElementById("itemType").value,

        name: document.getElementById("itemName").value,

        category: document.getElementById("category").value,

        description: document.getElementById("description").value,

        location: document.getElementById("location").value,

        date: document.getElementById("date").value,

        contact: document.getElementById("contactNumber").value,

        image: imageUrl,

        ownerId: currentUser.uid,

        createdAt: new Date()

    };

    try{
 /* ======================================================
   SAVE / UPDATE REPORT
====================================================== */

if(reportForm.dataset.editId){

    await updateDoc(

        doc(db, "reports", reportForm.dataset.editId),

        {

            type: report.type,

            name: report.name,

            category: report.category,

            description: report.description,

            location: report.location,

            date: report.date,

            contact: report.contact

        }

    );

    delete reportForm.dataset.editId;

    showToast("✅ Report updated successfully!");

}
else{

    await addDoc(

        collection(db, "reports"),

        {

            ...report,

            createdAt: new Date()

        }

    );

    showToast("✅ Report saved successfully!");

}

       
        reportForm.reset();

        reportModal.style.display="none";

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

});
/* ==========================================================
   DISPLAY REPORT CARDS
========================================================== */


/* ==========================================================
   SELECT CONTAINER
========================================================== */


const itemsContainer = document.getElementById("itemsContainer");



/* ==========================================================
   DISPLAY ALL REPORTS
========================================================== */

function displayReports(filteredReports = reports) {

    // Clear previous cards
    itemsContainer.innerHTML = "";

    // Check if no reports exist
    if (filteredReports.length === 0) {

        itemsContainer.innerHTML = `

            <div class="empty-message">

                <i class="fa-solid fa-box-open"></i>

                <h3>No Reports Available</h3>

                <p>
                    Be the first person to report a lost or found item.
                </p>

            </div>

        `;

        return;
    }

    /* ======================================================
       GET CURRENT LOGGED-IN USER
    ====================================================== */

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    /* ======================================================
       CREATE CARDS
    ====================================================== */

    filteredReports.forEach(function(item) {

        const card = document.createElement("div");

        card.className = "item-card";

        let actionButtons = "";

if (currentUser && item.ownerId === currentUser.uid) {

    actionButtons = `

        <div class="button-column">

            <button
            class="view-btn full-btn"
            onclick="viewDetails('${item.firebaseId}')">

                <i class="fa-solid fa-eye"></i>

                View Details

            </button>

            <div class="button-row">

                <button
                class="edit-btn"
                onclick="editReport('${item.firebaseId}')">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>

                <button
                class="delete-btn"
                onclick="deleteReport('${item.firebaseId}')">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </div>

        </div>

    `;

}
else{

    actionButtons = `

        <div class="button-column">

            <button
            class="view-btn full-btn"
            onclick="viewDetails('${item.firebaseId}')">

                <i class="fa-solid fa-eye"></i>

                View Details

            </button>

        </div>

    `;

}

        card.innerHTML = `

            <img src="${item.image}" alt="Item Image">

            <div class="item-info">

                <h3>${item.name}</h3>

                <span class="status ${item.type.toLowerCase()}">

                    ${item.type}

                </span>

                <p>
                    <strong>Category:</strong>
                    ${item.category}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${item.location}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${item.date}
                </p>
 
                ${actionButtons}
            </div>

        `;

        itemsContainer.appendChild(card);

    });

}




/* ==========================================================
   LOAD REPORTS FROM FIRESTORE
========================================================== */

function loadReports() {

    const reportsRef = collection(db, "reports");

    const reportsQuery = query(
        reportsRef,
        orderBy("createdAt", "desc")
    );

    onSnapshot(reportsQuery, function(snapshot){

        reports = [];

        snapshot.forEach(function(docSnapshot){

            reports.push({

                firebaseId: docSnapshot.id,

                ...docSnapshot.data()

            });

        });
        console.log(reports);

        displayReports();

    });

}

/* ==========================================================
   LOAD WHEN PAGE OPENS
========================================================== */

loadReports();
/* ==========================================================
   DELETE REPORT
========================================================== */

async function deleteReport(firebaseId){

    const confirmDelete = confirm(
        "Are you sure you want to delete this report?"
    );

    if(!confirmDelete){

        return;

    }

    try{

        await deleteDoc(

            doc(db, "reports", firebaseId)

        );

        showToast("🗑 Report deleted successfully!");

    }

    catch(error){

        console.error(error);

        showToast("❌ Failed to delete report");

    }

}
/* ==========================================================
   EDIT REPORT
========================================================== */

function editReport(firebaseId){

    const selectedReport = reports.find(function(item){

        return item.firebaseId === firebaseId;

    });

    if(!selectedReport){

        showToast("⚠ Report not found!");

        return;

    }

    reportModal.style.display = "flex";

    document.getElementById("itemType").value = selectedReport.type;

    document.getElementById("itemName").value = selectedReport.name;

    document.getElementById("category").value = selectedReport.category;

    document.getElementById("description").value = selectedReport.description;

    document.getElementById("location").value = selectedReport.location;

    document.getElementById("date").value = selectedReport.date;

    document.getElementById("contact").value = selectedReport.contact;

    reportForm.dataset.editId = firebaseId;

}


/* ==========================================================
   LIVE SEARCH
========================================================== */


const searchInput = document.getElementById("searchInput");


searchInput.addEventListener("input", function(){


    const searchText = searchInput.value.toLowerCase();



    const filteredReports = reports.filter(function(item){


        return (

            item.name.toLowerCase().includes(searchText)

            ||

            item.category.toLowerCase().includes(searchText)

            ||

            item.location.toLowerCase().includes(searchText)

        );


    });



    displayReports(filteredReports);


});
/* ==========================================================
   CATEGORY FILTER
========================================================== */


const filterButtons = document.querySelectorAll(".filter-btn");



filterButtons.forEach(function(button){


    button.addEventListener("click", function(){



        // Remove active from all buttons

        filterButtons.forEach(function(btn){

            btn.classList.remove("active");

        });



        // Add active to clicked button

        button.classList.add("active");



        const selectedCategory =
            button.dataset.category;



        if(selectedCategory === "All"){


            displayReports();


        }

        else{


            const filteredReports = reports.filter(function(item){


                return item.category === selectedCategory;


            });



            displayReports(filteredReports);


        }



    });


});
/* ==========================================================
   TOAST MESSAGE FUNCTION
========================================================== */


function showToast(message){


    const toast =
        document.getElementById("toast");



    toast.innerHTML = message;



    toast.classList.add("show");



    setTimeout(function(){


        toast.classList.remove("show");


    },3000);


}
/* ==========================================================
   VIEW DETAILS FUNCTION
========================================================== */


const detailsModal =
document.getElementById("detailsModal");


const detailsContent =
document.getElementById("detailsContent");


const closeDetails =
document.getElementById("closeDetails");



function viewDetails(id){


   const item = reports.find(function(report){

    return report.firebaseId === id;

});



    if(!item){

        showToast("⚠ Item not found");

        return;

    }



    detailsContent.innerHTML = `


        <img src="${item.image}">


        <p>
            <strong>Name:</strong>
            ${item.name}
        </p>


        <p>
            <strong>Status:</strong>
            ${item.type}
        </p>


        <p>
            <strong>Category:</strong>
            ${item.category}
        </p>


        <p>
            <strong>Description:</strong>
            ${item.description}
        </p>


        <p>
            <strong>Location:</strong>
            ${item.location}
        </p>


        <p>
            <strong>Date:</strong>
            ${item.date}
        </p>


        <p>
           <strong>📞 Contact Number:</strong>
           ${item.contact}
        </p>
       


    `;



    detailsModal.style.display="flex";


}



closeDetails.addEventListener(
"click",
function(){

    detailsModal.style.display="none";

});



/* ==========================================================
   SCROLL TO TOP BUTTON
========================================================== */


const scrollTopBtn =
document.getElementById("scrollTopBtn");



window.addEventListener(
"scroll",
function(){


    if(window.scrollY > 300){


        scrollTopBtn.style.display="block";


    }

    else{


        scrollTopBtn.style.display="none";


    }


});



scrollTopBtn.addEventListener(
"click",
function(){


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });


});

/* ==========================================================
   DARK MODE
========================================================== */


const themeToggle =
document.getElementById("themeToggle");



const savedTheme =
localStorage.getItem("theme");



if(savedTheme === "dark"){

    document.body.classList.add(
        "dark-mode"
    );

    themeToggle.innerHTML="☀️";

}



themeToggle.addEventListener(
"click",
function(){


    document.body.classList.toggle(
        "dark-mode"
    );



    if(document.body.classList.contains("dark-mode")){


        localStorage.setItem(
            "theme",
            "dark"
        );


        themeToggle.innerHTML="☀️";


    }

    else{


        localStorage.setItem(
            "theme",
            "light"
        );


        themeToggle.innerHTML="🌙";


    }


});
/* ==========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML BUTTONS
========================================================== */

window.editReport = editReport;

window.deleteReport = deleteReport;

window.viewDetails = viewDetails;

/* ==========================================================
   NAVBAR FILTERS
========================================================== */

const lostNav = document.getElementById("lostNav");

const foundNav = document.getElementById("foundNav");

const homeNav = document.querySelector('a[href="#home"]');

const aboutNav = document.querySelector('a[href="#about"]');

const contactNav = document.querySelector('a[href="#contact"]');

/* ===========================
   ABOUT
=========================== */

aboutNav.addEventListener("click", function () {

    setActiveNav(aboutNav);

});


/* ===========================
   CONTACT
=========================== */

contactNav.addEventListener("click", function () {

    setActiveNav(contactNav);

});

/* ==========================================================
   ACTIVE NAVIGATION ON SCROLL
========================================================== */

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", function () {

    let currentSection = "";

    sections.forEach(function(section){

        const sectionTop = section.offsetTop - 120;

        const sectionHeight = section.offsetHeight;

        if(

            window.scrollY >= sectionTop &&

            window.scrollY < sectionTop + sectionHeight

        ){

            currentSection = section.getAttribute("id");

        }

    });

    if(currentSection === "home"){

        setActiveNav(homeNav);

    }

    else if(currentSection === "reports"){

        const showingLost = reports.every(function(item){

            return item.type === "Lost";

        });

        const showingFound = reports.every(function(item){

            return item.type === "Found";

        });

        if(showingLost){

            setActiveNav(lostNav);

        }

        else if(showingFound){

            setActiveNav(foundNav);

        }

        else{

            setActiveNav(homeNav);

        }

    }

    else if(currentSection === "about"){

        setActiveNav(aboutNav);

    }

    else if(currentSection === "contact"){

        setActiveNav(contactNav);

    }

});

/* ==========================================================
   ACTIVE NAVIGATION
========================================================== */

const navLinks = document.querySelectorAll(".nav-menu a");

function setActiveNav(activeLink){

    navLinks.forEach(function(link){

        link.classList.remove("active");

    });

    activeLink.classList.add("active");

}


/* ===========================
   HOME
=========================== */

homeNav.addEventListener("click", function () {

    displayReports(reports);

     setActiveNav(homeNav);

    document.getElementById("reports").scrollIntoView({

        behavior: "smooth"

    });

});

/* ===========================
   LOST ITEMS
=========================== */
lostNav.addEventListener("click", function () {

    const lostReports = reports.filter(function(item){

        return item.type === "Lost";

    });

    displayReports(lostReports);

    setActiveNav(lostNav);

    document.getElementById("reports").scrollIntoView({

        behavior: "smooth"

    });

});


/* ===========================
   FOUND ITEMS
=========================== */

foundNav.addEventListener("click", function () {

    const foundReports = reports.filter(function(item){

        return item.type === "Found";

    });

    displayReports(foundReports);

    setActiveNav(foundNav);

    document.getElementById("reports").scrollIntoView({

        behavior: "smooth"

    });

});



/* ==========================================================
   DASHBOARD USER & LOGOUT
========================================================== */

const welcomeUser =
document.getElementById("welcomeUser");

const logoutBtn =
document.getElementById("logoutBtn");


if(welcomeUser && currentUser){

    welcomeUser.innerHTML =
    "Welcome, " + currentUser.name;

}


if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        function(){

            localStorage.removeItem(
                "currentUser"
            );

            window.location.href =
            "index.html";

        }
    );

}