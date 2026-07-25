// ==========================================
// FATIMA JAN SEWA KENDRA
// PROFESSIONAL CROP ENGINE V3 + FINE ROTATE
// ==========================================

// ---------- ELEMENTS ----------
const frontImg = document.getElementById("cropFront");
const backImg = document.getElementById("cropBack");

const btnRotateLeft = document.getElementById("rotateLeft");
const btnRotateRight = document.getElementById("rotateRight");

const btnZoomIn = document.getElementById("zoomIn");
const btnZoomOut = document.getElementById("zoomOut");

const enhanceBtn = document.getElementById("enhanceBtn");
const btnNext = document.getElementById("nextBtn");

// ---------- MODE ----------
const mode = sessionStorage.getItem("scanMode") || "id";

// ---------- IMAGES ----------
const frontData = sessionStorage.getItem("frontImage");
const backData = sessionStorage.getItem("backImage");

if (!frontData) {
    alert("Upload Image First");
    location.href = "index.html";
}

// ---------- LOAD ----------
frontImg.src = frontData;

if (mode === "id") {
    if (backData) backImg.src = backData;
} else {
    const boxes = document.querySelectorAll(".crop-box");
    if (boxes.length > 1) {
        boxes[1].style.display = "none";
    }
}

// ---------- CROPPER ----------
let frontCropper = null;
let backCropper = null;

let enhancedFront = null;
let enhancedBack = null;

// ---------- IMAGE LOAD ----------
if (mode === "id") {
    frontImg.onload = function () {
        frontCropper = create(frontImg);
        addRotationSlider("front");
    };
    backImg.onload = function () {
        backCropper = create(backImg);
        addRotationSlider("back");
    };
} else {
    frontImg.onload = function () {
        frontCropper = create(frontImg);
        addRotationSlider("front");
    };
}

// ==========================================
// BUILD CROPPER
// ==========================================
function create(img) {
    return new Cropper(img, {
        viewMode: 0,
        dragMode: "crop",
        autoCrop: true,
        autoCropArea: 1,
        aspectRatio: NaN,
        movable: true,
        zoomable: true,
        scalable: true,
        rotatable: true,
        responsive: true,
        background: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        minCropBoxWidth: 30,
        minCropBoxHeight: 30,
        ready() {
            const cropper = this.cropper;
            cropper.setAspectRatio(NaN);
            cropper.setDragMode("crop");
        }
    });
}

// ==========================================
// DYNAMIC ROTATION SLIDERS
// ==========================================
function addRotationSlider(side) {
    setTimeout(() => {
        const imgEl = side === "front" ? frontImg : backImg;
        if (!imgEl) return;
        
        const parentBox = imgEl.closest('.crop-box') || imgEl.parentElement.parentElement;
        if (!parentBox) return;

        // पुराने डुप्लीकेट स्लाइडर हटाना
        const oldSlider = parentBox.querySelector(`.slider-wrapper-${side}`);
        if (oldSlider) oldSlider.remove();

        const sliderDiv = document.createElement("div");
        sliderDiv.className = `slider-wrapper-box slider-wrapper-${side}`;
        sliderDiv.style.cssText = "width:90%; margin:15px auto 5px auto; padding:10px; background:#fdfdfd; border:1px solid #e2e8f0; border-radius:8px; text-align:left; box-sizing:border-box;";
        
        const labelName = side === "front" ? "Front Fine Rotate" : "Back Fine Rotate";
        sliderDiv.innerHTML = `
            <label style="font-size:13px; font-family:sans-serif; color:#4a5568; display:block; margin-bottom:6px; font-weight:600;">${labelName}: <span id="${side}AngleDisplay" style="color:#007bff;">0</span>°</label>
            <input type="range" id="${side}FineSlider" style="width:100%; cursor:pointer; accent-color:#007bff;" min="-180" max="180" value="0">
        `;

        parentBox.appendChild(sliderDiv);

        const sliderInput = sliderDiv.querySelector('input[type="range"]');
        const angleDisplay = sliderDiv.querySelector(`#${side}AngleDisplay`);

        sliderInput.addEventListener("input", function () {
            const angle = parseInt(this.value);
            angleDisplay.textContent = angle;

            const targetCropper = side === "front" ? frontCropper : backCropper;
            if (targetCropper) {
                targetCropper.rotateTo(angle);
            }
        });
    }, 800);
}

