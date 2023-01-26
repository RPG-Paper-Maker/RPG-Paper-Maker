/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMGAMEOVERCOMMAND_H
#define SYSTEMGAMEOVERCOMMAND_H

#include "systemtranslatable.h"
#include "gameovercommandkind.h"

class SystemGameOverCommand : public SystemTranslatable
{
public:
    static const QString JSON_KIND;
    static const QString JSON_SCRIPT;

    SystemGameOverCommand();
    SystemGameOverCommand(int i, QString name, GameOverCommandKind k);
    virtual ~SystemGameOverCommand();

    GameOverCommandKind kind() const;
    void setKind(GameOverCommandKind k);
    QString script() const;
    void setScript(QString s);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem *> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    GameOverCommandKind m_kind;
    QString m_script;
};

#endif // SYSTEMGAMEOVERCOMMAND_H
