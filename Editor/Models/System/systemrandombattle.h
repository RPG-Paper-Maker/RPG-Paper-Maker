/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMRANDOMBATTLE_H
#define SYSTEMRANDOMBATTLE_H

#include "superlistitem.h"
#include "primitivevalue.h"
#include "mapproperties.h"

// -------------------------------------------------------
//
//  CLASS SystemRandomBattle
//
//  A particulary random battle (datas).
//
// -------------------------------------------------------

class SystemRandomBattle : public SuperListItem
{
public:
    static const QString JSON_TROOP_ID;
    static const QString JSON_PRIORITY;
    static const QString JSON_IS_ENTIRE_MAP;
    static const QString JSON_TERRAINS;
    static const int DEFAULT_PRIORITY;
    static const bool DEFAULT_IS_ENTIRE_MAP;

    SystemRandomBattle();
    SystemRandomBattle(int i, QString name, PrimitiveValue *troopID =
        PrimitiveValue::createDefaultDataBaseValue(), PrimitiveValue *priority =
        new PrimitiveValue(DEFAULT_PRIORITY), bool isEntireMap =
        DEFAULT_IS_ENTIRE_MAP, QStandardItemModel *terrains = new
        QStandardItemModel);
    virtual ~SystemRandomBattle();
    PrimitiveValue * troopID() const;
    PrimitiveValue * priority() const;
    bool isEntireMap() const;
    void setIsEntireMap(bool isEntireMap);
    QStandardItemModel * terrains() const;
    MapProperties * mapProperties() const;
    void setMapProperties(MapProperties *mapProperties);
    bool editing() const;

    double calculateProbability(int p = -1) const;
    QString probabilityToString(int p = -1) const;
    QString terrainToString() const;

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_troopID;
    PrimitiveValue *m_priority;
    bool m_isEntireMap;
    QStandardItemModel *m_terrains;
    MapProperties *m_mapProperties;
    bool m_editing;
};

Q_DECLARE_METATYPE(SystemRandomBattle)

#endif // SYSTEMRANDOMBATTLE_H
