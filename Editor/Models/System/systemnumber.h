/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMNUMBER_H
#define SYSTEMNUMBER_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

class SystemNumber : public SuperListItem
{
public:
    static const QString JSON_VALUE;

    SystemNumber(PrimitiveValue *value = new PrimitiveValue(PrimitiveValueKind
        ::Number, 0));
    virtual ~SystemNumber();
    PrimitiveValue * value() const;

protected:
    PrimitiveValue *m_value;

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemNumber)

#endif // SYSTEMNUMBER_H
