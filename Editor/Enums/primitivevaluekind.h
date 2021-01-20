/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PRIMITIVEVALUEKIND_H
#define PRIMITIVEVALUEKIND_H

// -------------------------------------------------------
//
//  ENUM PrimitiveValueKind
//
//  All the possible types of primitives values.
//
// -------------------------------------------------------

enum class PrimitiveValueKind {
    None,
    Anything,
    Default,
    Number,
    Variable,
    Parameter,
    Property,
    DataBase,
    Message,
    Script,
    Switch,
    KeyBoard,
    NumberDouble,
    Font,
    Class,
    Hero,
    Monster,
    Troop,
    Item,
    Weapon,
    Armor,
    Skill,
    Animation,
    Status,
    Tileset,
    FontSize,
    FontName,
    Color,
    WindowSkin,
    Currency,
    Speed,
    Detection,
    CameraProperty,
    Frequency,
    Skybox,
    BattleMap,
    Element,
    CommonStatistic,
    WeaponsKind,
    ArmorsKind,
    CommonBattleCommand,
    CommonEquipment,
    Event,
    State,
    CommonReaction,
    Model,
    CustomStructure,
    CustomList
};

#endif // PRIMITIVEVALUEKIND_H
