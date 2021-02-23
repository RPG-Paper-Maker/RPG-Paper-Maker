/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMLANG_H
#define SYSTEMLANG_H

#include <QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"
#include "langstranslation.h"
#include "eventcommand.h"

// -------------------------------------------------------
//
//  CLASS SystemLang
//
//  A particulary lang (lang).
//
// -------------------------------------------------------

class SystemLang : public SuperListItem
{
public:
    SystemLang();
    SystemLang(int i, QString name);
    SystemLang(int i, LangsTranslation* names);
    virtual ~SystemLang();

    LangsTranslation* names() const;

    virtual void setDefault();
    virtual QString name() const;
    virtual void setName(QString n);
    virtual void getCommand(QVector<QString> &command);
    virtual void initializeCommand(const EventCommand *command, int &i);
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem& super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    LangsTranslation* m_names;
};

Q_DECLARE_METATYPE(SystemLang)

#endif // SYSTEMLANG_H
