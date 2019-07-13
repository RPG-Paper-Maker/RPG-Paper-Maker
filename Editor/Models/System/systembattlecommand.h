/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMBATTLECOMMAND_H
#define SYSTEMBATTLECOMMAND_H

#include <QMetaType>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS SystemBattleCommand
//
//  A particulary battle command (system).
//
// -------------------------------------------------------

class SystemBattleCommand : public SystemLang
{
public:
    SystemBattleCommand();
    SystemBattleCommand(int i, LangsTranslation *names, int idSkill);
    virtual ~SystemBattleCommand();
    int idSkill() const;
    void setIdSkill(int i);
    void updateName();
    void setDefault();
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemBattleCommand& battleCommand);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_idSkill;
};

Q_DECLARE_METATYPE(SystemBattleCommand)

#endif // SYSTEMBATTLECOMMAND_H
