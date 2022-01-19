/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMLOOT_H
#define SYSTEMLOOT_H

#include <QMetaType>
#include "superlistitem.h"
#include "lootkind.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemLoot
//
//  A particulary loot (datas).
//
// -------------------------------------------------------

class SystemLoot : public SuperListItem
{
public:
    static const QString JSON_KIND;
    static const QString JSON_LOOT_ID;
    static const QString JSON_NUMBER;
    static const QString JSON_PROBABILITY;
    static const QString JSON_INITIAL;
    static const QString JSON_FINAL;

    SystemLoot();
    SystemLoot(int i, QString n, LootKind kind,  PrimitiveValue *lootID,
        PrimitiveValue *number, PrimitiveValue *probability, PrimitiveValue
        *initialLevel, PrimitiveValue *finalLevel);
    virtual ~SystemLoot();
    LootKind kind() const;
    void setKind(LootKind k);
    PrimitiveValue * lootID() const;
    PrimitiveValue * number() const;
    PrimitiveValue * probability() const;
    PrimitiveValue * initialLevel() const;
    PrimitiveValue * finalLevel() const;

    void updateName();

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem *> getModelRow() const;
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    LootKind m_kind;
    PrimitiveValue *m_lootID;
    PrimitiveValue *m_number;
    PrimitiveValue *m_probability;
    PrimitiveValue *m_initialLevel;
    PrimitiveValue *m_finalLevel;
};

Q_DECLARE_METATYPE(SystemLoot)

#endif // SYSTEMLOOT_H
