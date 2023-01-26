/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMPLUGINCOMMAND_H
#define SYSTEMPLUGINCOMMAND_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemPlugin
//
//  A particulary plugin command (datas).
//
// -------------------------------------------------------

class SystemPluginCommand : public SuperListItem
{
public:
    static const QString JSON_DESCRIPTION;
    static const QString JSON_DEFAULT_PARAMETERS;
    static const QString DEFAULT_DESCRIPTION;

    SystemPluginCommand();
    SystemPluginCommand(int i, QString n, QString d = DEFAULT_DESCRIPTION,
        QStandardItemModel *dp = new QStandardItemModel);
    virtual ~SystemPluginCommand();
    QString description() const;
    QStandardItemModel * defaultParameters() const;
    void setDescription(QString description);

    QString getStringDetails() const;
    QString getStringFunction() const;
    void initializeHeaders();
    void clearDefaultParameters();

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QString m_description;
    QStandardItemModel *m_defaultParameters;
};

Q_DECLARE_METATYPE(SystemPluginCommand)

#endif // SYSTEMPLUGINCOMMAND_H