// ==========================================
// ROTATE BUTTONS (90 DEGREE)
// ==========================================
btnRotateLeft.addEventListener("click", function () {
    if (frontCropper) frontCropper.rotate(-90);
    if (backCropper) backCropper.rotate(-90);
    resetSliders();
});

btnRotateRight.addEventListener("click", function () {
    if (frontCropper) frontCropper.rotate(90);
    if (backCropper) backCropper.rotate(90);
    resetSliders();
});

function resetSliders() {
    ['front', 'back'].forEach(side => {
        const slider = document.getElementById(`${side}FineSlider`);
        const display = document.getElementById(`${side}AngleDisplay`);
        if (slider) slider.value = 0;
        if (display) display.textContent = 0;
    });
}

// ==========================================
// ZOOM
// ==========================================
btnZoomIn.addEventListener("click", function () {
    if (frontCropper) frontCropper.zoom(0.1);
    if (backCropper) backCropper.zoom(0.1);
});

btnZoomOut.addEventListener("click", function () {
    if (frontCropper) frontCropper.zoom(-0.1);
    if (backCropper) backCropper.zoom(-0.1);
});

// ==========================================
// HD ENHANCE
// ==========================================
enhanceBtn.addEventListener("click", function () {
    function enhance(cropper) {
        if (!cropper) return null;
        const canvas = cropper.getCroppedCanvas({
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
            fillColor: "#ffffff"
        });
        if (!canvas) return null;

        const ctx = canvas.getContext("2d");
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = img.data;

        for (let i = 0; i < d.length; i += 4) {
            d[i] = Math.min(255, d[i] * 1.12);
            d[i + 1] = Math.min(255, d[i + 1] * 1.12);
            d[i + 2] = Math.min(255, d[i + 2] * 1.12);
        }
        ctx.putImageData(img, 0, 0);
        return canvas.toDataURL("image/jpeg", 0.75);
    }

    enhancedFront = enhance(frontCropper);
    if (mode === "id") {
        enhancedBack = enhance(backCropper);
    }
    alert("HD Enhance Complete");
});

// ==========================================
// CONTINUE (FINAL CROP SAVE)
// ==========================================
btnNext.addEventListener("click", function () {
    if (!frontCropper) return;

    try {
        let frontDataURL = enhancedFront;
        if (!frontDataURL) {
            const frontCanvas = frontCropper.getCroppedCanvas({
                fillColor: "#ffffff",
                imageSmoothingEnabled: true,
                imageSmoothingQuality: "high"
            });
            if (frontCanvas) frontDataURL = frontCanvas.toDataURL("image/jpeg", 0.90);
        }

        if (frontDataURL) {
            sessionStorage.setItem("frontCrop", frontDataURL);
        }

        if (mode === "id") {
            if (!backCropper) {
                alert("Back Image Missing");
                return;
            }
            let backDataURL = enhancedBack;
            if (!backDataURL) {
                const backCanvas = backCropper.getCroppedCanvas({
                    fillColor: "#ffffff",
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: "high"
                });
                if (backCanvas) backDataURL = backCanvas.toDataURL("image/jpeg", 0.90);
            }
            if (backDataURL) {
                sessionStorage.setItem("backCrop", backDataURL);
            }
        } else {
            sessionStorage.removeItem("backCrop");
        }

        location.href = "preview.html";
    } catch (e) {
        alert("Crop Error : " + e.message);
        console.error(e);
    }
});

// ==========================================
// FREE CROP & INIT
// ==========================================
function enableFreeCrop(cropper) {
    if (!cropper || !cropper.container) return;
    cropper.container.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return;
        cropper.setDragMode("crop");
    });
}

setTimeout(function () {
    if (frontCropper) enableFreeCrop(frontCropper);
    if (backCropper) enableFreeCrop(backCropper);
}, 500);

window.addEventListener("load", function () {
    if (frontCropper) frontCropper.reset();
    if (backCropper) backCropper.reset();
});

frontImg.draggable = false;
if (backImg) backImg.draggable = false;
