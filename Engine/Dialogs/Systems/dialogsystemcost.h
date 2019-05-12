/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
};

#endif // DIALOGSYSTEMCOST_H
