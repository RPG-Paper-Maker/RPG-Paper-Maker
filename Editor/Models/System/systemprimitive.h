/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMPRIMITIVE_H
#define SYSTEMPRIMITIVE_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"
#include "systemprimitivekind.h"

// -------------------------------------------------------
//
//  CLASS SystemPrimitive
//
//  A particulary primitive (datas).
//
// -------------------------------------------------------

class SystemPrimitive : public SuperListItem
{
public:
    static const QString JSON_PRIM;
    static const QString JSON_KIND;

    SystemPrimitive();
    SystemPrimitive(int i, QString n, PrimitiveValue *s, SystemPrimitiveKind k);
    virtual ~SystemPrimitive();

    PrimitiveValue * prim() const;
    void setKind(SystemPrimitiveKind k);

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_prim;
    SystemPrimitiveKind m_kind;
};

Q_DECLARE_METATYPE(SystemPrimitive)

#endif // SYSTEMPRIMITIVE_H
