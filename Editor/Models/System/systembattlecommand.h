/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
