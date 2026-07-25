// =====================================
// FATIMA JAN SEWA KENDRA
// UPLOAD ENGINE V3
// PART-3A
// =====================================

// ---------- ELEMENTS ----------

const frontInput = document.getElementById("frontInput");
const backInput = document.getElementById("backInput");

const frontPreview = document.getElementById("frontPreview");
const backPreview = document.getElementById("backPreview");

const frontPlaceholder = document.getElementById("frontPlaceholder");
const backPlaceholder = document.getElementById("backPlaceholder");

const frontBox = document.getElementById("frontBox");
const backBox = document.getElementById("backBox");

const continueBtn = document.getElementById("continueBtn");

const idMode = document.getElementById("idMode");
const docMode = document.getElementById("docMode");

let scanMode = sessionStorage.getItem("scanMode") || "id";

// ---------- VARIABLES ----------

let frontImage = "";
let backImage = "";

// ---------- CLICK OPEN ----------

frontBox.addEventListener("click", () => {

    frontInput.click();

});

backBox.addEventListener("click", () => {

    backInput.click();

});

// ---------- FILE PREVIEW ----------

function loadImage(file, preview, placeholder, side){

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        const image = e.target.result;

        preview.src = image;

        preview.classList.add("show");

        placeholder.classList.add("hide");

        if(side==="front"){

            frontImage = image;

        }else{

            backImage = image;

        }

        console.log("scanMode =", scanMode);
        console.log("frontImage =", frontImage);
        console.log("backImage =", backImage);

        enableContinue();

    };

    reader.readAsDataURL(file);

}

function enableContinue(){

    console.log("Enable Continue");
    console.log("Mode =", scanMode);

    if(scanMode==="document"){

        continueBtn.disabled = !frontImage;

    }else{

        continueBtn.disabled = !(frontImage && backImage);

    }

    console.log("Button Disabled =", continueBtn.disabled);

}

// ---------- INPUT CHANGE ----------

frontInput.addEventListener("change",function(){

    if(this.files.length){

        loadImage(

            this.files[0],

            frontPreview,

            frontPlaceholder,

            "front"

        );

    }

});

backInput.addEventListener("change",function(){

    if(this.files.length){

        loadImage(

            this.files[0],

            backPreview,

            backPlaceholder,

            "back"

        );

    }

});
// =====================================
// PART-3B
// DRAG & DROP
// =====================================

function setupDrag(box,input,preview,placeholder,side){

    box.addEventListener("dragover",function(e){

        e.preventDefault();

        box.classList.add("drag");

    });

    box.addEventListener("dragleave",function(){

        box.classList.remove("drag");

    });

    box.addEventListener("drop",function(e){

        e.preventDefault();

        box.classList.remove("drag");

        const files=e.dataTransfer.files;

        if(!files.length) return;

        input.files=files;

        loadImage(

            files[0],

            preview,

            placeholder,

            side

        );

    });

}

setupDrag(

    frontBox,

    frontInput,

    frontPreview,

    frontPlaceholder,

    "front"

);

setupDrag(

    backBox,

    backInput,

    backPreview,

    backPlaceholder,

    "back"

);

// =====================================
// CONTINUE
// =====================================

continueBtn.addEventListener("click",function(){

    if(scanMode==="id"){

    if(!frontImage || !backImage){

        alert("Please Upload Front & Back Aadhaar");

        return;

    }

}

if(scanMode==="document"){

    if(!frontImage){

        alert("Please Upload Document");

        return;

    }

}

    sessionStorage.setItem(

        "frontImage",

        frontImage

    );

    sessionStorage.setItem(

        "backImage",

        backImage

    );

    location.href="crop.html";

});
// =====================================
// PART-3C
// RESET + INIT
// =====================================

// पुराने Crop Data हटाओ
window.addEventListener("load", function () {

    sessionStorage.removeItem("frontCrop");
    sessionStorage.removeItem("backCrop");

    frontImage = "";
    backImage = "";

    enableContinue();

});

// Keyboard Support
document.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        if (!continueBtn.disabled) {

            continueBtn.click();

        }

    }

});

// Image Drag Disable
frontPreview.addEventListener("dragstart", function (e) {

    e.preventDefault();

});

backPreview.addEventListener("dragstart", function (e) {

    e.preventDefault();

});

// Double Click = Change Image

frontPreview.addEventListener("dblclick", function () {

    frontInput.click();

});

backPreview.addEventListener("dblclick", function () {

    backInput.click();

});

// =====================================
// DEBUG
// =====================================

console.log("Upload Engine Loaded Successfully");

idMode.addEventListener("click", function () {

    scanMode = "id";

    sessionStorage.setItem("scanMode", "id");

    idMode.classList.add("active");
    docMode.classList.remove("active");

    document.getElementById("backCard").style.display = "block";

    document.getElementById("frontTitle").innerText = "Front Aadhaar";

    document.getElementById("frontText").innerText = "Upload Front Side";

    document.getElementById("backTitle").style.display = "block";
    document.getElementById("backText").style.display = "block";

});

docMode.addEventListener("click", function () {

    scanMode = "document";

    sessionStorage.setItem("scanMode", "document");

    docMode.classList.add("active");
    idMode.classList.remove("active");

    document.getElementById("backCard").style.display = "none";

    document.getElementById("backTitle").style.display = "none";
   
    document.getElementById("backText").style.display = "none";
    
    document.getElementById("frontTitle").innerText = "Document";

    document.getElementById("frontText").innerText = "Upload Document";

});

// =====================================
// END
// =====================================