/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
