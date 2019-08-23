/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMTITLECOMMAND_H
#define SYSTEMTITLECOMMAND_H

#include "systemlang.h"
#include "titlecommandkind.h"

// -------------------------------------------------------
//
//  CLASS SystemSong
//
//  A particulary song.
//
// -------------------------------------------------------

class SystemTitleCommand : public SystemLang
{
public:
    static const QString JSON_KIND;
    static const QString JSON_SCRIPT;

    SystemTitleCommand();
    SystemTitleCommand(int i, LangsTranslation *names, TitleCommandKind k);
    virtual ~SystemTitleCommand();

    TitleCommandKind kind() const;
    void setKind(TitleCommandKind k);
    QString script() const;
    void setScript(QString s);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem *> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    TitleCommandKind m_kind;
    QString m_script;
};

#endif // SYSTEMTITLECOMMAND_H
