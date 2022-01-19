/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMPROPERTY_H
#define SYSTEMPROPERTY_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemProperty
//
//  A particulary property of an object (datas).
//
// -------------------------------------------------------

class SystemProperty : public SuperListItem
{
public:
    static const QString JSON_INITIAL_VALUE;

    SystemProperty();
    SystemProperty(int id, QString name, PrimitiveValue *initialValue);
    virtual ~SystemProperty();

    PrimitiveValue * initialValue() const;

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_initialValue;
};

Q_DECLARE_METATYPE(SystemProperty)

#endif // SYSTEMPROPERTY_H
