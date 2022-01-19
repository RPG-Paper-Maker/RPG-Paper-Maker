/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCREATEPARAMETER_H
#define SYSTEMCREATEPARAMETER_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemCreateParameter
//
//  A particulary create parameter (system).
//
// -------------------------------------------------------

class SystemCreateParameter : public SuperListItem
{
public:
    SystemCreateParameter();
    SystemCreateParameter(int i, QString n, PrimitiveValue* defaultValue);
    virtual ~SystemCreateParameter();
    PrimitiveValue* defaultValue() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue* m_defaultValue;
};

Q_DECLARE_METATYPE(SystemCreateParameter)

#endif // SYSTEMCREATEPARAMETER_H
