/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSPEEDFREQUENCY_H
#define SYSTEMSPEEDFREQUENCY_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemSpeedFrequency
//
//  A particulary speed frequency (datas).
//
// -------------------------------------------------------

class SystemSpeedFrequency : public SuperListItem
{
public:
    static const QString JSON_VALUE;

    SystemSpeedFrequency();
    SystemSpeedFrequency(int i, QString n, PrimitiveValue *v);
    virtual ~SystemSpeedFrequency();

    PrimitiveValue * value() const;

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_value;
};

Q_DECLARE_METATYPE(SystemSpeedFrequency)

#endif // SYSTEMSPEEDFREQUENCY_H
