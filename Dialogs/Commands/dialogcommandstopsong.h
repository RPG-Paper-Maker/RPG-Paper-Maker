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

#ifndef DIALOGCOMMANDSTOPSONG_H
#define DIALOGCOMMANDSTOPSONG_H

// -------------------------------------------------------
//
//  CLASS DialogCommanStopSong
//
//  A generic dialog command for stopping song.
//
// -------------------------------------------------------

#include "dialogcommand.h"

namespace Ui {
class DialogCommandStopSong;
}

class DialogCommandStopSong : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandStopSong(QString title, SongKind kind,
                                   EventCommand *command = nullptr,
                                   SystemCommonObject *object = nullptr,
                                   QStandardItemModel* parameters = nullptr,
                                   QWidget *parent = 0);
    ~DialogCommandStopSong();
    EventCommandKind getCommandKind() const;
    EventCommand* getCommand() const;

protected:
    SongKind m_kind;

    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandStopSong *ui;
};

#endif // DIALOGCOMMANDSTOPSONG_H
