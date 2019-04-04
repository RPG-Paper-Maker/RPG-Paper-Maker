/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    virtual void setCopy(const SystemLoot &loot);
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
