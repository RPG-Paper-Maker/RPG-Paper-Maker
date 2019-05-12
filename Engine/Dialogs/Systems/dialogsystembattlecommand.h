/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGSYSTEMBATTLECOMMAND_H
#define DIALOGSYSTEMBATTLECOMMAND_H

#include <QDialog>
#include "systembattlecommand.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemBattleCommand
//
//  A dialog used for editing the model of a system battle command.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemBattleCommand;
}

class DialogSystemBattleCommand : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemBattleCommand(SystemBattleCommand& battleCommand,
                                       QWidget *parent = 0);
    ~DialogSystemBattleCommand();
    SystemBattleCommand& battleCommand() const;

private:
    Ui::DialogSystemBattleCommand *ui;
    SystemBattleCommand& m_battleCommand;
    void initialize();

public slots:
    void on_comboBoxSkill_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMBATTLECOMMAND_H
