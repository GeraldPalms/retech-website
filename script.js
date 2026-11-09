
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

const nextBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("skipBtn");

const choiceCards = document.querySelectorAll(".choice-card");

const loginIndex = 3;
const registerIndex = 4;
const homeIndex = 5;
const sellIndex = 6;
const deviceInfoIndex = 7;
const photosIndex = 8;
const estimateIndex = 9;
const confirmTradeIndex = 10;
const deliveryIndex = 11;
const reviewIndex = 12;
const postedIndex = 13;
const repairIndex = 14;
const repairDetailsIndex = 15;
const schedulePickupIndex = 16;

// PROFILE SCREEN
const profileIndex = Array.from(slides).findIndex(
    slide => slide.id === "profileScreen"
);

// MESSAGES SCREEN
const messagesIndex = Array.from(slides).findIndex(
    slide => slide.id === "messagesScreen"
);

const notificationsIndex = Array.from(slides).findIndex(
    slide => slide.id === "notificationsScreen"
);

const activityIndex = Array.from(slides).findIndex(
    slide => slide.id === "activityScreen"
);

let currentSlide = 0;

// Display the selected screen
function showSlide(index) {

    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        slide.setAttribute("aria-hidden", i !== index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });

    currentSlide = index;

    // Hide onboarding controls on login, registration, and home
    document.querySelector(".onboarding").classList.toggle(
        "login-mode",
        index >= loginIndex
    );
}


// Next button
nextBtn.addEventListener("click", () => {

    if (currentSlide < loginIndex) {
        showSlide(currentSlide + 1);
    }

});


// Skip button
skipBtn.addEventListener("click", () => {
    showSlide(loginIndex);
});


// Select onboarding service cards
choiceCards.forEach((card) => {

    card.addEventListener("click", () => {
        card.classList.toggle("selected");
    });

});


// Open registration screen
document.getElementById("goToRegister").addEventListener("click", (event) => {
    event.preventDefault();
    showSlide(registerIndex);
});


// Return to login screen
document.getElementById("backToLogin").addEventListener("click", (event) => {
    event.preventDefault();
    showSlide(loginIndex);
});


// Login password visibility
document.getElementById("togglePassword").addEventListener("click", () => {

    const passwordInput = document.getElementById("passwordInput");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }

});


// Registration password visibility
document.querySelectorAll(".password-toggle").forEach((button) => {

    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);

        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }

    });

});


// Login form - Temporary Maria Santos Account
document.getElementById("loginForm").addEventListener("submit", (event) => {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("passwordInput").value;

    // Temporary demo account
    const demoEmail = "mariasantos@gmail.com";
    const demoPassword = "mariasantos123";

    // Check login credentials
    if (email === demoEmail && password === demoPassword) {

        showSlide(homeIndex);

    } else {

        alert("Invalid email or password. Please try again.");

    }

});


// Registration form - Disabled for temporary demo
document.getElementById("registerForm").addEventListener("submit", (event) => {

    event.preventDefault();

    alert("Account registration is currently unavailable. Please use the demo account to log in.");

});

// Return to Sell Electronics
document.getElementById("backToSell").addEventListener("click", () => {
    showSlide(sellIndex);
});


// Continue from Device Information to Add Photos
document.getElementById("deviceInfoForm").addEventListener("submit", (event) => {
    event.preventDefault();

    showSlide(photosIndex);
});


// Return to Device Information
document.getElementById("backToDeviceInfo").addEventListener("click", () => {
    showSlide(deviceInfoIndex);
});


// Photo upload elements
const devicePhotos = document.getElementById("devicePhotos");
const photoPreviewList = document.getElementById("photoPreviewList");
const photosContinueBtn = document.getElementById("photosContinueBtn");

let selectedPhotoFiles = [];


// Open photo picker from the large upload box
document.getElementById("openPhotoPicker").addEventListener("click", () => {
    devicePhotos.click();
});


// Open photo picker from the plus button
document.getElementById("addPhotoBtn").addEventListener("click", () => {
    devicePhotos.click();
});



