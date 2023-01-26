/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static const QString JSON_HEROES_BATTLERS_CENTER_OFFSET;
    static const QString JSON_HEROES_BATTLERS_OFFSET;
    static const QString JSON_TROOPS_BATTLERS_CENTER_OFFSET;
    static const QString JSON_TROOPS_BATTLERS_OFFSET;
    static const QString JSON_CAMERA_MOVE_IN_BATTLE;
    static const QString DEFAULT_HEROES_BATTLERS_CENTER_OFFSET;
    static const QString DEFAULT_HEROES_BATTLERS_OFFSET;
    static const QString DEFAULT_TROOPS_BATTLERS_CENTER_OFFSET;
    static const QString DEFAULT_TROOPS_BATTLERS_OFFSET;
    static const bool DEFAULT_CAMERA_MOVE_IN_BATTLE;

    BattleSystemDatas();
    virtual ~BattleSystemDatas();
    void read(QString path);
    int idStatisticLevel() const;
    int idStatisticExp() const;
    void setIdStatisticLevel(int i);
    void setIdStatisticExp(int i);
    PrimitiveValue * formulaIsDead() const;
    PrimitiveValue * formulaCrit() const;
    PrimitiveValue * heroesBattlersCenterOffset() const;
    PrimitiveValue * heroesBattlersOffset() const;
    PrimitiveValue * troopsBattlersCenterOffset() const;
    PrimitiveValue * troopsBattlersOffset() const;
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
    bool cameraMoveInBattle() const;
    void setCameraMoveInBattle(bool b);

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
    void setDefaultTranslations();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    int m_idStatisticLevel;
    int m_idStatisticExp;
    PrimitiveValue *m_formulaIsDead;
    PrimitiveValue *m_formulaCrit;
    PrimitiveValue *m_heroesBattlersCenterOffset;
    PrimitiveValue *m_heroesBattlersOffset;
    PrimitiveValue *m_troopsBattlersCenterOffset;
    PrimitiveValue *m_troopsBattlersOffset;
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
    bool m_cameraMoveInBattle;

    void updateEquipmentsKind(QStandardItemModel *model);
};

#endif // BATTLESYSTEMDATAS_H
