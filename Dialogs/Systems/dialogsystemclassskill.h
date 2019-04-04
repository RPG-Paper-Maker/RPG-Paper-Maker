/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

private slots:
    void on_comboBoxSkill_currentIndexChanged(int index);
    void on_spinBoxLevel_valueChanged(int i);
};

#endif // DIALOGSYSTEMCLASSSKILL_H
