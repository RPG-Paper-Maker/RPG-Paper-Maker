/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
};

#endif // DIALOGCOMPLETELISTSTATES_H
