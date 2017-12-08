/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef DIALOGCOMMANDMODIFYINVENTORY_H
#define DIALOGCOMMANDMODIFYINVENTORY_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandModifyInventory
//
//  A dialog used for changing inventory of a character.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandModifyInventory;
}

class DialogCommandModifyInventory : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandModifyInventory(EventCommand *command = nullptr,
                                          QWidget *parent = 0);
    virtual ~DialogCommandModifyInventory();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandModifyInventory *ui;
    void selection(QVector<QString> &command) const;
    void operation(QVector<QString>& command) const;
    void value(QVector<QString>& command) const;

private slots:
    void on_radioButtonItem_toggled(bool checked);
    void on_radioButtonWeapon_toggled(bool checked);
    void on_radioButtonArmor_toggled(bool checked);
};

#endif // DIALOGCOMMANDMODIFYINVENTORY_H
