/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
};

#endif // DIALOGSYSTEMPARAMETER_H
