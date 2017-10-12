/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
    void setDefault();
    CommonEventsDatas* commonEventsDatas() const;
    VariablesDatas* variablesDatas() const;
    SystemDatas* systemDatas() const;
    BattleSystemDatas* battleSystemDatas() const;
    ItemsDatas* itemsDatas() const;
    SkillsDatas* skillsDatas() const;
    WeaponsDatas* weaponsDatas() const;
    ArmorsDatas* armorsDatas() const;
    HeroesDatas* heroesDatas() const;
    TroopsDatas* troopsDatas() const;
    MonstersDatas* monstersDatas() const;
    ClassesDatas* classesDatas() const;
    TilesetsDatas* tilesetsDatas() const;
    void read(QString path);
    void readVariablesSwitches(QString path);
    void readTilesets(QString path);
    void readSystem(QString path);
    void write(QString path);
    void writeTilesets(QString path);
    void writeSystem(QString path);

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
};

#endif // GAMEDATAS_H
