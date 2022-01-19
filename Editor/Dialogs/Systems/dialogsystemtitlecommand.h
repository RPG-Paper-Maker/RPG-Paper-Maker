/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMTITLECOMMAND_H
#define DIALOGSYSTEMTITLECOMMAND_H

#include <QDialog>
#include "systemtitlecommand.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemTitleCommand
//
//  A dialog used for editing the model of a system title command.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemTitleCommand;
}

class DialogSystemTitleCommand : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemTitleCommand(SystemTitleCommand &tc, QWidget *parent =
        nullptr);
    ~DialogSystemTitleCommand();

private:
    Ui::DialogSystemTitleCommand *ui;
    SystemTitleCommand &m_titleCommand;

    void initialize();
    void translate();

private slots:
    void on_comboBoxTypeCommand_currentIndexChanged(int index);
    void on_plainTextEditScript_textChanged();
};

#endif // DIALOGSYSTEMTITLECOMMAND_H
