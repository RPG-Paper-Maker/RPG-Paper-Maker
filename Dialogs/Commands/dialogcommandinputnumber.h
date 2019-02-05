/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