// Display and accumulate selected photos
devicePhotos.addEventListener("change", () => {

    const newFiles = Array.from(devicePhotos.files)
        .filter(file => file.type.startsWith("image/"));

    newFiles.forEach((file) => {

        // Allow up to 3 photos
        if (selectedPhotoFiles.length >= 3) {
            return;
        }

        // Avoid adding the same file twice
        const alreadyAdded = selectedPhotoFiles.some((existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified
        );

        if (!alreadyAdded) {
            selectedPhotoFiles.push(file);
        }

    });

    // Clear previous previews
    photoPreviewList.innerHTML = "";

    // Show selected photos
    selectedPhotoFiles.forEach((file) => {

        const image = document.createElement("img");

        image.src = URL.createObjectURL(file);
        image.alt = "Selected device photo";
        image.classList.add("photo-thumbnail");

        photoPreviewList.appendChild(image);

    });

    // Show remaining empty slots
    for (let i = selectedPhotoFiles.length; i < 3; i++) {

        const emptySlot = document.createElement("div");

        emptySlot.classList.add("empty-photo-slot");
        emptySlot.textContent = "Photo " + (i + 1);

        photoPreviewList.appendChild(emptySlot);

    }

    // Enable Continue when at least one photo is selected
    photosContinueBtn.disabled = selectedPhotoFiles.length === 0;

    // Clear input so the same picker can be opened again
    devicePhotos.value = "";

});





// Calculate and display the estimated trade-in value
function calculateTradeInValue() {

    const brand = document.getElementById("deviceBrand").value;
    const model = document.getElementById("deviceModel").value;

    const condition = document.querySelector(
        'input[name="condition"]:checked'
    ).value;

    const usage = document.getElementById("deviceUsage").value;

    // Sample original values for the prototype
    const baseValues = {
        Phone: 18000,
        Laptop: 30000,
        Tablet: 15000,
        Accessories: 5000,
        Television: 20000,
        Other: 8000
    };

    const originalValue = baseValues[selectedSellCategory] || 18000;

    // Straight-line depreciation assumptions
    const usefulLife = 5;
    const salvageValue = originalValue * 0.10;

    // Convert usage duration into years
    let yearsUsed = 2;

    if (usage === "Less than 6 months") {
        yearsUsed = 0.5;
    } else if (usage === "1 year") {
        yearsUsed = 1;
    } else if (usage === "2 years") {
        yearsUsed = 2;
    } else if (usage === "3 years") {
        yearsUsed = 3;
    } else if (usage === "4 years") {
        yearsUsed = 4;
    } else if (usage === "5+ years") {
        yearsUsed = 5;
    }

    // Calculate annual depreciation
    const annualDepreciation =
        (originalValue - salvageValue) / usefulLife;

    // Calculate book value
    const bookValue = Math.max(
        salvageValue,
        originalValue - annualDepreciation * yearsUsed
    );

    // Condition adjustments
    const conditionFactors = {
        "Like New": 1.00,
        "Good": 0.90,
        "Fair": 0.75,
        "Damaged": 0.50
    };

    // Calculate the estimated value
    const estimatedValue =
        bookValue * conditionFactors[condition];

    // Create a price range using a 10% lower and upper margin
    const lowerEstimate =
        Math.round((estimatedValue * 0.90) / 100) * 100;

    const upperEstimate =
        Math.round((estimatedValue * 1.10) / 100) * 100;

    // Format the price range
    const formattedRange =
        "₱" + lowerEstimate.toLocaleString("en-PH") +
        " - ₱" + upperEstimate.toLocaleString("en-PH");

    // Display estimated price range
    document.getElementById("estimatedPrice").textContent =
        formattedRange;

    // Display device details
    document.getElementById("estimateDeviceName").textContent =
        brand + " " + model;

    document.getElementById("estimateCondition").textContent =
        condition + " condition";

    document.getElementById("estimateCategory").textContent =
        selectedSellCategory;

    document.getElementById("estimateUsage").textContent =
        usage + " used";

    // Display the first uploaded photo
    const imageContainer =
        document.getElementById("estimateDeviceImage");

    imageContainer.innerHTML = "";

    if (selectedPhotoFiles.length > 0) {

        const image = document.createElement("img");

        image.src = URL.createObjectURL(selectedPhotoFiles[0]);
        image.alt = "Uploaded device photo";

        imageContainer.appendChild(image);
    }

}


// Continue from Add Photos to Estimated Value
photosContinueBtn.addEventListener("click", () => {

    if (selectedPhotoFiles.length > 0) {
        calculateTradeInValue();
        showSlide(estimateIndex);
    }

});


// Return to Add Photos
document.getElementById("backToPhotos").addEventListener("click", () => {
    showSlide(photosIndex);
});


// Continue from Estimated Value to Set Your Price
document.getElementById("estimateContinueBtn").addEventListener("click", () => {

    // Transfer device name and condition
    document.getElementById("setPriceDeviceName").textContent =
        document.getElementById("estimateDeviceName").textContent;

    document.getElementById("setPriceCondition").textContent =
        document.getElementById("estimateCondition").textContent;

    // Transfer the first uploaded device photo
    const setPriceImage = document.getElementById("setPriceImage");
    setPriceImage.innerHTML = "";

    if (selectedPhotoFiles.length > 0) {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(selectedPhotoFiles[0]);
        image.alt = "Device photo";
        setPriceImage.appendChild(image);
    }

    // Read the estimated price range
    const priceText =
        document.getElementById("estimatedPrice").textContent;

    const prices = priceText.match(/[\d,]+/g);

    if (prices && prices.length >= 2) {

        const lowerPrice = Number(prices[0].replace(/,/g, ""));
        const upperPrice = Number(prices[1].replace(/,/g, ""));

        // Display suggested price range
        document.getElementById("suggestedPriceRange").textContent =
            "₱" + lowerPrice.toLocaleString("en-PH") +
            " - ₱" + upperPrice.toLocaleString("en-PH");

        // Use the lower estimate as the starting selling price
        document.getElementById("sellingPrice").value = lowerPrice;
    }

    // Open Set Your Price screen
    showSlide(confirmTradeIndex);

});




// Back button: return to Sell Electronics
document.getElementById("backToEstimateBtn").addEventListener("click", () => {
    showSlide(sellIndex);
});



// Continue from Set Your Price to Delivery Option
document.getElementById("setPriceContinueBtn").addEventListener("click", () => {

    const sellingPrice =
        Number(document.getElementById("sellingPrice").value);

    if (!sellingPrice || sellingPrice <= 0) {
        alert("Please enter a valid selling price.");
        return;
    }

    // Open Delivery Option screen
    showSlide(deliveryIndex);

});


// =================================
// SCREEN 12 - DELIVERY OPTION
// =================================

const deliveryCards = document.querySelectorAll(".delivery-card");
const deliveryContinueBtn =
    document.getElementById("deliveryContinueBtn");

let selectedDeliveryMethod = "";


// Select Pickup or Drop-off
deliveryCards.forEach((card) => {

    card.addEventListener("click", () => {

        deliveryCards.forEach((item) => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        selectedDeliveryMethod = card.dataset.method;

        deliveryContinueBtn.disabled = false;

    });

});


// Back to Set Your Price
document.getElementById("backToSetPriceBtn").addEventListener("click", () => {

    showSlide(confirmTradeIndex);

});



// Continue from Delivery Option to Review Listing
deliveryContinueBtn.addEventListener("click", () => {

    if (!selectedDeliveryMethod) {
        alert("Please select Pickup or Drop-off.");
        return;
    }

    // Get device information
    const brand = document.getElementById("deviceBrand").value;
    const model = document.getElementById("deviceModel").value;

    const conditionInput =
        document.querySelector('input[name="condition"]:checked');

    const condition = conditionInput
        ? conditionInput.value
        : "Not specified";

    const usage =
        document.getElementById("deviceUsage").value;

    const description =
        document.getElementById("deviceDescription").value;

    // Display device details
    document.getElementById("reviewDeviceName").textContent =
        brand + " " + model;

    document.getElementById("reviewDeviceCondition").textContent =
        condition + " condition";

    document.getElementById("reviewDeviceUsage").textContent =
        "Device details";

    document.getElementById("reviewDeviceDuration").textContent =
        usage + " used";

    // Display description
    document.getElementById("reviewDescription").textContent =
        description;

    // Display handover method and address
    const address =
        document.getElementById("pickupAddress").value;

    document.getElementById("reviewHandover").textContent =
        selectedDeliveryMethod === "Pickup"
            ? "Pickup - " + address
            : "Drop-off - " + address;

    // Display the first uploaded photo
    const reviewImage =
        document.getElementById("reviewDeviceImage");

    reviewImage.innerHTML = "";

    if (selectedPhotoFiles.length > 0) {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(selectedPhotoFiles[0]);
        image.alt = "Device photo";
        reviewImage.appendChild(image);
    }

    // Open Review Listing
    showSlide(reviewIndex);

});


// Disable Continue until a delivery method is selected
deliveryContinueBtn.disabled = true;

// Back from Review Listing to Delivery Option
document.getElementById("backToDeliveryBtn").addEventListener("click", () => {
    showSlide(deliveryIndex);
});



// Post Listing - open success screen
document.getElementById("postListingBtn").addEventListener("click", () => {

    // Get device information
    const brand = document.getElementById("deviceBrand").value;
    const model = document.getElementById("deviceModel").value;

    // Get the selling price
    const price = Number(document.getElementById("sellingPrice").value);

    // Display device name and price
    document.getElementById("postedDeviceName").textContent =
        brand + " " + model;

    document.getElementById("postedDevicePrice").textContent =
        "₱" + price.toLocaleString("en-PH");

    // Display the first uploaded photo
    const postedImage =
        document.getElementById("postedListingImage");

    postedImage.innerHTML = "";

    if (selectedPhotoFiles.length > 0) {
        const image = document.createElement("img");
        image.src = URL.createObjectURL(selectedPhotoFiles[0]);
        image.alt = "Posted device photo";
        postedImage.appendChild(image);
    }

    // Open Listing Posted screen
    showSlide(postedIndex);

});


// View Listing - demo action
document.getElementById("viewListingBtn").addEventListener("click", () => {

    alert("This listing preview is not connected to the marketplace yet.");

});


// Return to Home
document.getElementById("backToHomeBtn").addEventListener("click", () => {

    showSlide(homeIndex);

});


// =================================
// SCREEN 15 - REPAIR SERVICES
// =================================


// Open Repair Services from the Home Page
document.getElementById("repairHomeBtn").addEventListener("click", () => {
    showSlide(repairIndex);
});


// Back to Home Page
document.getElementById("backToHomeFromRepair").addEventListener("click", () => {
    showSlide(homeIndex);
});


// Repair shop search and category filters
const repairSearch = document.getElementById("repairSearch");
const repairCategories = document.querySelectorAll(".repair-category");
const repairShopCards = document.querySelectorAll(".repair-shop-card");
const repairNoResults = document.getElementById("repairNoResults");

let selectedRepairCategory = "";

function filterRepairShops() {

    const searchText = repairSearch.value.toLowerCase().trim();
    let visibleCount = 0;

    repairShopCards.forEach((shop) => {

        const shopText = shop.dataset.search.toLowerCase();

        const matchesSearch = shopText.includes(searchText);

        const matchesCategory =
            !selectedRepairCategory ||
            shopText.includes(selectedRepairCategory.toLowerCase());

        const showShop = matchesSearch && matchesCategory;

        shop.style.display = showShop ? "flex" : "none";

        if (showShop) {
            visibleCount++;
        }

    });

    repairNoResults.hidden = visibleCount !== 0;
}


// Search as the user types
repairSearch.addEventListener("input", filterRepairShops);


// Select device category
repairCategories.forEach((category) => {

    category.addEventListener("click", () => {

        repairCategories.forEach((item) => {
            item.classList.remove("selected");
        });

        if (selectedRepairCategory === category.dataset.category) {
            selectedRepairCategory = "";
        } else {
            selectedRepairCategory = category.dataset.category;
            category.classList.add("selected");
        }

        filterRepairShops();

    });

});




 // =================================
 // SCREEN 16 - REPAIR SHOP DETAILS
 // =================================

// Open the selected shop's details
document.querySelectorAll(".repair-view-details").forEach((button) => {

    button.addEventListener("click", () => {

        const shopCard = button.closest(".repair-shop-card");

        if (!shopCard) return;

        const shopName =
            shopCard.querySelector(".repair-shop-details > strong").textContent.trim();

        const shopRating =
            shopCard.querySelectorAll(".repair-shop-details p")[0]
                .textContent.replace("★", "").trim();

        const shopLocation =
            shopCard.querySelectorAll(".repair-shop-details p")[1]
                .textContent.replace("●", "").trim();

        // Update the selected shop information
        document.getElementById("detailShopName").textContent = shopName;
        document.getElementById("detailShopRating").textContent = shopRating;
        document.getElementById("detailShopLocation").textContent = shopLocation;

        // Update the selected shop photo
const shopPhoto = document.getElementById("repairDetailsPhoto");

if (shopName === "Electronics Repair Shop") {
    shopPhoto.src = "./assets/electronics-repair-shop.png";
    shopPhoto.alt = "Electronics Repair Shop";
} else if (shopName === "TechFix Services") {
    shopPhoto.src = "./assets/techfix-services.png";
    shopPhoto.alt = "TechFix Services";
}

        // Update services for each shop
        const servicesList =
            document.getElementById("detailShopServices");

        if (shopName === "Electronics Repair Shop") {
            servicesList.innerHTML = `
                <li>Phone repair</li>
                <li>Laptop repair</li>
                <li>Hardware troubleshooting</li>
                <li>Electronics repair</li>
            `;
        } else {
            servicesList.innerHTML = `
                <li>Laptop repair</li>
                <li>Phone repair</li>
                <li>Computer troubleshooting</li>
            `;
        }

        // Navigate to Screen 16
        showSlide(repairDetailsIndex);

    });

});


// Back to Repair Services
document.getElementById("backToRepairServices").addEventListener("click", () => {
    showSlide(repairIndex);
});


// Request Repair - Open Schedule Pickup
document.getElementById("requestRepairBtn").addEventListener("click", () => {
    showSlide(16);
});


// Back to Repair Shop Details from Schedule Pickup
document.getElementById("backToRepairDetails")?.addEventListener("click", () => {
    showSlide(repairDetailsIndex);
});


// Open Messages from Repair Shop Details
document.getElementById("messageRepairShopBtn")?.addEventListener("click", () => {
    showSlide(messagesIndex);
});

// Confirm Pickup - demo action
document.getElementById("schedulePickupForm").addEventListener("submit", (event) => {

    event.preventDefault();

    const location = document.getElementById("pickupLocation").value;
    const date = document.getElementById("pickupDate").value;
    const time = document.getElementById("pickupTime").value;

    alert(
        "Pickup scheduled successfully!\n\n" +
        "Location: " + location +
        "\nDate: " + date +
        "\nTime: " + time +
        "\nPickup Fee: ₱50\n\n" +
        "This is a temporary for demonstration."
    );

    // Return to the Home Page
    showSlide(homeIndex);

});

// Display the first screen when the website loads
showSlide(0);


// Open Sell Electronics screen from the Home Page
document.getElementById("openSell").addEventListener("click", () => {
    showSlide(sellIndex);
});


// Return to Home Page
document.getElementById("backToHome").addEventListener("click", () => {
    showSlide(homeIndex);
});


// Select a selling category
const sellCategories = document.querySelectorAll(".sell-category");
const sellContinueBtn = document.getElementById("sellContinueBtn");

let selectedSellCategory = "";

sellCategories.forEach((category) => {
    category.addEventListener("click", () => {

        sellCategories.forEach((item) => {
            item.classList.remove("selected");
        });

        category.classList.add("selected");

        selectedSellCategory = category.dataset.category;
        sellContinueBtn.disabled = false;
    });
});


// Continue to Device Information
sellContinueBtn.addEventListener("click", () => {
    if (selectedSellCategory) {
        showSlide(deviceInfoIndex);
    }
});

// Open Trade-In screen from Home
document.getElementById("openTradeIn").addEventListener("click", () => {
    showSlide(17);
});

// Return to Home from Trade-In
document.getElementById("backFromTradeIn").addEventListener("click", () => {
    showSlide(homeIndex);
});




// Continue from Trade-In Details to Estimated Value
document.getElementById("tradeInContinueBtn").addEventListener("click", () => {

    // Get information entered by the user
    const brand = document.getElementById("tradeInBrand").value;
    const model = document.getElementById("tradeInModel").value.trim();

    const condition = document.querySelector(
        'input[name="tradeInCondition"]:checked'
    );

    const usage = document.getElementById("tradeInUsage").value;

    // Check if required information is complete
    if (model === "" || !condition || usage === "") {
        alert("Please complete your device information first.");
        return;
    }

    // Display the information on Screen 19
    document.getElementById("estimatedDeviceName").textContent =
        brand + " " + model;

    document.getElementById("estimatedCondition").textContent =
        condition.value + " condition";

    document.getElementById("estimatedUsage").textContent =
        usage === "1 year" ? "1 year used" : usage + " used";

    // Set temporary estimated trade-in value
    document.getElementById("estimatedPrice").textContent = "₱4,000";

    // Open Estimated Trade-In Value screen
    showSlide(18);
});



// Return from Estimated Value to Trade-In Details
document.getElementById("backFromEstimate").addEventListener("click", () => {
    showSlide(17);
});


// Continue from Estimated Value to Confirm Trade-In
document.getElementById("estimatedContinueBtn").addEventListener("click", () => {

    // Copy device information to confirmation screen
    document.getElementById("confirmDeviceName").textContent =
        document.getElementById("estimatedDeviceName").textContent;

    document.getElementById("confirmDeviceCondition").textContent =
        document.getElementById("estimatedCondition").textContent;

    document.getElementById("confirmDeviceUsage").textContent =
        document.getElementById("estimatedUsage").textContent;

    // Copy estimated price
    document.getElementById("confirmEstimatedPrice").textContent =
        document.getElementById("estimatedPrice")?.textContent || "₱4,000";

    // Open Screen 20
    showSlide(19);
});

// Back to Estimated Trade-In Value
document.getElementById("backFromConfirmTrade").addEventListener("click", () => {
    showSlide(18);
});

// Edit device information
document.getElementById("editTradeDetailsBtn").addEventListener("click", () => {
    showSlide(17);
});

// Select Pickup or Drop-Off
document.querySelectorAll("#confirmTradeInScreen .handover-card").forEach(card => {

    card.addEventListener("click", () => {

        document.querySelectorAll("#confirmTradeInScreen .handover-card")
            .forEach(item => item.classList.remove("selected"));

        card.classList.add("selected");

    });

});


// =================================
// SCREEN 21: TRADE-IN STATUS
// =================================

// Confirm Trade-In and proceed to Status
document.getElementById("confirmTradeBtn").addEventListener("click", () => {

    // Check if Pickup or Drop-Off was selected
    const selectedMethod = document.querySelector(
        "#confirmTradeInScreen .handover-card.selected"
    );

    if (!selectedMethod) {
        alert("Please choose a handover method first.");
        return;
    }

    // Transfer device information
    document.getElementById("statusDeviceName").textContent =
        document.getElementById("confirmDeviceName").textContent;

    // Transfer estimated price
    document.getElementById("statusDevicePrice").textContent =
        document.getElementById("confirmEstimatedPrice").textContent;

    // Open Screen 21
    showSlide(20);
});

// Top back arrow
document.getElementById("backFromTradeStatus").addEventListener("click", () => {
    showSlide(19);
});

// Bottom Back button - Return to Home
document.getElementById("statusBackBtn").addEventListener("click", () => {
    showSlide(homeIndex);
});


// =================================
// SCREEN 22: RECYCLE ELECTRONICS
// =================================

// Open Recycle screen from Home
document.getElementById("openRecycle").addEventListener("click", () => {
    showSlide(21);
});

// Return to Home
document.getElementById("backFromRecycle").addEventListener("click", () => {
    showSlide(homeIndex);
});

// Select electronics categories
document.querySelectorAll("#recycleScreen .recycle-category").forEach(card => {

    card.addEventListener("click", () => {
        card.classList.toggle("selected");
    });

});

// Select disposal method
document.querySelectorAll("#recycleScreen .recycle-method").forEach(card => {

    card.addEventListener("click", () => {

        document.querySelectorAll("#recycleScreen .recycle-method")
            .forEach(item => item.classList.remove("selected"));

        card.classList.add("selected");

    });

});

// Continue button
document.getElementById("recycleContinueBtn").addEventListener("click", () => {

    const selectedCategories = document.querySelectorAll(
        "#recycleScreen .recycle-category.selected"
    );

    const selectedMethod = document.querySelector(
        "#recycleScreen .recycle-method.selected"
    );

    if (selectedCategories.length === 0) {
        alert("Please select at least one type of electronics.");
        return;
    }

    if (!selectedMethod) {
        alert("Please choose a disposal method.");
        return;
    }

    showSlide(22);
});


// =================================
// SCREEN 23: DATA PROTECTION
// =================================

// Return to Recycle Electronics
document.getElementById("backFromDataProtection").addEventListener("click", () => {
    showSlide(21);
});


// Continue from Data Protection to Recycling Confirmation
document.getElementById("dataSecuredBtn").addEventListener("click", () => {

    const checkboxes = document.querySelectorAll(
        "#dataProtectionScreen .data-check-item input"
    );

    const allChecked = Array.from(checkboxes).every(
        checkbox => checkbox.checked
    );

    if (!allChecked) {
        alert("Please complete all data protection steps first.");
        return;
    }

    // Get selected recycling categories
    const selectedCategories = document.querySelectorAll(
        "#recycleScreen .recycle-category.selected"
    );

    // Get selected disposal method
    const selectedMethod = document.querySelector(
        "#recycleScreen .recycle-method.selected"
    );

    // Display selected items
    const itemsContainer = document.getElementById("recycleConfirmedItems");

    // Clear previous items
    itemsContainer.innerHTML = "";

    // Match each category to its exported image
    const recycleImages = {
        "Phone": "./assets/recycle-phone.png",
        "Batteries": "./assets/recycle-batteries.png",
        "Charger": "./assets/recycle-charger.png",
        "Laptop": "./assets/recycle-laptop.png",
        "TVs": "./assets/recycle-tv.png",
        "Other": "./assets/recycle-other.png"
    };

    selectedCategories.forEach(category => {

        const categoryName = category.dataset.category;

        // Create item container
        const item = document.createElement("div");
        item.className = "confirmed-recycle-item";

        // Create image
        const image = document.createElement("img");
        image.src = recycleImages[categoryName];
        image.alt = categoryName;

        // Create item name
        const label = document.createElement("span");
        label.textContent = categoryName;

        // Add image and name
        item.appendChild(image);
        item.appendChild(label);

        // Add item to confirmation card
        itemsContainer.appendChild(item);

    });

    // Display selected disposal method
    const methodName = selectedMethod.dataset.method;

    document.getElementById("confirmedRecycleMethod").textContent =
        methodName === "Drop-Off" ? "Drop-off" : "Pickup";

    const methodImage = document.getElementById(
        "confirmedRecycleMethodIcon"
    );

    methodImage.src = methodName === "Drop-Off"
        ? "./assets/drop-off.png"
        : "./assets/pickup-truck.png";

    methodImage.alt = methodName;

    // Display current date
    const today = new Date();

    document.getElementById("recycleConfirmationDate").textContent =
        today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    // Open Screen 24
    showSlide(23);

});


// =================================
// SCREEN 24: RECYCLING CONFIRMATION
// =================================

// Return to Data Protection
document.getElementById("backFromRecycleConfirmation").addEventListener("click", () => {
    showSlide(22);
});

// Open Recycling Status
document.getElementById("viewRecyclingStatusBtn").addEventListener("click", () => {
    showSlide(24);
});

// =================================
// SCREEN 25: RECYCLING STATUS
// =================================

// Top back arrow - Return to Recycling Confirmation
document.getElementById("backFromRecyclingStatus").addEventListener("click", () => {
    showSlide(23);
});

// Bottom Back button - Return to Home
document.getElementById("recyclingStatusBackBtn").addEventListener("click", () => {
    showSlide(homeIndex);
});

// =================================
// SCREEN 26: PROFILE
// =================================

// Open Profile from Home
document.getElementById("openProfileBtn").addEventListener("click", () => {
    showSlide(profileIndex);
});

// Open Home from Profile
document.getElementById("profileHomeBtn").addEventListener("click", () => {
    showSlide(homeIndex);
});

// Return to Home from Profile
document.getElementById("backFromProfile").addEventListener("click", () => {
    showSlide(homeIndex);
});

// Home button inside Profile navigation
document.getElementById("profileHomeBtn").addEventListener("click", () => {
    showSlide(homeIndex);
});

// =================================
// SCREEN 27: MESSAGES NAVIGATION
// =================================

// Open Messages from Home
document.getElementById("openMessagesBtn").addEventListener("click", () => {
    showSlide(messagesIndex);
});

// Open Messages from Profile
const profileMessagesBtn = document.getElementById("profileMessagesBtn");

profileMessagesBtn.addEventListener("click", () => {
    console.log("Profile Messages button clicked!");
    console.log("Messages screen index:", messagesIndex);

    showSlide(messagesIndex);
});

// Return to Home from Messages
document.getElementById("messagesHomeBtn").addEventListener("click", () => {
    showSlide(homeIndex);
});

// Open Profile from Messages
document.getElementById("messagesProfileBtn").addEventListener("click", () => {
    showSlide(profileIndex);
});

// Open Marketplace from Messages
document.getElementById("messagesMarketBtn")?.addEventListener("click", () => {
    showSlide(marketplaceIndex);
});

// =================================
// SCREEN 34: NOTIFICATIONS NAVIGATION
// =================================

// Open Notifications from Home
document.getElementById("openNotificationsBtn")?.addEventListener("click", () => {
    showSlide(notificationsIndex);
});

// Return Home from Notifications
document.getElementById("backFromNotificationsBtn")?.addEventListener("click", () => {
    showSlide(homeIndex);
});

// =================================
// ACTIVITY SCREEN NAVIGATION
// =================================

// Open Activity from Home
document.getElementById("openActivityFromHomeBtn")?.addEventListener("click", () => {
    showSlide(activityIndex);
});

// Open Activity from Profile
document.getElementById("openActivityFromProfileBtn")?.addEventListener("click", () => {
    showSlide(activityIndex);
});

// Open Activity from Messages
document.getElementById("openActivityFromMessagesBtn")?.addEventListener("click", () => {
    showSlide(activityIndex);
});

// Return to Home from Activity
document.getElementById("activityHomeBtn")?.addEventListener("click", () => {
    showSlide(homeIndex);
});

// Open Messages from Activity
document.getElementById("activityMessagesBtn")?.addEventListener("click", () => {
    showSlide(messagesIndex);
});

// Open Profile from Activity
document.getElementById("activityProfileBtn")?.addEventListener("click", () => {
    showSlide(profileIndex);
});

// Search messages
const messagesSearch = document.getElementById("messagesSearch");
const messageRows = document.querySelectorAll(".message-row");
const messagesNoResults = document.getElementById("messagesNoResults");

messagesSearch.addEventListener("input", () => {
    const searchValue = messagesSearch.value.toLowerCase().trim();
    let visibleMessages = 0;

    messageRows.forEach((row) => {
        const messageText = row.dataset.search.toLowerCase();
        const matches = messageText.includes(searchValue);

        row.style.display = matches ? "flex" : "none";

        if (matches) {
            visibleMessages++;
        }
    });

    messagesNoResults.hidden = visibleMessages !== 0;
});

// =================================
// PROFILE: LOG OUT CONFIRMATION
// =================================

const logoutModal = document.getElementById("logoutModal");

// Open confirmation popup
document.getElementById("logoutBtn").addEventListener("click", () => {
    logoutModal.classList.add("show");
});

// Cancel logout
document.getElementById("cancelLogoutBtn").addEventListener("click", () => {
    logoutModal.classList.remove("show");
});

// Confirm logout
document.getElementById("confirmLogoutBtn").addEventListener("click", () => {
    logoutModal.classList.remove("show");
    showSlide(loginIndex);
});


// =================================
// MESSAGES SCREEN NAVIGATION
// =================================

// Return to Home from Messages
document.getElementById("messagesHomeBtn").addEventListener("click", () => {
    showSlide(homeIndex);
});

// Open Profile from Messages
document.getElementById("messagesProfileBtn").addEventListener("click", () => {
    showSlide(profileIndex);
});

// Open Marketplace from Messages
document.getElementById("messageMarketBtn")?.addEventListener("click", () => {
    showSlide(marketplaceIndex);
});

// =================================
// BRANDING SPLASH SCREEN
// =================================

const splashScreen = document.getElementById("splashScreen");

if (splashScreen) {
    setTimeout(() => {
        splashScreen.classList.add("hide");
    }, 2600);
}


// =================================
// SCREEN 29: MARKETPLACE NAVIGATION
// =================================

// Find Marketplace screen
const marketplaceIndex = Array.from(slides).findIndex(
    slide => slide.id === "marketplaceScreen"
);

// Open Marketplace from Home
document.getElementById("openMarketplaceFromHomeBtn")?.addEventListener("click", () => {
    showSlide(marketplaceIndex);
});

// Open Marketplace from Activity
document.getElementById("activityMarketBtn")?.addEventListener("click", () => {
    showSlide(marketplaceIndex);
});

// Open Marketplace from Profile
document.getElementById("openActivityBtn")?.addEventListener("click", () => {
    showSlide(marketplaceIndex);
});

// Back arrow returns to Home
document.getElementById("marketplaceBackBtn")?.addEventListener("click", () => {
    showSlide(homeIndex);
});

// Marketplace bottom navigation
document.getElementById("marketplaceHomeBtn")?.addEventListener("click", () => {
    showSlide(homeIndex);
});

document.getElementById("marketplaceActivityBtn")?.addEventListener("click", () => {
    showSlide(activityIndex);
});

document.getElementById("marketplaceMessagesBtn")?.addEventListener("click", () => {
    showSlide(messagesIndex);
});

document.getElementById("marketplaceProfileBtn")?.addEventListener("click", () => {
    showSlide(profileIndex);
});


// =================================
// MARKETPLACE SEARCH AND FILTERS
// =================================

const marketplaceSearch = document.getElementById("marketplaceSearch");
const marketplaceFilters = document.querySelectorAll(".marketplace-filter");
const marketplaceProductCards = document.querySelectorAll(".marketplace-product");
const marketplaceNoResults = document.getElementById("marketplaceNoResults");

let selectedMarketplaceCategory = "all";

function filterMarketplaceProducts() {

    const searchValue = marketplaceSearch.value.toLowerCase().trim();
    let visibleProducts = 0;

    marketplaceProductCards.forEach(product => {

        const productName = product.textContent.toLowerCase();
        const productCategory = product.dataset.category;

        const matchesSearch = productName.includes(searchValue);

        const matchesCategory =
            selectedMarketplaceCategory === "all" ||
            selectedMarketplaceCategory === "electronics" ||
            productCategory === selectedMarketplaceCategory;

        const isVisible = matchesSearch && matchesCategory;

        product.style.display = isVisible ? "flex" : "none";

        if (isVisible) {
            visibleProducts++;
        }

    });

    marketplaceNoResults.hidden = visibleProducts !== 0;
}

// Category filter buttons
marketplaceFilters.forEach(button => {

    button.addEventListener("click", () => {

        marketplaceFilters.forEach(filter => {
            filter.classList.remove("active");
        });

        button.classList.add("active");

        selectedMarketplaceCategory = button.dataset.category;

        filterMarketplaceProducts();

    });

});

// Search products
marketplaceSearch.addEventListener("input", filterMarketplaceProducts);


// =================================
// SCREEN 30: PRODUCT DETAILS NAVIGATION
// =================================

const productDetailsIndex = Array.from(slides).findIndex(
    slide => slide.id === "productDetailsScreen"
);

// Open Product Details from Samsung Galaxy A52
document.getElementById("samsungProductCard")?.addEventListener("click", () => {
    showSlide(productDetailsIndex);
});

// Return to Marketplace
document.getElementById("backToMarketplaceBtn")?.addEventListener("click", () => {
    showSlide(marketplaceIndex);
});


// =================================
// SCREEN 31: SELLER PROFILE NAVIGATION
// =================================

const sellerProfileIndex = Array.from(slides).findIndex(
    slide => slide.id === "sellerProfileScreen"
);

// Open Seller Profile
document.querySelector(".seller-profile-btn")?.addEventListener("click", () => {

    const sellerScreen = document.getElementById("sellerProfileScreen");

    sellerScreen.scrollTop = 0;

    showSlide(sellerProfileIndex);
});

// Return to Product Details
document.getElementById("backToProductDetailsBtn")?.addEventListener("click", () => {
    showSlide(productDetailsIndex);
});


// Message Seller - Open Messages screen
document.getElementById("messageSellerBtn")?.addEventListener("click", () => {
    showSlide(messagesIndex);
});


// =================================
// SCREEN 32: ORDER CONFIRMATION NAVIGATION
// =================================

const orderConfirmationIndex = Array.from(slides).findIndex(
    slide => slide.id === "orderConfirmationScreen"
);

// Open Order Confirmation from Product Details
document.getElementById("orderPurchaseBtn")?.addEventListener("click", () => {

    const orderScreen = document.getElementById("orderConfirmationScreen");

    orderScreen.scrollTop = 0;

    showSlide(orderConfirmationIndex);

});

// Return to Product Details
document.getElementById("backToProductDetailsFromOrder")?.addEventListener("click", () => {
    showSlide(productDetailsIndex);
});


// =================================
// SCREEN 33: ORDER STATUS NAVIGATION
// =================================

const orderStatusIndex = Array.from(slides).findIndex(
    slide => slide.id === "orderStatusScreen"
);

// Open Order Status from Track Order
document.getElementById("trackOrderBtn")?.addEventListener("click", () => {

    const statusScreen = document.getElementById("orderStatusScreen");

    statusScreen.scrollTop = 0;

    showSlide(orderStatusIndex);

});

// Return to Order Confirmation
document.getElementById("backToOrderConfirmationBtn")?.addEventListener("click", () => {
    showSlide(orderConfirmationIndex);
});

// Open Order Status from Track Order
document.getElementById("trackOrderBtn")?.addEventListener("click", () => {

    const statusScreen = document.getElementById("orderStatusScreen");

    statusScreen.scrollTop = 0;

    showSlide(orderStatusIndex);

});

document.getElementById("openActivityFromMessagesBtn")?.addEventListener("click", () => {
    showSlide(activityIndex);
});

