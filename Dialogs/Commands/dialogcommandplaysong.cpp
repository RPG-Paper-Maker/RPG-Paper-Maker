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

#include "dialogcommandplaysong.h"
#include "ui_dialogcommandplaysong.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandPlaySong::DialogCommandPlaySong(QString title, SongKind kind,
                                             EventCommand *command,
                                             SystemCommonObject *object,
                                             QStandardItemModel *parameters,
                                             QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandPlaySong)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());
    this->setWindowTitle(title);
    ui->widget->setSongKind(kind);
    ui->widget->initializePrimitives(parameters, nullptr);

    if (command != nullptr) initialize(command);
}

DialogCommandPlaySong::~DialogCommandPlaySong()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandPlaySong::initialize(EventCommand* command){
    //ui->widgetVariable->setCurrentId(command->valueCommandAt(0).toInt());
}

// -------------------------------------------------------

EventCommand* DialogCommandPlaySong::getCommand() const{
    QVector<QString> command;
    //command.append(QString::number(ui->widgetVariable->currentId()));

    return new EventCommand(EventCommandKind::PlayMusic, command);
}
