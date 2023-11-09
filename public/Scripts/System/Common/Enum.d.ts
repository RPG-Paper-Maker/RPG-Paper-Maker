declare namespace Enum {
    /**
     *   Enum for the different command moves kind.
     *   @enum {number}
     *   @readonly
     */
    enum CommandMoveKind {
        MoveNorth = 0,
        MoveSouth = 1,
        MoveWest = 2,
        MoveEast = 3,
        MoveNorthWest = 4,
        MoveNorthEast = 5,
        MoveSouthWest = 6,
        MoveSouthEast = 7,
        MoveRandom = 8,
        MoveHero = 9,
        MoveOppositeHero = 10,
        MoveFront = 11,
        MoveBack = 12,
        ChangeGraphics = 13,
        Jump = 14,
        TurnNorth = 15,
        TurnSouth = 16,
        TurnWest = 17,
        TurnEast = 18,
        Turn90Right = 19,
        Turn90Left = 20,
        LookAtHero = 21,
        LookAtHeroOpposite = 22,
        ChangeSpeed = 23,
        ChangeFrequency = 24,
        MoveAnimation = 25,
        StopAnimation = 26,
        ClimbAnimation = 27,
        FixDirection = 28,
        Through = 29,
        SetWithCamera = 30,
        PixelOffset = 31,
        KeepPosition = 32,
        Wait = 33,
        PlaySound = 34,
        Script = 35
    }
    /**
     *   Enum for the different event commands kind.
     *   @enum {number}
     *   @readonly
     */
    enum EventCommandKind {
        None = 0,
        ShowText = 1,
        ChangeVariables = 2,
        GameOver = 3,
        While = 4,
        EndWhile = 5,
        WhileBreak = 6,
        InputNumber = 7,
        If = 8,
        Else = 9,
        EndIf = 10,
        OpenMainMenu = 11,
        OpenSavesMenu = 12,
        ModifyInventory = 13,
        ModifyTeam = 14,
        StartBattle = 15,
        IfWin = 16,
        IfLose = 17,
        ChangeState = 18,
        SendEvent = 19,
        TeleportObject = 20,
        MoveObject = 21,
        Wait = 22,
        MoveCamera = 23,
        PlayMusic = 24,
        StopMusic = 25,
        PlayBackgroundSound = 26,
        StopBackgroundSound = 27,
        PlaySound = 28,
        PlayMusicEffect = 29,
        ChangeProperty = 30,
        DisplayChoice = 31,
        Choice = 32,
        EndChoice = 33,
        Script = 34,
        DisplayAPicture = 35,
        SetMoveTurnAPicture = 36,
        RemoveAPicture = 37,
        SetDialogBoxOptions = 38,
        TitleScreen = 39,
        ChangeScreenTone = 40,
        RemoveObjectFromMap = 41,
        StopReaction = 42,
        AllowForbidSaves = 43,
        AllowForbidMainMenu = 44,
        CallACommonReaction = 45,
        Label = 46,
        JumpLabel = 47,
        Comment = 48,
        ChangeAStatistic = 49,
        ChangeASkill = 50,
        ChangeName = 51,
        ChangeEquipment = 52,
        ModifyCurrency = 53,
        DisplayAnAnimation = 54,
        ShakeScreen = 55,
        FlashScreen = 56,
        Plugin = 57,
        StartShopMenu = 58,
        RestockShop = 59,
        EnterANameMenu = 60,
        CreateObjectInMap = 61,
        ChangeStatus = 62,
        ResetCamera = 63,
        ChangeBattleMusic = 64,
        ChangeVictoryMusic = 65,
        EndBattle = 66,
        ForceAnAction = 67,
        ChangeMapProperties = 68,
        ChangeExperienceCurve = 69,
        ChangeClass = 70,
        ChangeChronometer = 71,
        ChangeWeather = 72,
        PlayAVideo = 73,
        SwitchTexture = 74,
        StopASound = 75,
        DisplayHideABattler = 76,
        TransformABattler = 77,
        ChangeBattlerGraphics = 78
    }
    /**
     *   Enum for the different items kind.
     *   @enum {number}
     *   @readonly
     */
    enum ItemKind {
        Item = 0,
        Weapon = 1,
        Armor = 2
    }
    /**
     *   Enum for the different players kind.
     *   @enum {number}
     *   @readonly
     */
    enum CharacterKind {
        Hero = 0,
        Monster = 1
    }
    /**
     *   Enum for the different groups kind.
     *   @enum {number}
     *   @readonly
     */
    enum GroupKind {
        Team = 0,
        Reserve = 1,
        Hidden = 2,
        Troop = 3
    }
    /**
     *   Enum for the different horizontal aligns kind.
     *   @enum {string}
     *   @readonly
     */
    enum Align {
        None = " none",
        Left = "left",
        Right = "right",
        Center = "center"
    }
    /**
     *   Enum for the different vertical aligns kind.
     *   @enum {string}
     *   @readonly
     */
    enum AlignVertical {
        Bot = 0,
        Top = 1,
        Center = 2
    }
    /**
     *   Enum for the different orientations kind.
     *   @enum {string}
     *   @readonly
     */
    enum Orientation {
        South = 0,
        West = 1,
        North = 2,
        East = 3,
        SouthWest = 4,
        SouthEast = 5,
        NorthWest = 6,
        NorthEast = 7,
        Up = 8,
        Down = 9,
        None = 10
    }
    /**
     *   Enum for the different map elements kind.
     *   @enum {number}
     *   @readonly
     */
    enum ElementMapKind {
        None = 0,
        Floors = 1,
        Autotiles = 2,
        Water = 3,
        SpritesFace = 4,
        SpritesFix = 5,
        SpritesDouble = 6,
        SpritesQuadra = 7,
        SpritesWall = 8,
        Object = 9,
        Object3D = 10,
        Mountains = 11
    }
    /**
     *   Enum for the different sprite walls kind.
     *   @enum {number}
     *   @readonly
     */
    enum SpriteWallKind {
        Left = 0,
        Middle = 1,
        Right = 2,
        LeftRight = 3
    }
    /**
     *   Enum for the different pictures kind.
     *   @enum {number}
     *   @readonly
     */
    enum PictureKind {
        None = 0,
        Bars = 1,
        Icons = 2,
        Autotiles = 3,
        Characters = 4,
        Mountains = 5,
        Tilesets = 6,
        Walls = 7,
        Battlers = 8,
        Facesets = 9,
        WindowSkins = 10,
        TitleScreen = 11,
        Objects3D = 12,
        Pictures = 13,
        Animations = 14,
        Skyboxes = 15,
        Particles = 16,
        GameOver = 17
    }
    /**
     *   Enum for the different songs kind.
     *   @enum {number}
     *   @readonly
     */
    enum SongKind {
        None = 0,
        Music = 1,
        BackgroundSound = 2,
        Sound = 3,
        MusicEffect = 4
    }
    /** Enum for the different primitive values kind.
     *   @enum {number}
     *   @readonly
     */
    enum DynamicValueKind {
        Unknown = -1,
        None = 0,
        Anything = 1,
        Default = 2,
        Number = 3,
        Variable = 4,
        Parameter = 5,
        Property = 6,
        DataBase = 7,
        Message = 8,
        Script = 9,
        Switch = 10,
        KeyBoard = 11,
        NumberDouble = 12,
        Font = 13,
        Class = 14,
        Hero = 15,
        Monster = 16,
        Troop = 17,
        Item = 18,
        Weapon = 19,
        Armor = 20,
        Skill = 21,
        Animation = 22,
        Status = 23,
        Tileset = 24,
        FontSize = 25,
        FontName = 26,
        Color = 27,
        WindowSkin = 28,
        Currency = 29,
        Speed = 30,
        Detection = 31,
        CameraProperty = 32,
        Frequency = 33,
        Skybox = 34,
        BattleMap = 35,
        Element = 36,
        CommonStatistic = 37,
        WeaponsKind = 38,
        ArmorsKind = 39,
        CommonBattleCommand = 40,
        CommonEquipment = 41,
        Event = 42,
        State = 43,
        CommonReaction = 44,
        Model = 45,
        CustomStructure = 46,
        CustomList = 47,
        Vector2 = 48,
        Vector3 = 49,
        Bars = 50,
        Icons = 51,
        Autotiles = 52,
        Characters = 53,
        Mountains = 54,
        Tilesets = 55,
        Walls = 56,
        Battlers = 57,
        Facesets = 58,
        WindowSkins = 59,
        TitleScreen = 60,
        Object3D = 61,
        Pictures = 62,
        Animations = 63,
        SkyBoxes = 64,
        Enum = 65,
        Music = 66,
        BackgroundSound = 67,
        Sound = 68,
        MusicEffect = 69
    }
    /**
     *   Enum for the different window orientations.
     *   @enum {number}
     *   @readonly
     */
    enum OrientationWindow {
        Vertical = 0,
        Horizontal = 1
    }
    /**
     *   Enum for the different battler steps.
     *   @enum {number}
     *   @readonly
     */
    enum BattlerStep {
        Normal = 0,
        Attack = 1,
        Skill = 2,
        Item = 3,
        Escape = 4,
        Defense = 5,
        Attacked = 6,
        Victory = 7,
        Dead = 8
    }
    /**
     *   Enum for the different loots kind.
     *   @enum {number}
     *   @readonly
     */
    enum LootKind {
        Item = 0,
        Weapon = 1,
        Armor = 2
    }
    /**
     *   Enum for the different damages kind.
     *   @enum {number}
     *   @readonly
     */
    enum DamagesKind {
        Stat = 0,
        Currency = 1,
        Variable = 2
    }
    /**
     *   Enum for the different effect kind.
     *   @enum {number}
     *   @readonly
     */
    enum EffectKind {
        Damages = 0,
        Status = 1,
        AddRemoveSkill = 2,
        PerformSkill = 3,
        CommonReaction = 4,
        SpecialActions = 5,
        Script = 6
    }
    /**
     *   Enum for the different effect special action kind.
     *   @enum {number}
     *   @readonly
     */
    enum EffectSpecialActionKind {
        None = -1,
        ApplyWeapons = 0,
        OpenSkills = 1,
        OpenItems = 2,
        Escape = 3,
        EndTurn = 4,
        DoNothing = 5
    }
    /**
     *   Enum for the different characteristic kind.
     *   @enum {number}
     *   @readonly
     */
    enum CharacteristicKind {
        IncreaseDecrease = 0,
        Script = 1,
        AllowForbidEquip = 2,
        AllowForbidChange = 3,
        BeginEquipment = 4,
        Element = 5
    }
    /**
     *   Enum for the different increase / decrease kind.
     *   @enum {number}
     *   @readonly
     */
    enum IncreaseDecreaseKind {
        StatValue = 0,
        ElementRes = 1,
        StatusRes = 2,
        ExperienceGain = 3,
        CurrencyGain = 4,
        SkillCost = 5,
        Variable = 6
    }
    /**
     *   Enum for the different target kind.
     *   @enum {number}
     *   @readonly
     */
    enum TargetKind {
        None = 0,
        User = 1,
        Enemy = 2,
        Ally = 3,
        AllEnemies = 4,
        AllAllies = 5
    }
    /**
     *   Enum for the different available kind.
     *   @enum {number}
     *   @readonly
     */
    enum AvailableKind {
        Battle = 0,
        MainMenu = 1,
        Always = 2,
        Never = 3
    }
    /**
     *   Enum for the different shape kind.
     *   @enum {number}
     *   @readonly
     */
    enum ShapeKind {
        Box = 0,
        Sphere = 1,
        Cylinder = 2,
        Cone = 3,
        Capsule = 4,
        Custom = 5
    }
    /**
     *   Enum for the different custom shape kind.
     *   @enum {number}
     *   @readonly
     */
    enum CustomShapeKind {
        None = 0,
        OBJ = 1,
        MTL = 2,
        Collisions = 3
    }
    /**
     *   Enum for the different object collision kind.
     *   @enum {number}
     *   @readonly
     */
    enum ObjectCollisionKind {
        None = 0,
        Perfect = 1,
        Simplified = 2,
        Custom = 3
    }
    /**
     *   Enum for the map transitions.
     *   @enum {number}
     *   @readonly
     */
    enum MapTransitionKind {
        None = 0,
        Fade = 1,
        Zoom = 2
    }
    /**
     *   Enum for the map transitions.
     *   @enum {number}
     *   @readonly
     */
    enum MountainCollisionKind {
        Default = 0,
        Always = 1,
        Never = 2
    }
    /**
     *   Enum for the title screen commands.
     *   @enum {number}
     *   @readonly
     */
    enum TitleCommandKind {
        NewGame = 0,
        LoadGame = 1,
        Settings = 2,
        Exit = 3,
        Script = 4
    }
    /**
     *   Enum for the game over commands.
     *   @enum {number}
     *   @readonly
     */
    enum GameOverCommandKind {
        Continue = 0,
        TitleScreen = 1,
        Exit = 2,
        Script = 3
    }
    /**
     *   Enum for the title settings.
     *   @enum {number}
     *   @readonly
     */
    enum TitleSettingKind {
        KeyboardAssigment = 0,
        Language = 1
    }
    /**
     *   Enum for the object moving.
     *   @enum {number}
     *   @readonly
     */
    enum ObjectMovingKind {
        Fix = 0,
        Random = 1,
        Route = 2
    }
    /**
     *   Enum for the tags.
     *   @enum {number}
     *   @readonly
     */
    enum TagKind {
        NewLine = 0,
        Text = 1,
        Bold = 2,
        Italic = 3,
        Left = 4,
        Center = 5,
        Right = 6,
        Size = 7,
        Font = 8,
        TextColor = 9,
        BackColor = 10,
        StrokeColor = 11,
        Variable = 12,
        Parameter = 13,
        Property = 14,
        HeroName = 15,
        Icon = 16
    }
    /**
     *   Enum for the condition heroes.
     *   @enum {number}
     *   @readonly
     */
    enum ConditionHeroesKind {
        AllTheHeroes = 0,
        NoneOfTheHeroes = 1,
        AtLeastOneHero = 2,
        TheHeroeWithInstanceID = 3
    }
    /**
     *   Enum for the variables map object characteristics.
     *   @enum {number}
     *   @readonly
     */
    enum VariableMapObjectCharacteristicKind {
        XSquarePosition = 0,
        YSquarePosition = 1,
        ZSquarePosition = 2,
        XPixelPosition = 3,
        YPixelPosition = 4,
        ZPixelPosition = 5,
        Orientation = 6,
        Terrain = 7
    }
    /**
     *   Enum for the animation position kind.
     *   @enum {number}
     *   @readonly
     */
    enum AnimationPositionKind {
        Top = 0,
        Middle = 1,
        Bottom = 2,
        ScreenCenter = 3
    }
    /**
     *   Enum for the animation effect condition kind.
     *   @enum {number}
     *   @readonly
     */
    enum AnimationEffectConditionKind {
        None = 0,
        Hit = 1,
        Miss = 2,
        Critical = 3
    }
    /**
     *   Enum for the monster action kind.
     *   @enum {number}
     *   @readonly
     */
    enum MonsterActionKind {
        UseSkill = 0,
        UseItem = 1,
        DoNothing = 2
    }
    /**
     *   Enum for the monster action target kind.
     *   @enum {number}
     *   @readonly
     */
    enum MonsterActionTargetKind {
        Random = 0,
        WeakEnemies = 1
    }
    /**
     *   Enum for the operation kind.
     *   @enum {number}
     *   @readonly
     */
    enum OperationKind {
        EqualTo = 0,
        NotEqualTo = 1,
        GreaterThanOrEqualTo = 2,
        LesserThanOrEqualTo = 3,
        GreaterThan = 4,
        LesserThan = 5
    }
    /**
     *   Enum for the battle step.
     *   @enum {number}
     *   @readonly
     */
    enum BattleStep {
        Initialize = 0,
        StartTurn = 1,
        Selection = 2,
        Animation = 3,
        EnemyAttack = 4,
        EndTurn = 5,
        Victory = 6
    }
    /**
     * Enum for the screen transition.
     *
     * @export
     * @enum {number}
     */
    enum FadeType {
        FadeIn = 0,
        FadeOut = 1
    }
    /**
     * Enum for the status restrictions kind.
     *
     * @export
     * @enum {number}
     */
    enum StatusRestrictionsKind {
        None = 0,
        CantDoAnything = 1,
        CantUseSkills = 2,
        CantUseItems = 3,
        CantEscape = 4,
        AttackRandomTarget = 5,
        AttackRandomAlly = 6,
        AttackRandomEnemy = 7
    }
    /**
     *  Enum for the inventory filter kind.
     *
     *  @export
     *  @enum {number}
     */
    enum InventoryFilterKind {
        All = 0,
        Consumables = 1,
        Custom = 2,
        Weapons = 3,
        Armors = 4,
        WeaponsAndAmors = 5,
        Script = 6
    }
    /**
     *  Enum for the main menu command kind.
     *  @export
     *  @enum {number}
     */
    enum MainMenuCommandKind {
        Inventory = 0,
        Skills = 1,
        Equip = 2,
        States = 3,
        Order = 4,
        Save = 5,
        Quit = 6,
        Script = 7
    }
    /**
     *  Enum for the troop reaction frequency kind.
     *  @export
     *  @enum {number}
     */
    enum TroopReactionFrequencyKind {
        OneTime = 0,
        EachTurnBegin = 1,
        EachTurnEnd = 2,
        Always = 3
    }
    /**
     *  Enum for the change variables other characteristics kind.
     *  @export
     *  @enum {number}
     */
    enum ChangeVariablesOtherCharacteristics {
        CurrentMapID = 0,
        NumberInTeam = 1,
        NumberInHidden = 2,
        NumberInReserve = 3,
        TotalNumberOfSteps = 4,
        TotalNumberOfSeconds = 5,
        TotalNumberOfSavesDone = 6,
        TotalNumberOfBattles = 7,
        CameraXPosition = 8,
        CameraYPosition = 9,
        CameraZPosition = 10,
        TotalSecondsCurrentMusic = 11,
        TotalSecondsCurrentBackgroundMusic = 12
    }
}
export { Enum };
