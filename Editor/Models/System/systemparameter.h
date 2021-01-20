/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMPARAMETER_H
#define SYSTEMPARAMETER_H

#include <QMetaType>
#include "systemcreateparameter.h"

// -------------------------------------------------------
//
//  CLASS SystemParameter
//
//  A particulary parameter (system).
//
// -------------------------------------------------------

class SystemParameter : public SuperListItem
{
public:
    SystemParameter();
    SystemParameter(int i, QString n, SystemCreateParameter* parameter,
                    PrimitiveValue* value);
    virtual ~SystemParameter();
    SystemCreateParameter* parameter() const;
    PrimitiveValue* value() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SystemCreateParameter* m_parameter;
    PrimitiveValue* m_value;
};

Q_DECLARE_METATYPE(SystemParameter)

#endif // SYSTEMPARAMETER_H
