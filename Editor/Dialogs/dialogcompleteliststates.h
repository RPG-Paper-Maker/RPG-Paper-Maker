/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMPLETELISTSTATES_H
#define DIALOGCOMPLETELISTSTATES_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogCompleteListStates;
//
//  A dialog used for updating the states complete list.
//
// -------------------------------------------------------

namespace Ui {
class DialogCompleteListStates;
}

class DialogCompleteListStates : public QDialog
{
    Q_OBJECT

public:
    explicit DialogCompleteListStates(QWidget *parent = nullptr);
    ~DialogCompleteListStates();

private:
    Ui::DialogCompleteListStates *ui;

    void translate();
};

#endif // DIALOGCOMPLETELISTSTATES_H
