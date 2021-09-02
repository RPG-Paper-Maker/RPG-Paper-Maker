/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMNUMBER_H
#define DIALOGSYSTEMNUMBER_H

#include <QDialog>
#include "systemnumber.h"

namespace Ui {
class DialogSystemNumber;
}

class DialogSystemNumber : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemNumber(SystemNumber &model, QWidget *parent = nullptr);
    ~DialogSystemNumber();

    void initialize();
    void translate();

protected:
    Ui::DialogSystemNumber *ui;
    SystemNumber &m_model;
};

#endif // DIALOGSYSTEMNUMBER_H
