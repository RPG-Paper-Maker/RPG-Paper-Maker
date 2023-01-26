/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMSTATUSRELEASETURN_H
#define DIALOGSYSTEMSTATUSRELEASETURN_H

#include <QDialog>
#include "systemstatusreleaseturn.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemTitleCommand
//
//  A dialog used for editing the model of a system title command.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemStatusReleaseTurn;
}

class DialogSystemStatusReleaseTurn : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemStatusReleaseTurn(SystemStatusReleaseTurn
        &statusReleaseTurn, QWidget *parent = nullptr);
    ~DialogSystemStatusReleaseTurn();

    void initialize();
    void translate();

private:
    Ui::DialogSystemStatusReleaseTurn *ui;
    SystemStatusReleaseTurn &m_statusReleaseTurn;

public slots:
    void on_comboBoxTurn_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMSTATUSRELEASETURN_H
