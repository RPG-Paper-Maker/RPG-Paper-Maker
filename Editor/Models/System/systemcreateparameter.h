/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    virtual void setCopy(const SystemCreateParameter &param);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue* m_defaultValue;
};

Q_DECLARE_METATYPE(SystemCreateParameter)

#endif // SYSTEMCREATEPARAMETER_H
