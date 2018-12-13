/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef DIALOGCOMMAND_H
#define DIALOGCOMMAND_H

#include <QDialog>
#include "eventcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommand
//
//  Abstract class that all the dialog commands should inherit.
//
// -------------------------------------------------------

class DialogCommand : public QDialog
{
public:
    explicit DialogCommand(QWidget *parent = 0);
    virtual EventCommand* getCommand() const = 0;

protected:
    virtual void initialize(EventCommand* command) = 0;
};

#endif // DIALOGCOMMAND_H
