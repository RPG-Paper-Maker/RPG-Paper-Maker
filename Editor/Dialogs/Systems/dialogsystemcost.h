/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCOST_H
#define DIALOGSYSTEMCOST_H

#include <QDialog>
#include "systemcost.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemCost
//
//  A dialog used for editing the model of a system cost.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemCost;
}

class DialogSystemCost : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemCost(SystemCost &cost, QWidget *parent = nullptr);
    ~DialogSystemCost();
    SystemCost & cost() const;

private:
    Ui::DialogSystemCost *ui;
    SystemCost &m_cost;

    void initialize();
    void translate();
};

#endif // DIALOGSYSTEMCOST_H
