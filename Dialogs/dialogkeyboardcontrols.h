/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGKEYBOARDCONTROLS_H
#define DIALOGKEYBOARDCONTROLS_H

#include <QDialog>
#include "enginesettings.h"
#include "project.h"

// -------------------------------------------------------
//
//  CLASS DialogKeyBoardControls
//
//  A dialog used for configuring the keyboard controls.
//
// -------------------------------------------------------

namespace Ui {
class DialogKeyBoardControls;
}

class DialogKeyBoardControls : public QDialog
{
    Q_OBJECT

public:
    explicit DialogKeyBoardControls(Project *project, EngineSettings* settings,
                                    QWidget *parent = 0);
    ~DialogKeyBoardControls();

private:
    Ui::DialogKeyBoardControls *ui;
    KeyBoardDatas* m_gameKeyBoardDatas;
    bool m_canUpdateKey;
    void updateMenuControls();

private slots:
    void on_comboBoxAction_currentIndexChanged(int index);
    void on_comboBoxCancel_currentIndexChanged(int index);
    void on_comboBoxUp_currentIndexChanged(int index);
    void on_comboBoxDown_currentIndexChanged(int index);
    void on_comboBoxLeft_currentIndexChanged(int index);
    void on_comboBoxRight_currentIndexChanged(int index);
    void on_updateJsonGame(SuperListItem*);
};

#endif // DIALOGKEYBOARDCONTROLS_H
