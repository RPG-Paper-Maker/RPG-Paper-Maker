/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
#include "primitivevalue.h"

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
    static const QString JSON_DESCRIPTION;
    static const QString JSON_DEFAULT_VALUE;
    static const QString DEFAULT_DESCRIPTION;

    SystemPluginParameter();
    SystemPluginParameter(int i, QString n, bool id = true, QString d =
        DEFAULT_DESCRIPTION, PrimitiveValue *dv = PrimitiveValue
        ::createDefaultNumberDoubleValue());
    virtual ~SystemPluginParameter();
    QString description() const;
    PrimitiveValue * defaultValue() const;
    bool isDefault() const;
    void setDescription(QString description);
    void setIsDefault(bool isDefault);

    static void setAllDefault(QStandardItemModel *model, bool def);

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QString m_description;
    PrimitiveValue *m_defaultValue;
    bool m_isDefault;
};

Q_DECLARE_METATYPE(SystemPluginParameter)

#endif // SYSTEMPLUGINPARAMETER_H
