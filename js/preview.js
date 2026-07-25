// ==========================================
// FATIMA JAN SEWA KENDRA
// PROFESSIONAL PREVIEW & PRINT ENGINE (JS)
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const frontPreview = document.getElementById("frontPreview");
    const backPreview = document.getElementById("backPreview");
    const backBtn = document.getElementById("backBtn");
    const printBtn = document.getElementById("printBtn");

    // 1. Session Storage से क्रॉप्ड और रोटेटेड इमेज डेटा निकालना
    const frontCrop = sessionStorage.getItem("frontCrop");
    const backCrop = sessionStorage.getItem("backCrop");
    const scanMode = sessionStorage.getItem("scanMode") || "id";

    // 2. इमेजेस को स्क्रीन पर लोड करना
    if (frontCrop) {
        frontPreview.src = frontCrop;
    } else {
        alert("Front image data missing!");
    }

    if (scanMode === "id") {
        if (backCrop) {
            backPreview.src = backCrop;
        }
        frontPreview.classList.remove("document");
        backPreview.classList.remove("document");
        if (backPreview) backPreview.style.display = "block";
    } else {
        // डॉक्यूमेंट मोड में सिर्फ फ्रंट दिखेगा और वो फुल साइज होगा
        frontPreview.classList.add("document");
        if (backPreview) backPreview.style.display = "none";
    }

    // 3. बैक बटन का फंक्शन
    if (backBtn) {
        backBtn.addEventListener("click", function () {
            location.href = "crop.html";
        });
    }

    // 4. प्रिंट बटन का बिल्कुल सटीक फंक्शन (जबरन ऊपर से 1 इंच मार्जिन सेट करना)
    if (printBtn) {
        printBtn.addEventListener("click", function () {
            // प्रिंट से पहले जावास्क्रिप्ट के जरिए सारे पैरेंट कंटेनर्स के डिफ़ॉल्ट फ्लेक्स/सेंटर को डिलीट करना
            const htmlEl = document.documentElement;
            const bodyEl = document.body;
            const containerEl = document.querySelector(".container");
            const cardsEl = document.querySelector(".cards");

            // ब्राउज़र के प्रिंट डायलॉग ओपन होने से ठीक पहले सारे सेंटर अलाइनमेंट नष्ट करना
            if (containerEl) {
                containerEl.style.position = "absolute";
                containerEl.style.top = "1in"; // ऊपर से सटीक 1 इंच नीचे सेट
                containerEl.style.left = "0";
                containerEl.style.width = "100%";
                containerEl.style.height = "auto";
                containerEl.style.margin = "0";
                containerEl.style.padding = "0";
                containerEl.style.display = "block";
            }

            if (cardsEl) {
                cardsEl.style.display = "flex";
                cardsEl.style.justifyContent = "center";
                cardsEl.style.alignItems = "flex-start";
                cardsEl.style.margin = "0";
                cardsEl.style.padding = "0";
            }

            // सिस्टम का प्रिंटर डायलॉग खोलना
            window.print();
        });
    }
});
