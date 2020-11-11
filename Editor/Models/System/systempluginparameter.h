/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMPLUGINPARAMETER_H
#define SYSTEMPLUGINPARAMETER_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemPluginParameter
//
//  A particulary plugin parameter.
//
// -------------------------------------------------------

class SystemPluginParameter : public SuperListItem
{
public:
    static const QString JSON_NAME;
    static const QString JSON_HELP;
    static const QString JSON_DEFAULT_VALUE;
    static const QString JSON_VALUE;
    static const QString DEFAULT_NAME;
    static const QString DEFAULT_HELP;
    static const QString DEFAULT_DEFAULT_VALUE;
    static const QString DEFAULT_VALUE;

    SystemPluginParameter();
    virtual ~SystemPluginParameter();

    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QString m_name;
    QString m_help;
    QString m_defaultValue;
    QString m_value;
};

#endif // SYSTEMPLUGINPARAMETER_H
