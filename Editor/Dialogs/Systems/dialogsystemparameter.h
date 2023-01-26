/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMPARAMETER_H
#define DIALOGSYSTEMPARAMETER_H

#include <QDialog>
#include "systemparameter.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemParameter
//
//  A dialog used for editing the model of a system parameter.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemParameter;
}

class DialogSystemParameter : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemParameter(SystemParameter& param, QWidget *parent = 0);
    ~DialogSystemParameter();

private:
    Ui::DialogSystemParameter *ui;
    SystemParameter& m_param;

    void initialize();
    void translate();
};

#endif // DIALOGSYSTEMPARAMETER_H
