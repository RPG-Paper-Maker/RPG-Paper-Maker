/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMMAINMENUCOMMAND_H
#define SYSTEMMAINMENUCOMMAND_H

#include "systemtranslatable.h"
#include "mainmenucommandkind.h"

// -------------------------------------------------------
//
//  CLASS SystemMainMenuCommand
//
//  A particulary main menu command (datas).
//
// -------------------------------------------------------

class SystemMainMenuCommand : public SystemTranslatable
{
public:
    static const QString JSON_KIND;
    static const QString JSON_SCRIPT;
    static const MainMenuCommandKind DEFAULT_KIND;
    static const QString DEFAULT_SCRIPT;

    SystemMainMenuCommand();
    SystemMainMenuCommand(int i, QString name, MainMenuCommandKind kind =
        DEFAULT_KIND, QString script = DEFAULT_SCRIPT);
    virtual ~SystemMainMenuCommand();
    MainMenuCommandKind kind() const;
    void setKind(MainMenuCommandKind kind);
    QString script() const;
    void setScript(QString script);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    MainMenuCommandKind m_kind;
    QString m_script;
};

#endif // SYSTEMMAINMENUCOMMAND_H
