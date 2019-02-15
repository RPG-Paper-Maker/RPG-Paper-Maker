/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef BATTLESYSTEMDATAS_H
#define BATTLESYSTEMDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemstatistic.h"
#include "eventcommand.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS BattleSystemDatas
//
//  Contains all the battle system datas. The data file is located in
//  Content/Datas/battleSystem.json.
//
// -------------------------------------------------------

class BattleSystemDatas : public Serializable
{
public:
    static const QString JSON_FORMULA_IS_DEAD;
    static const QString JSON_BATLLE_MUSIC;
    static const QString JSON_BATLLE_LEVELUP;
    static const QString JSON_BATLLE_VICTORY;
    static const QString jsonWeaponsKind;
    static const QString jsonArmorsKind;
    static const QString jsonBattleMaps;
    static const QString jsonElements;
    static const QString jsonCommonEquipment;
    static const QString jsonCommonStatistics;
    static const QString jsonCommonBattleCommand;

    BattleSystemDatas();
    virtual ~BattleSystemDatas();
    void read(QString path);
    int idStatisticLevel() const;
    int idStatisticExp() const;
    void setIdStatisticLevel(int i);
    void setIdStatisticExp(int i);
    PrimitiveValue * formulaIsDead() const;
    EventCommand * music() const;
    void setMusic(EventCommand* command);
    EventCommand * levelup() const;
    void setLevelup(EventCommand* command);
    EventCommand * victory() const;
    void setVictory(EventCommand* command);
    QStandardItemModel* modelWeaponsKind() const;
    QStandardItemModel* modelArmorsKind() const;
    QStandardItemModel* modelBattleMaps() const;
    QStandardItemModel* modelElements() const;
    QStandardItemModel* modelCommonEquipment() const;
    QStandardItemModel* modelCommonStatistics() const;
    QStandardItemModel* modelCommonBattleCommand() const;
    void getSortedStatistics(QVector<SystemStatistic*>& fixes,
                             QVector<SystemStatistic*>& bars) const;
    void updateEquipments();
    void setDefault();
    void setDefaultOptions();
    void setDefaultWeaponsKind();
    void setDefaultArmorsKind();
    void setDefaultBattleMaps();
    void setDefaultElements();
    void setDefaultCommonEquipment();
    void setDefaultCommonStatistics();
    void setDefaultCommonBattleCommand();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    int m_idStatisticLevel;
    int m_idStatisticExp;
    PrimitiveValue *m_formulaIsDead;
    EventCommand* m_music;
    EventCommand* m_levelup;
    EventCommand* m_victory;
    QStandardItemModel* m_modelWeaponsKind;
    QStandardItemModel* m_modelArmorsKind;
    QStandardItemModel* m_modelBattleMaps;
    QStandardItemModel* m_modelElements;
    QStandardItemModel* m_modelCommonEquipment;
    QStandardItemModel* m_modelCommonStatistics;
    QStandardItemModel* m_modelCommonBattleCommand;
    void updateEquipmentsKind(QStandardItemModel* model);
};

#endif // BATTLESYSTEMDATAS_H
