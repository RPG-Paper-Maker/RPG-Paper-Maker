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

#ifndef DIALOGCOMMANDPLAYSONG_H
#define DIALOGCOMMANDPLAYSONG_H

// -------------------------------------------------------
//
//  CLASS DialogCommanPlaySong
//
//  A generic dialog command for playing song.
//
// -------------------------------------------------------

#include <QDialog>
#include "dialogcommand.h"
#include "songkind.h"

namespace Ui {
class DialogCommandPlaySong;
}

class DialogCommandPlaySong : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandPlaySong(QString title, SongKind kind,
                                   EventCommand *command = nullptr,
                                   SystemCommonObject *object = nullptr,
                                   QStandardItemModel* parameters = nullptr,
                                   QWidget *parent = 0);
    ~DialogCommandPlaySong();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandPlaySong *ui;

private slots:
    void on_checkBoxSongID_toggled(bool checked);
};

#endif // DIALOGCOMMANDPLAYSONG_H
