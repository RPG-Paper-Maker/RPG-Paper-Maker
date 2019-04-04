/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGINPUTNUMBER_H
#define DIALOGINPUTNUMBER_H

#include <QDialog>
#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandInputNumber
//
//  A dialog used for asking the user to enter a number.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandInputNumber;
}

class DialogCommandInputNumber : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandInputNumber(EventCommand *command = nullptr,
                                      QWidget *parent = 0);
    virtual ~DialogCommandInputNumber();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandInputNumber *ui;
};

#endif // DIALOGINPUTNUMBER_H
