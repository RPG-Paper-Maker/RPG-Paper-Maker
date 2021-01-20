/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCLASSSKILL_H
#define DIALOGSYSTEMCLASSSKILL_H

#include <QDialog>
#include "systemclassskill.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemClassSkill
//
//  A dialog used for editing the model of a system class skill.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemClassSkill;
}

class DialogSystemClassSkill : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemClassSkill(SystemClassSkill& skill,
                                    QWidget *parent = 0);
    ~DialogSystemClassSkill();

private:
    Ui::DialogSystemClassSkill *ui;
    SystemClassSkill& m_skill;

    void initialize();
    void translate();

private slots:
    void on_comboBoxSkill_currentIndexChanged(int index);
    void on_spinBoxLevel_valueChanged(int i);
};

#endif // DIALOGSYSTEMCLASSSKILL_H
