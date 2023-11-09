/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
var Enum;
(function (Enum) {
    /**
     *   Enum for the different command moves kind.
     *   @enum {number}
     *   @readonly
     */
    let CommandMoveKind;
    (function (CommandMoveKind) {
        CommandMoveKind[CommandMoveKind["MoveNorth"] = 0] = "MoveNorth";
        CommandMoveKind[CommandMoveKind["MoveSouth"] = 1] = "MoveSouth";
        CommandMoveKind[CommandMoveKind["MoveWest"] = 2] = "MoveWest";
        CommandMoveKind[CommandMoveKind["MoveEast"] = 3] = "MoveEast";
        CommandMoveKind[CommandMoveKind["MoveNorthWest"] = 4] = "MoveNorthWest";
        CommandMoveKind[CommandMoveKind["MoveNorthEast"] = 5] = "MoveNorthEast";
        CommandMoveKind[CommandMoveKind["MoveSouthWest"] = 6] = "MoveSouthWest";
        CommandMoveKind[CommandMoveKind["MoveSouthEast"] = 7] = "MoveSouthEast";
        CommandMoveKind[CommandMoveKind["MoveRandom"] = 8] = "MoveRandom";
        CommandMoveKind[CommandMoveKind["MoveHero"] = 9] = "MoveHero";
        CommandMoveKind[CommandMoveKind["MoveOppositeHero"] = 10] = "MoveOppositeHero";
        CommandMoveKind[CommandMoveKind["MoveFront"] = 11] = "MoveFront";
        CommandMoveKind[CommandMoveKind["MoveBack"] = 12] = "MoveBack";
        CommandMoveKind[CommandMoveKind["ChangeGraphics"] = 13] = "ChangeGraphics";
        CommandMoveKind[CommandMoveKind["Jump"] = 14] = "Jump";
        CommandMoveKind[CommandMoveKind["TurnNorth"] = 15] = "TurnNorth";
        CommandMoveKind[CommandMoveKind["TurnSouth"] = 16] = "TurnSouth";
        CommandMoveKind[CommandMoveKind["TurnWest"] = 17] = "TurnWest";
        CommandMoveKind[CommandMoveKind["TurnEast"] = 18] = "TurnEast";
        CommandMoveKind[CommandMoveKind["Turn90Right"] = 19] = "Turn90Right";
        CommandMoveKind[CommandMoveKind["Turn90Left"] = 20] = "Turn90Left";
        CommandMoveKind[CommandMoveKind["LookAtHero"] = 21] = "LookAtHero";
        CommandMoveKind[CommandMoveKind["LookAtHeroOpposite"] = 22] = "LookAtHeroOpposite";
        CommandMoveKind[CommandMoveKind["ChangeSpeed"] = 23] = "ChangeSpeed";
        CommandMoveKind[CommandMoveKind["ChangeFrequency"] = 24] = "ChangeFrequency";
        CommandMoveKind[CommandMoveKind["MoveAnimation"] = 25] = "MoveAnimation";
        CommandMoveKind[CommandMoveKind["StopAnimation"] = 26] = "StopAnimation";
        CommandMoveKind[CommandMoveKind["ClimbAnimation"] = 27] = "ClimbAnimation";
        CommandMoveKind[CommandMoveKind["FixDirection"] = 28] = "FixDirection";
        CommandMoveKind[CommandMoveKind["Through"] = 29] = "Through";
        CommandMoveKind[CommandMoveKind["SetWithCamera"] = 30] = "SetWithCamera";
        CommandMoveKind[CommandMoveKind["PixelOffset"] = 31] = "PixelOffset";
        CommandMoveKind[CommandMoveKind["KeepPosition"] = 32] = "KeepPosition";
        CommandMoveKind[CommandMoveKind["Wait"] = 33] = "Wait";
        CommandMoveKind[CommandMoveKind["PlaySound"] = 34] = "PlaySound";
        CommandMoveKind[CommandMoveKind["Script"] = 35] = "Script";
    })(CommandMoveKind = Enum.CommandMoveKind || (Enum.CommandMoveKind = {}));
    /**
     *   Enum for the different event commands kind.
     *   @enum {number}
     *   @readonly
     */
    let EventCommandKind;
    (function (EventCommandKind) {
        EventCommandKind[EventCommandKind["None"] = 0] = "None";
        EventCommandKind[EventCommandKind["ShowText"] = 1] = "ShowText";
        EventCommandKind[EventCommandKind["ChangeVariables"] = 2] = "ChangeVariables";
        EventCommandKind[EventCommandKind["GameOver"] = 3] = "GameOver";
        EventCommandKind[EventCommandKind["While"] = 4] = "While";
        EventCommandKind[EventCommandKind["EndWhile"] = 5] = "EndWhile";
        EventCommandKind[EventCommandKind["WhileBreak"] = 6] = "WhileBreak";
        EventCommandKind[EventCommandKind["InputNumber"] = 7] = "InputNumber";
        EventCommandKind[EventCommandKind["If"] = 8] = "If";
        EventCommandKind[EventCommandKind["Else"] = 9] = "Else";
        EventCommandKind[EventCommandKind["EndIf"] = 10] = "EndIf";
        EventCommandKind[EventCommandKind["OpenMainMenu"] = 11] = "OpenMainMenu";
        EventCommandKind[EventCommandKind["OpenSavesMenu"] = 12] = "OpenSavesMenu";
        EventCommandKind[EventCommandKind["ModifyInventory"] = 13] = "ModifyInventory";
        EventCommandKind[EventCommandKind["ModifyTeam"] = 14] = "ModifyTeam";
        EventCommandKind[EventCommandKind["StartBattle"] = 15] = "StartBattle";
        EventCommandKind[EventCommandKind["IfWin"] = 16] = "IfWin";
        EventCommandKind[EventCommandKind["IfLose"] = 17] = "IfLose";
        EventCommandKind[EventCommandKind["ChangeState"] = 18] = "ChangeState";
        EventCommandKind[EventCommandKind["SendEvent"] = 19] = "SendEvent";
        EventCommandKind[EventCommandKind["TeleportObject"] = 20] = "TeleportObject";
        EventCommandKind[EventCommandKind["MoveObject"] = 21] = "MoveObject";
        EventCommandKind[EventCommandKind["Wait"] = 22] = "Wait";
        EventCommandKind[EventCommandKind["MoveCamera"] = 23] = "MoveCamera";
        EventCommandKind[EventCommandKind["PlayMusic"] = 24] = "PlayMusic";
        EventCommandKind[EventCommandKind["StopMusic"] = 25] = "StopMusic";
        EventCommandKind[EventCommandKind["PlayBackgroundSound"] = 26] = "PlayBackgroundSound";
        EventCommandKind[EventCommandKind["StopBackgroundSound"] = 27] = "StopBackgroundSound";
        EventCommandKind[EventCommandKind["PlaySound"] = 28] = "PlaySound";
        EventCommandKind[EventCommandKind["PlayMusicEffect"] = 29] = "PlayMusicEffect";
        EventCommandKind[EventCommandKind["ChangeProperty"] = 30] = "ChangeProperty";
        EventCommandKind[EventCommandKind["DisplayChoice"] = 31] = "DisplayChoice";
        EventCommandKind[EventCommandKind["Choice"] = 32] = "Choice";
        EventCommandKind[EventCommandKind["EndChoice"] = 33] = "EndChoice";
        EventCommandKind[EventCommandKind["Script"] = 34] = "Script";
        EventCommandKind[EventCommandKind["DisplayAPicture"] = 35] = "DisplayAPicture";
        EventCommandKind[EventCommandKind["SetMoveTurnAPicture"] = 36] = "SetMoveTurnAPicture";
        EventCommandKind[EventCommandKind["RemoveAPicture"] = 37] = "RemoveAPicture";
        EventCommandKind[EventCommandKind["SetDialogBoxOptions"] = 38] = "SetDialogBoxOptions";
        EventCommandKind[EventCommandKind["TitleScreen"] = 39] = "TitleScreen";
        EventCommandKind[EventCommandKind["ChangeScreenTone"] = 40] = "ChangeScreenTone";
        EventCommandKind[EventCommandKind["RemoveObjectFromMap"] = 41] = "RemoveObjectFromMap";
        EventCommandKind[EventCommandKind["StopReaction"] = 42] = "StopReaction";
        EventCommandKind[EventCommandKind["AllowForbidSaves"] = 43] = "AllowForbidSaves";
        EventCommandKind[EventCommandKind["AllowForbidMainMenu"] = 44] = "AllowForbidMainMenu";
        EventCommandKind[EventCommandKind["CallACommonReaction"] = 45] = "CallACommonReaction";
        EventCommandKind[EventCommandKind["Label"] = 46] = "Label";
        EventCommandKind[EventCommandKind["JumpLabel"] = 47] = "JumpLabel";
        EventCommandKind[EventCommandKind["Comment"] = 48] = "Comment";
        EventCommandKind[EventCommandKind["ChangeAStatistic"] = 49] = "ChangeAStatistic";
        EventCommandKind[EventCommandKind["ChangeASkill"] = 50] = "ChangeASkill";
        EventCommandKind[EventCommandKind["ChangeName"] = 51] = "ChangeName";
        EventCommandKind[EventCommandKind["ChangeEquipment"] = 52] = "ChangeEquipment";
        EventCommandKind[EventCommandKind["ModifyCurrency"] = 53] = "ModifyCurrency";
        EventCommandKind[EventCommandKind["DisplayAnAnimation"] = 54] = "DisplayAnAnimation";
        EventCommandKind[EventCommandKind["ShakeScreen"] = 55] = "ShakeScreen";
        EventCommandKind[EventCommandKind["FlashScreen"] = 56] = "FlashScreen";
        EventCommandKind[EventCommandKind["Plugin"] = 57] = "Plugin";
        EventCommandKind[EventCommandKind["StartShopMenu"] = 58] = "StartShopMenu";
        EventCommandKind[EventCommandKind["RestockShop"] = 59] = "RestockShop";
        EventCommandKind[EventCommandKind["EnterANameMenu"] = 60] = "EnterANameMenu";
        EventCommandKind[EventCommandKind["CreateObjectInMap"] = 61] = "CreateObjectInMap";
        EventCommandKind[EventCommandKind["ChangeStatus"] = 62] = "ChangeStatus";
        EventCommandKind[EventCommandKind["ResetCamera"] = 63] = "ResetCamera";
        EventCommandKind[EventCommandKind["ChangeBattleMusic"] = 64] = "ChangeBattleMusic";
        EventCommandKind[EventCommandKind["ChangeVictoryMusic"] = 65] = "ChangeVictoryMusic";
        EventCommandKind[EventCommandKind["EndBattle"] = 66] = "EndBattle";
        EventCommandKind[EventCommandKind["ForceAnAction"] = 67] = "ForceAnAction";
        EventCommandKind[EventCommandKind["ChangeMapProperties"] = 68] = "ChangeMapProperties";
        EventCommandKind[EventCommandKind["ChangeExperienceCurve"] = 69] = "ChangeExperienceCurve";
        EventCommandKind[EventCommandKind["ChangeClass"] = 70] = "ChangeClass";
        EventCommandKind[EventCommandKind["ChangeChronometer"] = 71] = "ChangeChronometer";
        EventCommandKind[EventCommandKind["ChangeWeather"] = 72] = "ChangeWeather";
        EventCommandKind[EventCommandKind["PlayAVideo"] = 73] = "PlayAVideo";
        EventCommandKind[EventCommandKind["SwitchTexture"] = 74] = "SwitchTexture";
        EventCommandKind[EventCommandKind["StopASound"] = 75] = "StopASound";
        EventCommandKind[EventCommandKind["DisplayHideABattler"] = 76] = "DisplayHideABattler";
        EventCommandKind[EventCommandKind["TransformABattler"] = 77] = "TransformABattler";
        EventCommandKind[EventCommandKind["ChangeBattlerGraphics"] = 78] = "ChangeBattlerGraphics";
    })(EventCommandKind = Enum.EventCommandKind || (Enum.EventCommandKind = {}));
    ;
    /**
     *   Enum for the different items kind.
     *   @enum {number}
     *   @readonly
     */
    let ItemKind;
    (function (ItemKind) {
        ItemKind[ItemKind["Item"] = 0] = "Item";
        ItemKind[ItemKind["Weapon"] = 1] = "Weapon";
        ItemKind[ItemKind["Armor"] = 2] = "Armor";
    })(ItemKind = Enum.ItemKind || (Enum.ItemKind = {}));
    ;
    /**
     *   Enum for the different players kind.
     *   @enum {number}
     *   @readonly
     */
    let CharacterKind;
    (function (CharacterKind) {
        CharacterKind[CharacterKind["Hero"] = 0] = "Hero";
        CharacterKind[CharacterKind["Monster"] = 1] = "Monster";
    })(CharacterKind = Enum.CharacterKind || (Enum.CharacterKind = {}));
    /**
     *   Enum for the different groups kind.
     *   @enum {number}
     *   @readonly
     */
    let GroupKind;
    (function (GroupKind) {
        GroupKind[GroupKind["Team"] = 0] = "Team";
        GroupKind[GroupKind["Reserve"] = 1] = "Reserve";
        GroupKind[GroupKind["Hidden"] = 2] = "Hidden";
        GroupKind[GroupKind["Troop"] = 3] = "Troop";
    })(GroupKind = Enum.GroupKind || (Enum.GroupKind = {}));
    /**
     *   Enum for the different horizontal aligns kind.
     *   @enum {string}
     *   @readonly
     */
    let Align;
    (function (Align) {
        Align["None"] = " none";
        Align["Left"] = "left";
        Align["Right"] = "right";
        Align["Center"] = "center";
    })(Align = Enum.Align || (Enum.Align = {}));
    /**
     *   Enum for the different vertical aligns kind.
     *   @enum {string}
     *   @readonly
     */
    let AlignVertical;
    (function (AlignVertical) {
        AlignVertical[AlignVertical["Bot"] = 0] = "Bot";
        AlignVertical[AlignVertical["Top"] = 1] = "Top";
        AlignVertical[AlignVertical["Center"] = 2] = "Center";
    })(AlignVertical = Enum.AlignVertical || (Enum.AlignVertical = {}));
    /**
     *   Enum for the different orientations kind.
     *   @enum {string}
     *   @readonly
     */
    let Orientation;
    (function (Orientation) {
        Orientation[Orientation["South"] = 0] = "South";
        Orientation[Orientation["West"] = 1] = "West";
        Orientation[Orientation["North"] = 2] = "North";
        Orientation[Orientation["East"] = 3] = "East";
        Orientation[Orientation["SouthWest"] = 4] = "SouthWest";
        Orientation[Orientation["SouthEast"] = 5] = "SouthEast";
        Orientation[Orientation["NorthWest"] = 6] = "NorthWest";
        Orientation[Orientation["NorthEast"] = 7] = "NorthEast";
        Orientation[Orientation["Up"] = 8] = "Up";
        Orientation[Orientation["Down"] = 9] = "Down";
        Orientation[Orientation["None"] = 10] = "None";
    })(Orientation = Enum.Orientation || (Enum.Orientation = {}));
    /**
     *   Enum for the different map elements kind.
     *   @enum {number}
     *   @readonly
     */
    let ElementMapKind;
    (function (ElementMapKind) {
        ElementMapKind[ElementMapKind["None"] = 0] = "None";
        ElementMapKind[ElementMapKind["Floors"] = 1] = "Floors";
        ElementMapKind[ElementMapKind["Autotiles"] = 2] = "Autotiles";
        ElementMapKind[ElementMapKind["Water"] = 3] = "Water";
        ElementMapKind[ElementMapKind["SpritesFace"] = 4] = "SpritesFace";
        ElementMapKind[ElementMapKind["SpritesFix"] = 5] = "SpritesFix";
        ElementMapKind[ElementMapKind["SpritesDouble"] = 6] = "SpritesDouble";
        ElementMapKind[ElementMapKind["SpritesQuadra"] = 7] = "SpritesQuadra";
        ElementMapKind[ElementMapKind["SpritesWall"] = 8] = "SpritesWall";
        ElementMapKind[ElementMapKind["Object"] = 9] = "Object";
        ElementMapKind[ElementMapKind["Object3D"] = 10] = "Object3D";
        ElementMapKind[ElementMapKind["Mountains"] = 11] = "Mountains";
    })(ElementMapKind = Enum.ElementMapKind || (Enum.ElementMapKind = {}));
    ;
    /**
     *   Enum for the different sprite walls kind.
     *   @enum {number}
     *   @readonly
     */
    let SpriteWallKind;
    (function (SpriteWallKind) {
        SpriteWallKind[SpriteWallKind["Left"] = 0] = "Left";
        SpriteWallKind[SpriteWallKind["Middle"] = 1] = "Middle";
        SpriteWallKind[SpriteWallKind["Right"] = 2] = "Right";
        SpriteWallKind[SpriteWallKind["LeftRight"] = 3] = "LeftRight";
    })(SpriteWallKind = Enum.SpriteWallKind || (Enum.SpriteWallKind = {}));
    ;
    /**
     *   Enum for the different pictures kind.
     *   @enum {number}
     *   @readonly
     */
    let PictureKind;
    (function (PictureKind) {
        PictureKind[PictureKind["None"] = 0] = "None";
        PictureKind[PictureKind["Bars"] = 1] = "Bars";
        PictureKind[PictureKind["Icons"] = 2] = "Icons";
        PictureKind[PictureKind["Autotiles"] = 3] = "Autotiles";
        PictureKind[PictureKind["Characters"] = 4] = "Characters";
        PictureKind[PictureKind["Mountains"] = 5] = "Mountains";
        PictureKind[PictureKind["Tilesets"] = 6] = "Tilesets";
        PictureKind[PictureKind["Walls"] = 7] = "Walls";
        PictureKind[PictureKind["Battlers"] = 8] = "Battlers";
        PictureKind[PictureKind["Facesets"] = 9] = "Facesets";
        PictureKind[PictureKind["WindowSkins"] = 10] = "WindowSkins";
        PictureKind[PictureKind["TitleScreen"] = 11] = "TitleScreen";
        PictureKind[PictureKind["Objects3D"] = 12] = "Objects3D";
        PictureKind[PictureKind["Pictures"] = 13] = "Pictures";
        PictureKind[PictureKind["Animations"] = 14] = "Animations";
        PictureKind[PictureKind["Skyboxes"] = 15] = "Skyboxes";
        PictureKind[PictureKind["Particles"] = 16] = "Particles";
        PictureKind[PictureKind["GameOver"] = 17] = "GameOver";
    })(PictureKind = Enum.PictureKind || (Enum.PictureKind = {}));
    ;
    /**
     *   Enum for the different songs kind.
     *   @enum {number}
     *   @readonly
     */
    let SongKind;
    (function (SongKind) {
        SongKind[SongKind["None"] = 0] = "None";
        SongKind[SongKind["Music"] = 1] = "Music";
        SongKind[SongKind["BackgroundSound"] = 2] = "BackgroundSound";
        SongKind[SongKind["Sound"] = 3] = "Sound";
        SongKind[SongKind["MusicEffect"] = 4] = "MusicEffect";
    })(SongKind = Enum.SongKind || (Enum.SongKind = {}));
    ;
    /** Enum for the different primitive values kind.
     *   @enum {number}
     *   @readonly
     */
    let DynamicValueKind;
    (function (DynamicValueKind) {
        DynamicValueKind[DynamicValueKind["Unknown"] = -1] = "Unknown";
        DynamicValueKind[DynamicValueKind["None"] = 0] = "None";
        DynamicValueKind[DynamicValueKind["Anything"] = 1] = "Anything";
        DynamicValueKind[DynamicValueKind["Default"] = 2] = "Default";
        DynamicValueKind[DynamicValueKind["Number"] = 3] = "Number";
        DynamicValueKind[DynamicValueKind["Variable"] = 4] = "Variable";
        DynamicValueKind[DynamicValueKind["Parameter"] = 5] = "Parameter";
        DynamicValueKind[DynamicValueKind["Property"] = 6] = "Property";
        DynamicValueKind[DynamicValueKind["DataBase"] = 7] = "DataBase";
        DynamicValueKind[DynamicValueKind["Message"] = 8] = "Message";
        DynamicValueKind[DynamicValueKind["Script"] = 9] = "Script";
        DynamicValueKind[DynamicValueKind["Switch"] = 10] = "Switch";
        DynamicValueKind[DynamicValueKind["KeyBoard"] = 11] = "KeyBoard";
        DynamicValueKind[DynamicValueKind["NumberDouble"] = 12] = "NumberDouble";
        DynamicValueKind[DynamicValueKind["Font"] = 13] = "Font";
        DynamicValueKind[DynamicValueKind["Class"] = 14] = "Class";
        DynamicValueKind[DynamicValueKind["Hero"] = 15] = "Hero";
        DynamicValueKind[DynamicValueKind["Monster"] = 16] = "Monster";
        DynamicValueKind[DynamicValueKind["Troop"] = 17] = "Troop";
        DynamicValueKind[DynamicValueKind["Item"] = 18] = "Item";
        DynamicValueKind[DynamicValueKind["Weapon"] = 19] = "Weapon";
        DynamicValueKind[DynamicValueKind["Armor"] = 20] = "Armor";
        DynamicValueKind[DynamicValueKind["Skill"] = 21] = "Skill";
        DynamicValueKind[DynamicValueKind["Animation"] = 22] = "Animation";
        DynamicValueKind[DynamicValueKind["Status"] = 23] = "Status";
        DynamicValueKind[DynamicValueKind["Tileset"] = 24] = "Tileset";
        DynamicValueKind[DynamicValueKind["FontSize"] = 25] = "FontSize";
        DynamicValueKind[DynamicValueKind["FontName"] = 26] = "FontName";
        DynamicValueKind[DynamicValueKind["Color"] = 27] = "Color";
        DynamicValueKind[DynamicValueKind["WindowSkin"] = 28] = "WindowSkin";
        DynamicValueKind[DynamicValueKind["Currency"] = 29] = "Currency";
        DynamicValueKind[DynamicValueKind["Speed"] = 30] = "Speed";
        DynamicValueKind[DynamicValueKind["Detection"] = 31] = "Detection";
        DynamicValueKind[DynamicValueKind["CameraProperty"] = 32] = "CameraProperty";
        DynamicValueKind[DynamicValueKind["Frequency"] = 33] = "Frequency";
        DynamicValueKind[DynamicValueKind["Skybox"] = 34] = "Skybox";
        DynamicValueKind[DynamicValueKind["BattleMap"] = 35] = "BattleMap";
        DynamicValueKind[DynamicValueKind["Element"] = 36] = "Element";
        DynamicValueKind[DynamicValueKind["CommonStatistic"] = 37] = "CommonStatistic";
        DynamicValueKind[DynamicValueKind["WeaponsKind"] = 38] = "WeaponsKind";
        DynamicValueKind[DynamicValueKind["ArmorsKind"] = 39] = "ArmorsKind";
        DynamicValueKind[DynamicValueKind["CommonBattleCommand"] = 40] = "CommonBattleCommand";
        DynamicValueKind[DynamicValueKind["CommonEquipment"] = 41] = "CommonEquipment";
        DynamicValueKind[DynamicValueKind["Event"] = 42] = "Event";
        DynamicValueKind[DynamicValueKind["State"] = 43] = "State";
        DynamicValueKind[DynamicValueKind["CommonReaction"] = 44] = "CommonReaction";
        DynamicValueKind[DynamicValueKind["Model"] = 45] = "Model";
        DynamicValueKind[DynamicValueKind["CustomStructure"] = 46] = "CustomStructure";
        DynamicValueKind[DynamicValueKind["CustomList"] = 47] = "CustomList";
        DynamicValueKind[DynamicValueKind["Vector2"] = 48] = "Vector2";
        DynamicValueKind[DynamicValueKind["Vector3"] = 49] = "Vector3";
        DynamicValueKind[DynamicValueKind["Bars"] = 50] = "Bars";
        DynamicValueKind[DynamicValueKind["Icons"] = 51] = "Icons";
        DynamicValueKind[DynamicValueKind["Autotiles"] = 52] = "Autotiles";
        DynamicValueKind[DynamicValueKind["Characters"] = 53] = "Characters";
        DynamicValueKind[DynamicValueKind["Mountains"] = 54] = "Mountains";
        DynamicValueKind[DynamicValueKind["Tilesets"] = 55] = "Tilesets";
        DynamicValueKind[DynamicValueKind["Walls"] = 56] = "Walls";
        DynamicValueKind[DynamicValueKind["Battlers"] = 57] = "Battlers";
        DynamicValueKind[DynamicValueKind["Facesets"] = 58] = "Facesets";
        DynamicValueKind[DynamicValueKind["WindowSkins"] = 59] = "WindowSkins";
        DynamicValueKind[DynamicValueKind["TitleScreen"] = 60] = "TitleScreen";
        DynamicValueKind[DynamicValueKind["Object3D"] = 61] = "Object3D";
        DynamicValueKind[DynamicValueKind["Pictures"] = 62] = "Pictures";
        DynamicValueKind[DynamicValueKind["Animations"] = 63] = "Animations";
        DynamicValueKind[DynamicValueKind["SkyBoxes"] = 64] = "SkyBoxes";
        DynamicValueKind[DynamicValueKind["Enum"] = 65] = "Enum";
        DynamicValueKind[DynamicValueKind["Music"] = 66] = "Music";
        DynamicValueKind[DynamicValueKind["BackgroundSound"] = 67] = "BackgroundSound";
        DynamicValueKind[DynamicValueKind["Sound"] = 68] = "Sound";
        DynamicValueKind[DynamicValueKind["MusicEffect"] = 69] = "MusicEffect";
    })(DynamicValueKind = Enum.DynamicValueKind || (Enum.DynamicValueKind = {}));
    ;
    /**
     *   Enum for the different window orientations.
     *   @enum {number}
     *   @readonly
     */
    let OrientationWindow;
    (function (OrientationWindow) {
        OrientationWindow[OrientationWindow["Vertical"] = 0] = "Vertical";
        OrientationWindow[OrientationWindow["Horizontal"] = 1] = "Horizontal";
    })(OrientationWindow = Enum.OrientationWindow || (Enum.OrientationWindow = {}));
    ;
    /**
     *   Enum for the different battler steps.
     *   @enum {number}
     *   @readonly
     */
    let BattlerStep;
    (function (BattlerStep) {
        BattlerStep[BattlerStep["Normal"] = 0] = "Normal";
        BattlerStep[BattlerStep["Attack"] = 1] = "Attack";
        BattlerStep[BattlerStep["Skill"] = 2] = "Skill";
        BattlerStep[BattlerStep["Item"] = 3] = "Item";
        BattlerStep[BattlerStep["Escape"] = 4] = "Escape";
        BattlerStep[BattlerStep["Defense"] = 5] = "Defense";
        BattlerStep[BattlerStep["Attacked"] = 6] = "Attacked";
        BattlerStep[BattlerStep["Victory"] = 7] = "Victory";
        BattlerStep[BattlerStep["Dead"] = 8] = "Dead";
    })(BattlerStep = Enum.BattlerStep || (Enum.BattlerStep = {}));
    ;
    /**
     *   Enum for the different loots kind.
     *   @enum {number}
     *   @readonly
     */
    let LootKind;
    (function (LootKind) {
        LootKind[LootKind["Item"] = 0] = "Item";
        LootKind[LootKind["Weapon"] = 1] = "Weapon";
        LootKind[LootKind["Armor"] = 2] = "Armor";
    })(LootKind = Enum.LootKind || (Enum.LootKind = {}));
    ;
    /**
     *   Enum for the different damages kind.
     *   @enum {number}
     *   @readonly
     */
    let DamagesKind;
    (function (DamagesKind) {
        DamagesKind[DamagesKind["Stat"] = 0] = "Stat";
        DamagesKind[DamagesKind["Currency"] = 1] = "Currency";
        DamagesKind[DamagesKind["Variable"] = 2] = "Variable";
    })(DamagesKind = Enum.DamagesKind || (Enum.DamagesKind = {}));
    ;
    /**
     *   Enum for the different effect kind.
     *   @enum {number}
     *   @readonly
     */
    let EffectKind;
    (function (EffectKind) {
        EffectKind[EffectKind["Damages"] = 0] = "Damages";
        EffectKind[EffectKind["Status"] = 1] = "Status";
        EffectKind[EffectKind["AddRemoveSkill"] = 2] = "AddRemoveSkill";
        EffectKind[EffectKind["PerformSkill"] = 3] = "PerformSkill";
        EffectKind[EffectKind["CommonReaction"] = 4] = "CommonReaction";
        EffectKind[EffectKind["SpecialActions"] = 5] = "SpecialActions";
        EffectKind[EffectKind["Script"] = 6] = "Script";
    })(EffectKind = Enum.EffectKind || (Enum.EffectKind = {}));
    ;
    /**
     *   Enum for the different effect special action kind.
     *   @enum {number}
     *   @readonly
     */
    let EffectSpecialActionKind;
    (function (EffectSpecialActionKind) {
        EffectSpecialActionKind[EffectSpecialActionKind["None"] = -1] = "None";
        EffectSpecialActionKind[EffectSpecialActionKind["ApplyWeapons"] = 0] = "ApplyWeapons";
        EffectSpecialActionKind[EffectSpecialActionKind["OpenSkills"] = 1] = "OpenSkills";
        EffectSpecialActionKind[EffectSpecialActionKind["OpenItems"] = 2] = "OpenItems";
        EffectSpecialActionKind[EffectSpecialActionKind["Escape"] = 3] = "Escape";
        EffectSpecialActionKind[EffectSpecialActionKind["EndTurn"] = 4] = "EndTurn";
        EffectSpecialActionKind[EffectSpecialActionKind["DoNothing"] = 5] = "DoNothing";
    })(EffectSpecialActionKind = Enum.EffectSpecialActionKind || (Enum.EffectSpecialActionKind = {}));
    ;
    /**
     *   Enum for the different characteristic kind.
     *   @enum {number}
     *   @readonly
     */
    let CharacteristicKind;
    (function (CharacteristicKind) {
        CharacteristicKind[CharacteristicKind["IncreaseDecrease"] = 0] = "IncreaseDecrease";
        CharacteristicKind[CharacteristicKind["Script"] = 1] = "Script";
        CharacteristicKind[CharacteristicKind["AllowForbidEquip"] = 2] = "AllowForbidEquip";
        CharacteristicKind[CharacteristicKind["AllowForbidChange"] = 3] = "AllowForbidChange";
        CharacteristicKind[CharacteristicKind["BeginEquipment"] = 4] = "BeginEquipment";
        CharacteristicKind[CharacteristicKind["Element"] = 5] = "Element";
    })(CharacteristicKind = Enum.CharacteristicKind || (Enum.CharacteristicKind = {}));
    ;
    /**
     *   Enum for the different increase / decrease kind.
     *   @enum {number}
     *   @readonly
     */
    let IncreaseDecreaseKind;
    (function (IncreaseDecreaseKind) {
        IncreaseDecreaseKind[IncreaseDecreaseKind["StatValue"] = 0] = "StatValue";
        IncreaseDecreaseKind[IncreaseDecreaseKind["ElementRes"] = 1] = "ElementRes";
        IncreaseDecreaseKind[IncreaseDecreaseKind["StatusRes"] = 2] = "StatusRes";
        IncreaseDecreaseKind[IncreaseDecreaseKind["ExperienceGain"] = 3] = "ExperienceGain";
        IncreaseDecreaseKind[IncreaseDecreaseKind["CurrencyGain"] = 4] = "CurrencyGain";
        IncreaseDecreaseKind[IncreaseDecreaseKind["SkillCost"] = 5] = "SkillCost";
        IncreaseDecreaseKind[IncreaseDecreaseKind["Variable"] = 6] = "Variable";
    })(IncreaseDecreaseKind = Enum.IncreaseDecreaseKind || (Enum.IncreaseDecreaseKind = {}));
    ;
    /**
     *   Enum for the different target kind.
     *   @enum {number}
     *   @readonly
     */
    let TargetKind;
    (function (TargetKind) {
        TargetKind[TargetKind["None"] = 0] = "None";
        TargetKind[TargetKind["User"] = 1] = "User";
        TargetKind[TargetKind["Enemy"] = 2] = "Enemy";
        TargetKind[TargetKind["Ally"] = 3] = "Ally";
        TargetKind[TargetKind["AllEnemies"] = 4] = "AllEnemies";
        TargetKind[TargetKind["AllAllies"] = 5] = "AllAllies";
    })(TargetKind = Enum.TargetKind || (Enum.TargetKind = {}));
    ;
    /**
     *   Enum for the different available kind.
     *   @enum {number}
     *   @readonly
     */
    let AvailableKind;
    (function (AvailableKind) {
        AvailableKind[AvailableKind["Battle"] = 0] = "Battle";
        AvailableKind[AvailableKind["MainMenu"] = 1] = "MainMenu";
        AvailableKind[AvailableKind["Always"] = 2] = "Always";
        AvailableKind[AvailableKind["Never"] = 3] = "Never";
    })(AvailableKind = Enum.AvailableKind || (Enum.AvailableKind = {}));
    ;
    /**
     *   Enum for the different shape kind.
     *   @enum {number}
     *   @readonly
     */
    let ShapeKind;
    (function (ShapeKind) {
        ShapeKind[ShapeKind["Box"] = 0] = "Box";
        ShapeKind[ShapeKind["Sphere"] = 1] = "Sphere";
        ShapeKind[ShapeKind["Cylinder"] = 2] = "Cylinder";
        ShapeKind[ShapeKind["Cone"] = 3] = "Cone";
        ShapeKind[ShapeKind["Capsule"] = 4] = "Capsule";
        ShapeKind[ShapeKind["Custom"] = 5] = "Custom";
    })(ShapeKind = Enum.ShapeKind || (Enum.ShapeKind = {}));
    ;
    /**
     *   Enum for the different custom shape kind.
     *   @enum {number}
     *   @readonly
     */
    let CustomShapeKind;
    (function (CustomShapeKind) {
        CustomShapeKind[CustomShapeKind["None"] = 0] = "None";
        CustomShapeKind[CustomShapeKind["OBJ"] = 1] = "OBJ";
        CustomShapeKind[CustomShapeKind["MTL"] = 2] = "MTL";
        CustomShapeKind[CustomShapeKind["Collisions"] = 3] = "Collisions";
    })(CustomShapeKind = Enum.CustomShapeKind || (Enum.CustomShapeKind = {}));
    ;
    /**
     *   Enum for the different object collision kind.
     *   @enum {number}
     *   @readonly
     */
    let ObjectCollisionKind;
    (function (ObjectCollisionKind) {
        ObjectCollisionKind[ObjectCollisionKind["None"] = 0] = "None";
        ObjectCollisionKind[ObjectCollisionKind["Perfect"] = 1] = "Perfect";
        ObjectCollisionKind[ObjectCollisionKind["Simplified"] = 2] = "Simplified";
        ObjectCollisionKind[ObjectCollisionKind["Custom"] = 3] = "Custom";
    })(ObjectCollisionKind = Enum.ObjectCollisionKind || (Enum.ObjectCollisionKind = {}));
    ;
    /**
     *   Enum for the map transitions.
     *   @enum {number}
     *   @readonly
     */
    let MapTransitionKind;
    (function (MapTransitionKind) {
        MapTransitionKind[MapTransitionKind["None"] = 0] = "None";
        MapTransitionKind[MapTransitionKind["Fade"] = 1] = "Fade";
        MapTransitionKind[MapTransitionKind["Zoom"] = 2] = "Zoom";
    })(MapTransitionKind = Enum.MapTransitionKind || (Enum.MapTransitionKind = {}));
    ;
    /**
     *   Enum for the map transitions.
     *   @enum {number}
     *   @readonly
     */
    let MountainCollisionKind;
    (function (MountainCollisionKind) {
        MountainCollisionKind[MountainCollisionKind["Default"] = 0] = "Default";
        MountainCollisionKind[MountainCollisionKind["Always"] = 1] = "Always";
        MountainCollisionKind[MountainCollisionKind["Never"] = 2] = "Never";
    })(MountainCollisionKind = Enum.MountainCollisionKind || (Enum.MountainCollisionKind = {}));
    ;
    /**
     *   Enum for the title screen commands.
     *   @enum {number}
     *   @readonly
     */
    let TitleCommandKind;
    (function (TitleCommandKind) {
        TitleCommandKind[TitleCommandKind["NewGame"] = 0] = "NewGame";
        TitleCommandKind[TitleCommandKind["LoadGame"] = 1] = "LoadGame";
        TitleCommandKind[TitleCommandKind["Settings"] = 2] = "Settings";
        TitleCommandKind[TitleCommandKind["Exit"] = 3] = "Exit";
        TitleCommandKind[TitleCommandKind["Script"] = 4] = "Script";
    })(TitleCommandKind = Enum.TitleCommandKind || (Enum.TitleCommandKind = {}));
    ;
    /**
     *   Enum for the game over commands.
     *   @enum {number}
     *   @readonly
     */
    let GameOverCommandKind;
    (function (GameOverCommandKind) {
        GameOverCommandKind[GameOverCommandKind["Continue"] = 0] = "Continue";
        GameOverCommandKind[GameOverCommandKind["TitleScreen"] = 1] = "TitleScreen";
        GameOverCommandKind[GameOverCommandKind["Exit"] = 2] = "Exit";
        GameOverCommandKind[GameOverCommandKind["Script"] = 3] = "Script";
    })(GameOverCommandKind = Enum.GameOverCommandKind || (Enum.GameOverCommandKind = {}));
    ;
    /**
     *   Enum for the title settings.
     *   @enum {number}
     *   @readonly
     */
    let TitleSettingKind;
    (function (TitleSettingKind) {
        TitleSettingKind[TitleSettingKind["KeyboardAssigment"] = 0] = "KeyboardAssigment";
        TitleSettingKind[TitleSettingKind["Language"] = 1] = "Language";
    })(TitleSettingKind = Enum.TitleSettingKind || (Enum.TitleSettingKind = {}));
    ;
    /**
     *   Enum for the object moving.
     *   @enum {number}
     *   @readonly
     */
    let ObjectMovingKind;
    (function (ObjectMovingKind) {
        ObjectMovingKind[ObjectMovingKind["Fix"] = 0] = "Fix";
        ObjectMovingKind[ObjectMovingKind["Random"] = 1] = "Random";
        ObjectMovingKind[ObjectMovingKind["Route"] = 2] = "Route";
    })(ObjectMovingKind = Enum.ObjectMovingKind || (Enum.ObjectMovingKind = {}));
    ;
    /**
     *   Enum for the tags.
     *   @enum {number}
     *   @readonly
     */
    let TagKind;
    (function (TagKind) {
        TagKind[TagKind["NewLine"] = 0] = "NewLine";
        TagKind[TagKind["Text"] = 1] = "Text";
        TagKind[TagKind["Bold"] = 2] = "Bold";
        TagKind[TagKind["Italic"] = 3] = "Italic";
        TagKind[TagKind["Left"] = 4] = "Left";
        TagKind[TagKind["Center"] = 5] = "Center";
        TagKind[TagKind["Right"] = 6] = "Right";
        TagKind[TagKind["Size"] = 7] = "Size";
        TagKind[TagKind["Font"] = 8] = "Font";
        TagKind[TagKind["TextColor"] = 9] = "TextColor";
        TagKind[TagKind["BackColor"] = 10] = "BackColor";
        TagKind[TagKind["StrokeColor"] = 11] = "StrokeColor";
        TagKind[TagKind["Variable"] = 12] = "Variable";
        TagKind[TagKind["Parameter"] = 13] = "Parameter";
        TagKind[TagKind["Property"] = 14] = "Property";
        TagKind[TagKind["HeroName"] = 15] = "HeroName";
        TagKind[TagKind["Icon"] = 16] = "Icon";
    })(TagKind = Enum.TagKind || (Enum.TagKind = {}));
    ;
    /**
     *   Enum for the condition heroes.
     *   @enum {number}
     *   @readonly
     */
    let ConditionHeroesKind;
    (function (ConditionHeroesKind) {
        ConditionHeroesKind[ConditionHeroesKind["AllTheHeroes"] = 0] = "AllTheHeroes";
        ConditionHeroesKind[ConditionHeroesKind["NoneOfTheHeroes"] = 1] = "NoneOfTheHeroes";
        ConditionHeroesKind[ConditionHeroesKind["AtLeastOneHero"] = 2] = "AtLeastOneHero";
        ConditionHeroesKind[ConditionHeroesKind["TheHeroeWithInstanceID"] = 3] = "TheHeroeWithInstanceID";
    })(ConditionHeroesKind = Enum.ConditionHeroesKind || (Enum.ConditionHeroesKind = {}));
    ;
    /**
     *   Enum for the variables map object characteristics.
     *   @enum {number}
     *   @readonly
     */
    let VariableMapObjectCharacteristicKind;
    (function (VariableMapObjectCharacteristicKind) {
        VariableMapObjectCharacteristicKind[VariableMapObjectCharacteristicKind["XSquarePosition"] = 0] = "XSquarePosition";
        VariableMapObjectCharacteristicKind[VariableMapObjectCharacteristicKind["YSquarePosition"] = 1] = "YSquarePosition";
        VariableMapObjectCharacteristicKind[VariableMapObjectCharacteristicKind["ZSquarePosition"] = 2] = "ZSquarePosition";
        VariableMapObjectCharacteristicKind[VariableMapObjectCharacteristicKind["XPixelPosition"] = 3] = "XPixelPosition";
        VariableMapObjectCharacteristicKind[VariableMapObjectCharacteristicKind["YPixelPosition"] = 4] = "YPixelPosition";
        VariableMapObjectCharacteristicKind[VariableMapObjectCharacteristicKind["ZPixelPosition"] = 5] = "ZPixelPosition";
        VariableMapObjectCharacteristicKind[VariableMapObjectCharacteristicKind["Orientation"] = 6] = "Orientation";
        VariableMapObjectCharacteristicKind[VariableMapObjectCharacteristicKind["Terrain"] = 7] = "Terrain";
    })(VariableMapObjectCharacteristicKind = Enum.VariableMapObjectCharacteristicKind || (Enum.VariableMapObjectCharacteristicKind = {}));
    ;
    /**
     *   Enum for the animation position kind.
     *   @enum {number}
     *   @readonly
     */
    let AnimationPositionKind;
    (function (AnimationPositionKind) {
        AnimationPositionKind[AnimationPositionKind["Top"] = 0] = "Top";
        AnimationPositionKind[AnimationPositionKind["Middle"] = 1] = "Middle";
        AnimationPositionKind[AnimationPositionKind["Bottom"] = 2] = "Bottom";
        AnimationPositionKind[AnimationPositionKind["ScreenCenter"] = 3] = "ScreenCenter";
    })(AnimationPositionKind = Enum.AnimationPositionKind || (Enum.AnimationPositionKind = {}));
    ;
    /**
     *   Enum for the animation effect condition kind.
     *   @enum {number}
     *   @readonly
     */
    let AnimationEffectConditionKind;
    (function (AnimationEffectConditionKind) {
        AnimationEffectConditionKind[AnimationEffectConditionKind["None"] = 0] = "None";
        AnimationEffectConditionKind[AnimationEffectConditionKind["Hit"] = 1] = "Hit";
        AnimationEffectConditionKind[AnimationEffectConditionKind["Miss"] = 2] = "Miss";
        AnimationEffectConditionKind[AnimationEffectConditionKind["Critical"] = 3] = "Critical";
    })(AnimationEffectConditionKind = Enum.AnimationEffectConditionKind || (Enum.AnimationEffectConditionKind = {}));
    ;
    /**
     *   Enum for the monster action kind.
     *   @enum {number}
     *   @readonly
     */
    let MonsterActionKind;
    (function (MonsterActionKind) {
        MonsterActionKind[MonsterActionKind["UseSkill"] = 0] = "UseSkill";
        MonsterActionKind[MonsterActionKind["UseItem"] = 1] = "UseItem";
        MonsterActionKind[MonsterActionKind["DoNothing"] = 2] = "DoNothing";
    })(MonsterActionKind = Enum.MonsterActionKind || (Enum.MonsterActionKind = {}));
    ;
    /**
     *   Enum for the monster action target kind.
     *   @enum {number}
     *   @readonly
     */
    let MonsterActionTargetKind;
    (function (MonsterActionTargetKind) {
        MonsterActionTargetKind[MonsterActionTargetKind["Random"] = 0] = "Random";
        MonsterActionTargetKind[MonsterActionTargetKind["WeakEnemies"] = 1] = "WeakEnemies";
    })(MonsterActionTargetKind = Enum.MonsterActionTargetKind || (Enum.MonsterActionTargetKind = {}));
    ;
    /**
     *   Enum for the operation kind.
     *   @enum {number}
     *   @readonly
     */
    let OperationKind;
    (function (OperationKind) {
        OperationKind[OperationKind["EqualTo"] = 0] = "EqualTo";
        OperationKind[OperationKind["NotEqualTo"] = 1] = "NotEqualTo";
        OperationKind[OperationKind["GreaterThanOrEqualTo"] = 2] = "GreaterThanOrEqualTo";
        OperationKind[OperationKind["LesserThanOrEqualTo"] = 3] = "LesserThanOrEqualTo";
        OperationKind[OperationKind["GreaterThan"] = 4] = "GreaterThan";
        OperationKind[OperationKind["LesserThan"] = 5] = "LesserThan";
    })(OperationKind = Enum.OperationKind || (Enum.OperationKind = {}));
    ;
    /**
     *   Enum for the battle step.
     *   @enum {number}
     *   @readonly
     */
    let BattleStep;
    (function (BattleStep) {
        BattleStep[BattleStep["Initialize"] = 0] = "Initialize";
        BattleStep[BattleStep["StartTurn"] = 1] = "StartTurn";
        BattleStep[BattleStep["Selection"] = 2] = "Selection";
        BattleStep[BattleStep["Animation"] = 3] = "Animation";
        BattleStep[BattleStep["EnemyAttack"] = 4] = "EnemyAttack";
        BattleStep[BattleStep["EndTurn"] = 5] = "EndTurn";
        BattleStep[BattleStep["Victory"] = 6] = "Victory";
    })(BattleStep = Enum.BattleStep || (Enum.BattleStep = {}));
    ;
    /**
     * Enum for the screen transition.
     *
     * @export
     * @enum {number}
     */
    let FadeType;
    (function (FadeType) {
        FadeType[FadeType["FadeIn"] = 0] = "FadeIn";
        FadeType[FadeType["FadeOut"] = 1] = "FadeOut";
    })(FadeType = Enum.FadeType || (Enum.FadeType = {}));
    /**
     * Enum for the status restrictions kind.
     *
     * @export
     * @enum {number}
     */
    let StatusRestrictionsKind;
    (function (StatusRestrictionsKind) {
        StatusRestrictionsKind[StatusRestrictionsKind["None"] = 0] = "None";
        StatusRestrictionsKind[StatusRestrictionsKind["CantDoAnything"] = 1] = "CantDoAnything";
        StatusRestrictionsKind[StatusRestrictionsKind["CantUseSkills"] = 2] = "CantUseSkills";
        StatusRestrictionsKind[StatusRestrictionsKind["CantUseItems"] = 3] = "CantUseItems";
        StatusRestrictionsKind[StatusRestrictionsKind["CantEscape"] = 4] = "CantEscape";
        StatusRestrictionsKind[StatusRestrictionsKind["AttackRandomTarget"] = 5] = "AttackRandomTarget";
        StatusRestrictionsKind[StatusRestrictionsKind["AttackRandomAlly"] = 6] = "AttackRandomAlly";
        StatusRestrictionsKind[StatusRestrictionsKind["AttackRandomEnemy"] = 7] = "AttackRandomEnemy";
    })(StatusRestrictionsKind = Enum.StatusRestrictionsKind || (Enum.StatusRestrictionsKind = {}));
    /**
     *  Enum for the inventory filter kind.
     *
     *  @export
     *  @enum {number}
     */
    let InventoryFilterKind;
    (function (InventoryFilterKind) {
        InventoryFilterKind[InventoryFilterKind["All"] = 0] = "All";
        InventoryFilterKind[InventoryFilterKind["Consumables"] = 1] = "Consumables";
        InventoryFilterKind[InventoryFilterKind["Custom"] = 2] = "Custom";
        InventoryFilterKind[InventoryFilterKind["Weapons"] = 3] = "Weapons";
        InventoryFilterKind[InventoryFilterKind["Armors"] = 4] = "Armors";
        InventoryFilterKind[InventoryFilterKind["WeaponsAndAmors"] = 5] = "WeaponsAndAmors";
        InventoryFilterKind[InventoryFilterKind["Script"] = 6] = "Script";
    })(InventoryFilterKind = Enum.InventoryFilterKind || (Enum.InventoryFilterKind = {}));
    /**
     *  Enum for the main menu command kind.
     *  @export
     *  @enum {number}
     */
    let MainMenuCommandKind;
    (function (MainMenuCommandKind) {
        MainMenuCommandKind[MainMenuCommandKind["Inventory"] = 0] = "Inventory";
        MainMenuCommandKind[MainMenuCommandKind["Skills"] = 1] = "Skills";
        MainMenuCommandKind[MainMenuCommandKind["Equip"] = 2] = "Equip";
        MainMenuCommandKind[MainMenuCommandKind["States"] = 3] = "States";
        MainMenuCommandKind[MainMenuCommandKind["Order"] = 4] = "Order";
        MainMenuCommandKind[MainMenuCommandKind["Save"] = 5] = "Save";
        MainMenuCommandKind[MainMenuCommandKind["Quit"] = 6] = "Quit";
        MainMenuCommandKind[MainMenuCommandKind["Script"] = 7] = "Script";
    })(MainMenuCommandKind = Enum.MainMenuCommandKind || (Enum.MainMenuCommandKind = {}));
    /**
     *  Enum for the troop reaction frequency kind.
     *  @export
     *  @enum {number}
     */
    let TroopReactionFrequencyKind;
    (function (TroopReactionFrequencyKind) {
        TroopReactionFrequencyKind[TroopReactionFrequencyKind["OneTime"] = 0] = "OneTime";
        TroopReactionFrequencyKind[TroopReactionFrequencyKind["EachTurnBegin"] = 1] = "EachTurnBegin";
        TroopReactionFrequencyKind[TroopReactionFrequencyKind["EachTurnEnd"] = 2] = "EachTurnEnd";
        TroopReactionFrequencyKind[TroopReactionFrequencyKind["Always"] = 3] = "Always";
    })(TroopReactionFrequencyKind = Enum.TroopReactionFrequencyKind || (Enum.TroopReactionFrequencyKind = {}));
    /**
     *  Enum for the change variables other characteristics kind.
     *  @export
     *  @enum {number}
     */
    let ChangeVariablesOtherCharacteristics;
    (function (ChangeVariablesOtherCharacteristics) {
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["CurrentMapID"] = 0] = "CurrentMapID";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["NumberInTeam"] = 1] = "NumberInTeam";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["NumberInHidden"] = 2] = "NumberInHidden";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["NumberInReserve"] = 3] = "NumberInReserve";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["TotalNumberOfSteps"] = 4] = "TotalNumberOfSteps";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["TotalNumberOfSeconds"] = 5] = "TotalNumberOfSeconds";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["TotalNumberOfSavesDone"] = 6] = "TotalNumberOfSavesDone";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["TotalNumberOfBattles"] = 7] = "TotalNumberOfBattles";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["CameraXPosition"] = 8] = "CameraXPosition";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["CameraYPosition"] = 9] = "CameraYPosition";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["CameraZPosition"] = 10] = "CameraZPosition";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["TotalSecondsCurrentMusic"] = 11] = "TotalSecondsCurrentMusic";
        ChangeVariablesOtherCharacteristics[ChangeVariablesOtherCharacteristics["TotalSecondsCurrentBackgroundMusic"] = 12] = "TotalSecondsCurrentBackgroundMusic";
    })(ChangeVariablesOtherCharacteristics = Enum.ChangeVariablesOtherCharacteristics || (Enum.ChangeVariablesOtherCharacteristics = {}));
})(Enum || (Enum = {}));
export { Enum };
