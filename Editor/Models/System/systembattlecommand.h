/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMBATTLECOMMAND_H
#define SYSTEMBATTLECOMMAND_H

#include <QMetaType>
#include "systemtranslatable.h"

// -------------------------------------------------------
//
//  CLASS SystemBattleCommand
//
//  A particulary battle command (system).
//
// -------------------------------------------------------

class SystemBattleCommand : public SuperListItem
{
public:
    SystemBattleCommand();
    SystemBattleCommand(int i, QString name, int idSkill);
    virtual ~SystemBattleCommand();
    int idSkill() const;
    void setIdSkill(int i);
    void updateName();

    virtual void setDefault();
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_idSkill;
};

Q_DECLARE_METATYPE(SystemBattleCommand)

#endif // SYSTEMBATTLECOMMAND_H
