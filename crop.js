(() => {
    //角丸マスク生成
    const getLeagueCardMask = function (ctx) {
        ctx.globalCompositeOperation = "destination-in";
        function drawsq(x = 0, y = 0, w = 800, h = 960, r = 19, color = "#FFFFFF") {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.moveTo(x, y + r);
            ctx.arc(x + r, y + h - r, r, Math.PI, Math.PI * 0.5, true);
            ctx.arc(x + w - r, y + h - r, r, Math.PI * 0.5, 0, 1);
            ctx.arc(x + w - r, y + r, r, 0, Math.PI * 1.5, 1);
            ctx.arc(x + r, y + r, r, Math.PI * 1.5, Math.PI, 1);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }

    //////////////////////////////////////////////////////////////////////////////

    const destWidth = 800;
    const destHeight = 960;
    const maxHeight = 600;
    let centerX = 0;
    let centerY = 0;
    let scale = 1.0;

    const uploadButton = document.getElementById("button_upload");
    const canvas = document.getElementById("canvas");
    canvas.width = destWidth;
    canvas.height = destHeight;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    uploadButton.addEventListener('change', function (e) {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = function () {
            img.src = reader.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    });
    img.onload = () => {
        centerX = img.naturalWidth / 2;
        centerY = img.naturalHeight / 2;
        scale = destWidth / img.naturalWidth;
        drawCanvas(centerX, centerY);
    }

    const drawCanvas = function (x, y) {
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, destWidth, destHeight);
        ctx.drawImage(img,
            0, 0, img.naturalWidth, img.naturalHeight,
            (destWidth / 2) - x * scale, destHeight / 2 - y * scale, img.naturalWidth * scale, img.naturalHeight * scale
        );
    };

    let mouseDown = false;
    let startX = 0;
    let startY = 0;
    let startDist = 1;
    let startScale = 1;

    canvas.ontouchstart =
        canvas.onmousedown = (e) => {
            if (e.touches && e.touches.length > 1) {
                if (mouseDown == true) {
                    mouseDown = false;
                    drawCanvas(centerX += (startX - e.touches[0].pageX) * (destHeight / maxHeight) / scale, centerY += (startY - e.touches[0].pageY) * (destHeight / maxHeight) / scale);
                }
                startScale = scale;
                startDist = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
            } else {
                mouseDown = true;
                startX = e.pageX;
                startY = e.pageY;
            }
            return false
        }
    canvas.ontouchend =
        canvas.onmouseout =
        canvas.onmouseup = (e) => {
            if (mouseDown == false) return;
            mouseDown = false;
            drawCanvas(centerX += (startX - e.pageX) * (destHeight / maxHeight) / scale, centerY += (startY - e.pageY) * (destHeight / maxHeight) / scale);
            return false;
        }
    canvas.ontouchmove =
        canvas.onmousemove = (e) => {
            if (e.touches && e.touches.length > 1) {
                scale = startScale * (Math.abs(e.touches[0].pageX - e.touches[1].pageX) / startDist);
            } else {
                if (mouseDown == false) return;
                drawCanvas(centerX + (startX - e.pageX) * (destHeight / maxHeight) / scale, centerY + (startY - e.pageY) * (destHeight / maxHeight) / scale);
            }
            return false;
        }
    canvas.onmousewheel = (e) => {
        scale += e.wheelDelta * 0.0005
        scale = scale < 0 ? 0 : scale;
        drawCanvas(centerX, centerY);
        return false;
    }
})();