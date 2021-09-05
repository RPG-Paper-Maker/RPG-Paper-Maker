/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMINITIALPARTYMEMBER_H
#define DIALOGSYSTEMINITIALPARTYMEMBER_H

#include <QDialog>
#include "systeminitialpartymember.h"

namespace Ui {
class DialogSystemInitialPartyMember;
}

class DialogSystemInitialPartyMember : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemInitialPartyMember(SystemInitialPartyMember &model,
        QWidget *parent = nullptr);
    ~DialogSystemInitialPartyMember();

    void initialize();
    void translate();

private:
    Ui::DialogSystemInitialPartyMember *ui;
    SystemInitialPartyMember &m_model;

public slots:
    void on_comboBoxInstanceTeam_currentIndexChanged(int index);
    void on_radioButtonHero_toggled(bool checked);
    void on_radioButtonMonster_toggled(bool checked);
};

#endif // DIALOGSYSTEMINITIALPARTYMEMBER_H
