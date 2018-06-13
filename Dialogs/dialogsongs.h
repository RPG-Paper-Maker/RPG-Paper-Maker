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

#ifndef DIALOGSONGS_H
#define DIALOGSONGS_H

// -------------------------------------------------------
//
//  CLASS DialogSongs
//
//  A dialog used for editing songs in the game.
//
// -------------------------------------------------------

#include <QDialog>

namespace Ui {
class DialogSongs;
}

class DialogSongs : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSongs(QWidget *parent = 0);
    ~DialogSongs();

private:
    Ui::DialogSongs *ui;
};

#endif // DIALOGSONGS_H
