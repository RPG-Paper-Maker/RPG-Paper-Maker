/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef BATTLESYSTEMDATAS_H
#define BATTLESYSTEMDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemstatistic.h"
#include "systemplaysong.h"
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
    static const QString JSON_FORMULA_CRIT;
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
    PrimitiveValue * formulaCrit() const;
    SystemPlaySong * music() const;
    void setMusic(SystemPlaySong *song);
    SystemPlaySong * levelup() const;
    void setLevelup(SystemPlaySong *song);
    SystemPlaySong * victory() const;
    void setVictory(SystemPlaySong *song);
    QStandardItemModel * modelWeaponsKind() const;
    QStandardItemModel * modelArmorsKind() const;
    QStandardItemModel * modelBattleMaps() const;
    QStandardItemModel * modelElements() const;
    QStandardItemModel * modelCommonEquipment() const;
    QStandardItemModel * modelCommonStatistics() const;
    QStandardItemModel * modelCommonBattleCommand() const;
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
    PrimitiveValue *m_formulaCrit;
    SystemPlaySong *m_music;
    SystemPlaySong *m_levelup;
    SystemPlaySong *m_victory;
    QStandardItemModel *m_modelWeaponsKind;
    QStandardItemModel *m_modelArmorsKind;
    QStandardItemModel *m_modelBattleMaps;
    QStandardItemModel *m_modelElements;
    QStandardItemModel *m_modelCommonEquipment;
    QStandardItemModel *m_modelCommonStatistics;
    QStandardItemModel *m_modelCommonBattleCommand;
    void updateEquipmentsKind(QStandardItemModel *model);
};

#endif // BATTLESYSTEMDATAS_H
