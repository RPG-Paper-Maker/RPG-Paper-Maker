// -------------------------------------------------------
//
//  [MAIN]
//
//  Main file that always needs to be on the bottom of the other scripts.
//  Contains all the global functions and variables.
//
// -------------------------------------------------------

// -------------------------------------------------------
//  GLOBAL VARIABLES
// -------------------------------------------------------

var $gameStack;
var $gameDatas;
var $currentGameDatas;
var $SQUARE_SIZE;
var $PORTIONS_RAY_NEAR;
var $PORTIONS_RAY_FAR = 1;
var $PORTION_SIZE = 16;
var $elapsedTime = new Date().getTime();
var $keysPressed = new Array;
var $filesToLoad = 0;
var $loadedFiles = 0;
var $fontSize = 13;
var $fontName = "sans-serif";
var $canvasHUD;
var $blockingHero = false;
var $modelHero;
var $canvasWidth, $canvasHeight;
var $windowX, $windowY;
var $screenX = 640, $screenY = 480;
var $renderer;

/**
* Create an array of all the right files in the source dir
 * @param      {String}   source path
 * @param      {Object}   options
 * @param      {Function} callback
 * @jsFiddle   A jsFiddle embed URL
 * @return     {Array} an array of string path
 */
function initialize(){
    $gameDatas = new GameDatas();
    $gameStack = [new TitleScreenState()];
}

// -------------------------------------------------------
//  [getModelHero] Get the model of the hero.
// -------------------------------------------------------

function getModelHero(){
    var mapName = Wanok.generateMapName($gameDatas.systemDatas.idMapStartHero.getValue());
    Wanok.openFile(null, Wanok.FILE_MAPS + mapName + Wanok.FILE_MAP_OBJECTS, true, function(res){
        var json = JSON.parse(res).objs;
        var i, l;

        var jsonObject;
        l = json.length;
        var id = $gameDatas.systemDatas.idObjectStartHero.getValue();
        var portion;
        for (i = 0; i < l; i++){
            jsonObject = json[i];
            if (jsonObject.id === id){
                portion = jsonObject.p;
                break;
            }
        }

        var fileName = MapState.getPortionName(portion[0], portion[1], portion[2]);

        Wanok.openFile(null, Wanok.FILE_MAPS + mapName + "/" + fileName, false, function(res){
            var json = JSON.parse(res);
            var mapPortion = new MapPortion(portion[0], portion[1], portion[2]);
            $modelHero = mapPortion.getHeroModel(json);
        });
    });
}

// -------------------------------------------------------
//  [initializeGL canvas] Initialize the openGL datas when canvas3D is created.
// -------------------------------------------------------

function initializeGL(canvas){

    // Create the renderer
    if ($DESKTOP)
        $renderer = new THREE.Canvas3DRenderer({ canvas: canvas, devicePixelRatio: canvas.devicePixelRatio });
    else{
        $renderer = new THREE.WebGLRenderer();
        $renderer.autoClear = false;
    }

    $renderer.setSize($canvasWidth, $canvasHeight);
}

// -------------------------------------------------------
//  [resizeGL canvas] Set the camera aspect while resizing the window.
// -------------------------------------------------------

function resizeGL(canvas){
    var camera = $gameStack[0].camera;
    if (typeof camera !== 'undefined'){
        camera.threeCamera.aspect = $canvasWidth / $canvasHeight;
        camera.threeCamera.updateProjectionMatrix();
        $renderer.setSize($canvasWidth, $canvasHeight);
    }
}

// -------------------------------------------------------
//  [isLoading] Determinate if files needs to be loaded asynchronously.
// -------------------------------------------------------

function isLoading(){
    if ($filesToLoad === $loadedFiles){
        $filesToLoad = 0;
        $loadedFiles = 0;
        return false;
    }
    return true;
}

// -------------------------------------------------------
//  [createFont fontSize fontName] Link the [fontSize] and the [fontName].
//
//  @returns a string that can be used by the canvasHUD.
// -------------------------------------------------------

function createFont(fontSize, fontName){
    return fontSize + "px " + fontName;
}

// -------------------------------------------------------
//  [updateTimer] If a current game exists, add one second to the timer.
// -------------------------------------------------------

function updateTimer(){
    if ($currentGameDatas !== null){
        $currentGameDatas.playTime++;
    }
}

// -------------------------------------------------------
//  [update] Update the current stack.
// -------------------------------------------------------

function update(){

    // Repeat keypress as long as not blocking
    var continuePressed = true;
    for (var i = 0, l = $keysPressed.length; i < l; i++){
        continuePressed = onKeyPressedRepeat($keysPressed[i]);
        if (!continuePressed)
            break;
    }

    // Update the current stack
    $gameStack[0].update();

    $elapsedTime = new Date().getTime();
}

// -------------------------------------------------------
//  [onKeyPressed] First key press handle for the current stack.
// -------------------------------------------------------

function onKeyPressed(key){
    $gameStack[0].onKeyPressed(key)
}

// -------------------------------------------------------
//  [onKeyReleased] First key release handle for the current stack.
// -------------------------------------------------------

function onKeyReleased(key){
    $gameStack[0].onKeyReleased(key)
}

// -------------------------------------------------------
//  [onKeyPressedRepeat] Key pressed repeat handle for the current stack.
//
//  @returns false if the other keys are blocked after it.
// -------------------------------------------------------

function onKeyPressedRepeat(key){
    return $gameStack[0].onKeyPressedRepeat(key)
}

// -------------------------------------------------------
//  [onKeyPressedAndRepeat] Key pressed repeat handle for the current stack, but with
//  a small wait after the first pressure (generally used for menus).
//
//  @returns false if the other keys are blocked after it.
// -------------------------------------------------------

function onKeyPressedAndRepeat(key){
    return $gameStack[0].onKeyPressedAndRepeat(key)
}

// -------------------------------------------------------
//  [draw3D] Draw the 3D for the current stack.
// -------------------------------------------------------

function draw3D(canvas){
    $gameStack[0].draw3D(canvas);
}

// -------------------------------------------------------
//  [drawHUD] Draw HUD for the current stack.
// -------------------------------------------------------

function drawHUD(canvas){

    // Initialize context
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = createFont($fontSize, $fontName);
    context.strokeStyle = "white";
    context.lineWidth = 1;
    context.webkitImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.fillStyle = "white";
    context.textAlign = "center";

    // Draw current stack
    $gameStack[0].drawHUD(context);
}
