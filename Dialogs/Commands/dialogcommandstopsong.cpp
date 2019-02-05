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

#include "dialogcommandstopsong.h"
#include "ui_dialogcommandstopsong.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandStopSong::DialogCommandStopSong(QString title, SongKind kind,
                                             EventCommand *command,
                                             SystemCommonObject *object,
                                             QStandardItemModel *parameters,
                                             QWidget *parent) :
    DialogCommand(parent),
    m_kind(kind),
    ui(new Ui::DialogCommandStopSong)
{
    ui->setupUi(this);
    
    this->setWindowTitle(title);
    ui->panelPrimitiveValueSeconds->initializeNumber(parameters, nullptr);

    if (command != nullptr) initialize(command);
}

DialogCommandStopSong::~DialogCommandStopSong()
{
    delete ui;
}

EventCommandKind DialogCommandStopSong::getCommandKind() const {
    switch(m_kind) {
    case SongKind::Music:
        return EventCommandKind::StopMusic;
    case SongKind::BackgroundSound:
        return EventCommandKind::StopBackgroundSound;
    default:
        break;
    }

    return EventCommandKind::None;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandStopSong::initialize(EventCommand* command) {
    int i = 0;

    ui->panelPrimitiveValueSeconds->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand* DialogCommandStopSong::getCommand() const {
    QVector<QString> command;
    ui->panelPrimitiveValueSeconds->getCommand(command);

    return new EventCommand(getCommandKind(), command);
}
