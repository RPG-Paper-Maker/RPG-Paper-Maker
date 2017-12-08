window.onload = function()
{
    var $keyRepeatStartTime = new Date().getTime();

    window.addEventListener("keydown", doKeyPressed, true);
    window.addEventListener("keyup", doKeyReleased, true);
    
    function getCorrectedKey(key) {
        if (key === 13) return 16777221;
        else if (key === 38) return 16777235;
        else if (key === 40) return 16777237;
        else if (key === 37) return 16777234;
        else if (key === 39) return 16777236;
        else if (key === 27) return 16777216;

        return key;
    }

    function doKeyPressed(event){
        if (!Wanok.isLoading()){
            var k = getCorrectedKey(event.keyCode);

            // Wait 50 ms for a slower update
            var t = new Date().getTime();
            if (t - $keyRepeatStartTime >= 50){
                $keyRepeatStartTime = t;
                onKeyPressedAndRepeat(k);
            }

            if ($keysPressed.indexOf(k) !== -1) return;
            $keysPressed.unshift(k);
            onKeyPressed(k);
        }
    }

    function doKeyReleased(event){
        if (!Wanok.isLoading()){
            var k = getCorrectedKey(event.keyCode);

            $keysPressed.splice($keysPressed.indexOf(k), 1);
            onKeyReleased(k);
        }
    }

    function mainUpdate(){
        if (!Wanok.isLoading()){
            checkWindowSize(window);
            update();
            drawHUD($canvasHUD);
            draw3D(window);
            $hudTexture.needsUpdate = true;
            $renderer.render($sceneHUD, $cameraHUD);
        }
    }

    function checkWindowSize(canvas){
        if ($canvasWidth != canvas.innerWidth || $canvasHeight != canvas.innerHeight){
            $canvasWidth = canvas.innerWidth;
            $canvasHeight = canvas.innerHeight;
            resizeGL(canvas);
        }
    }

    $canvasHUD = document.createElement('canvas');
    $canvasWidth = window.innerWidth;
    $canvasHeight = window.innerHeight;
    $windowX = $canvasWidth / $SCREEN_X;
    $windowY = $canvasHeight / $SCREEN_Y;
    $canvasHUD.width = $canvasWidth;
    $canvasHUD.height = $canvasHeight;
    initialize();
    initializeGL(window);
    document.body.appendChild($renderer.domElement);
    document.body.style.overflow = 'hidden';
    resizeGL(window);

    var $cameraHUD = new THREE.OrthographicCamera(-$canvasHUD.width/2, $canvasHUD.width/2, $canvasHUD.height/2, -$canvasHUD.height/2, 0, 30);
    var $sceneHUD = new THREE.Scene();
    var $hudTexture = new THREE.Texture($canvasHUD);
    $hudTexture.magFilter = THREE.NearestFilter;
    $hudTexture.minFilter = THREE.NearestFilter;

    $hudTexture.needsUpdate = true;
    var material = new THREE.MeshBasicMaterial({map: $hudTexture});
    material.transparent = true;
    var planeGeometry = new THREE.PlaneGeometry($canvasWidth,$canvasHeight);
    var plane = new THREE.Mesh(planeGeometry, material);
    $sceneHUD.add(plane);

    setInterval(mainUpdate, 1000/60);
    setInterval(Wanok.updateTimer, 1000);
}