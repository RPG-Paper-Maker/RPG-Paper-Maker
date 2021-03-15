/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMTRANSLATABLE_H
#define SYSTEMTRANSLATABLE_H

#include <QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"
#include "eventcommand.h"

// -------------------------------------------------------
//
//  CLASS SystemTranslatable
//
//  A particulary lang (lang).
//
// -------------------------------------------------------

class SystemTranslatable : public SuperListItem
{
public:
    static const QString JSON_NAMES;

    SystemTranslatable();
    SystemTranslatable(int i, QString name);
    SystemTranslatable(int i, QVector<int> ids, QVector<QString> names);
    virtual ~SystemTranslatable();

    int mainID() const;
    QString mainName() const;
    void setMainName(QString n);
    QString defaultMainName() const;
    void updateNames();
    void setAllNames(QString n);
    bool isEmpty() const;

    virtual void setDefault();
    virtual QString name() const;
    virtual void setName(QString n);
    virtual void getCommand(QVector<QString> &command);
    virtual void initializeCommand(const EventCommand *command, int &i);
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<int, QString> m_names;
};

Q_DECLARE_METATYPE(SystemTranslatable)

#endif // SYSTEMTRANSLATABLE_H
