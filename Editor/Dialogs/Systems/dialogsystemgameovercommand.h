/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMGAMEOVERCOMMAND_H
#define DIALOGSYSTEMGAMEOVERCOMMAND_H

#include <QDialog>
#include "systemgameovercommand.h"

namespace Ui {
class DialogSystemGameOverCommand;
}

class DialogSystemGameOverCommand : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemGameOverCommand(SystemGameOverCommand &model, QWidget
        *parent = nullptr);
    ~DialogSystemGameOverCommand();

    void initialize();
    void translate();

private:
    Ui::DialogSystemGameOverCommand *ui;
    SystemGameOverCommand &m_model;

private slots:
    void on_comboBoxTypeCommand_currentIndexChanged(int index);
    void on_plainTextEditScript_textChanged();
};

#endif // DIALOGSYSTEMGAMEOVERCOMMAND_H
