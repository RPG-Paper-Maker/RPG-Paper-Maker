<!DOCTYPE html>
<html>
    <head>
        <title>Game</title>
        <style>
            html, body, canvas {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            canvas {
                outline: 0;
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                border: none;
                margin: 0;
            }
        </style>

        <script type="text/javascript">
            var $ROOT_DIRECTORY = "./";
            var $DESKTOP = false;
        </script>

       <!-- All the includes -->
       <script src="js/three.js"></script>
       <?php include "includes.html";?>
       
    </head>
    <body>
        <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
        <script language="JavaScript" type="text/javascript" src="/js/jquery-1.2.6.min.js"></script>
        <script language="JavaScript" type="text/javascript" src="/js/jquery-ui-personalized-1.5.2.packed.js"></script>
        <script language="JavaScript" type="text/javascript" src="/js/sprinkle.js"></script>

        <script type="text/javascript">
            window.onload = function()
            {
                var $keyRepeatStartTime = new Date().getTime();

                window.addEventListener("keypress", doKeyPressed, true);
                window.addEventListener("keyup", doKeyReleased, true);
                
                function doKeyPressed(event){
                    if (!isLoading()){

                        // Wait 50 ms for a slower update
                        var t = new Date().getTime();
                        if (t - $keyRepeatStartTime >= 50){
                            $keyRepeatStartTime = t;
                            onKeyPressedAndRepeat(event.keyCode);
                        }

                        if ($keysPressed.indexOf(event.keyCode) !== -1) return;
                        $keysPressed.unshift(event.keyCode);
                        onKeyPressed(event.keyCode);
                    }
                }

                function doKeyReleased(event){
                    if (!isLoading()){
                        $keysPressed.splice($keysPressed.indexOf(event.keyCode), 1);
                        onKeyReleased(event.keyCode);
                    }
                }

                function mainUpdate(){
                    if (!isLoading()){
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

                var $canvasHUD = document.createElement('canvas');
                $canvasWidth = window.innerWidth;
                $canvasHeight = window.innerHeight;
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
  
                var interval = setInterval(mainUpdate, 1000/60);
            }
        </script>
    </body>
</html>