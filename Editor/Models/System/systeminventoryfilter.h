/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMINVENTORYFILTER_H
#define SYSTEMINVENTORYFILTER_H

#include "systemlang.h"
#include "inventoryfilterkind.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemInventoryFilter
//
//  A particulary inventory filter (datas).
//
// -------------------------------------------------------

class SystemInventoryFilter : public SystemLang
{
public:
    static const QString JSON_KIND;
    static const QString JSON_ITEM_TYPE_ID;
    static const QString JSON_SCRIPT;
    static const InventoryFilterKind DEFAULT_KIND;
    static const QString DEFAULT_SCRIPT;

    SystemInventoryFilter();
    SystemInventoryFilter(int i, QString name, InventoryFilterKind kind =
        DEFAULT_KIND, PrimitiveValue *itemTypeID = new PrimitiveValue(
        PrimitiveValueKind::DataBase, 1), QString script = DEFAULT_SCRIPT);
    virtual ~SystemInventoryFilter();
    InventoryFilterKind kind() const;
    void setKind(InventoryFilterKind kind);
    PrimitiveValue * itemTypeID() const;
    QString script() const;
    void setScript(QString script);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    InventoryFilterKind m_kind;
    PrimitiveValue *m_itemTypeID;
    QString m_script;
};

#endif // SYSTEMINVENTORYFILTER_H
