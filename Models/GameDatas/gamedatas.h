/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef GAMEDATAS_H
#define GAMEDATAS_H

#include "commoneventsdatas.h"
#include "variablesdatas.h"
#include "systemdatas.h"
#include "battlesystemdatas.h"
#include "itemsdatas.h"
#include "skillsdatas.h"
#include "weaponsdatas.h"
#include "armorsdatas.h"
#include "heroesdatas.h"
#include "monstersdatas.h"
#include "troopsdatas.h"
#include "classesdatas.h"
#include "tilesetsdatas.h"
#include "animationsdatas.h"
#include "statusdatas.h"
#include "titlescreengameoverdatas.h"

// -------------------------------------------------------
//
//  CLASS GameDatas
//
//  Contains all the informations written in the datas manager.
//  All these datas are located on Content/Datas/*.json.
//
// -------------------------------------------------------

class GameDatas
{
public:
    GameDatas();
    virtual ~GameDatas();
    CommonEventsDatas * commonEventsDatas() const;
    VariablesDatas * variablesDatas() const;
    SystemDatas * systemDatas() const;
    BattleSystemDatas * battleSystemDatas() const;
    ItemsDatas * itemsDatas() const;
    SkillsDatas * skillsDatas() const;
    WeaponsDatas * weaponsDatas() const;
    ArmorsDatas * armorsDatas() const;
    HeroesDatas * heroesDatas() const;
    TroopsDatas * troopsDatas() const;
    MonstersDatas * monstersDatas() const;
    ClassesDatas * classesDatas() const;
    TilesetsDatas * tilesetsDatas() const;
    AnimationsDatas * animationsDatas() const;
    StatusDatas * statusDatas() const;
    TitleScreenGameOverDatas * titleScreenGameOverDatas() const;
    bool isDatasRead() const;

    void setDefault();
    void setDefaultItemsCharacters();
    void read(QString path);
    void readVariablesSwitches(QString path);
    void readTilesets(QString path);
    void readSystem(QString path);
    void readBattleSystem(QString path);
    void readItems(QString path);
    void readSkills(QString path);
    void readWeapons(QString path);
    void readArmors(QString path);
    void readHeroes(QString path);
    void readMonsters(QString path);
    void readTroops(QString path);
    void readClasses(QString path);
    void readAnimations(QString path);
    void readStatus(QString path);
    void readTitleScreenGameOver(QString path);
    void readCommonEvents(QString path);
    void write(QString path);
    void writeTilesets(QString path);
    void writeSystem(QString path);
    void writeBattleSystem(QString path);
    void writeItems(QString path);
    void writeSkills(QString path);
    void writeWeapons(QString path);
    void writeArmors(QString path);
    void writeHeroes(QString path);
    void writeMonsters(QString path);
    void writeTroops(QString path);
    void writeClasses(QString path);
    void writeAnimations(QString path);
    void writeStatus(QString path);
    void writeTitleScreenGameOver(QString path);
    void writeCommonEvents(QString path);

private:
    CommonEventsDatas* m_commonEventsDatas;
    VariablesDatas* m_variablesDatas;
    SystemDatas* m_systemDatas;
    BattleSystemDatas* m_battleSystemDatas;
    ItemsDatas* m_itemsDatas;
    SkillsDatas* m_skillsDatas;
    WeaponsDatas* m_weaponsDatas;
    ArmorsDatas* m_armorsDatas;
    HeroesDatas* m_heroesDatas;
    MonstersDatas* m_monstersDatas;
    TroopsDatas* m_troopsDatas;
    ClassesDatas* m_classesDatas;
    TilesetsDatas* m_tilesetsDatas;
    AnimationsDatas* m_animationsDatas;
    StatusDatas* m_statusDatas;
    TitleScreenGameOverDatas *m_titleScreenGameOverDatas;
    bool m_isDatasRead;
};

#endif // GAMEDATAS_H
