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

#include "dialogcommandsendevent.h"
#include "ui_dialogcommandsendevent.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandSendEvent::DialogCommandSendEvent(EventCommand *command,
                                               QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandSendEvent)
{
    ui->setupUi(this);
    

    bool test = command == nullptr;
    if (test){
        QVector<QString> l({"1", "1", "0", "1",
                            "1",
                            QString::number((int) PrimitiveValueKind::Default),
                            "2",
                            QString::number((int) PrimitiveValueKind::Default)}
                           );
        command = new EventCommand(EventCommandKind::SendEvent, l);
    }

    initialize(command);

    if (test)
        delete command;
}

DialogCommandSendEvent::~DialogCommandSendEvent()
{
    delete ui;
    delete m_event;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandSendEvent::initialize(EventCommand* command){
    int i = 0;

    int target = command->valueCommandAt(i++).toInt();
    switch(target){
    case 0:
        ui->radioButtonAll->setChecked(true);
        break;
    case 1:
        ui->radioButtonDetection->setChecked(true);
        command->valueCommandAt(i++).toInt();
        break;
    case 2:
        ui->radioButtonObject->setChecked(true);
        command->valueCommandAt(i++).toInt();
        break;
    case 3:
        ui->radioButtonSender->setChecked(true);
        break;
    case 4:
        ui->radioButtonHero->setChecked(true);
        break;
    }
    m_event = ui->widgetObjectEvent->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand* DialogCommandSendEvent::getCommand() const{
    QVector<QString> command;
    chooseTarget(command);
    ui->widgetObjectEvent->getCommandObjectEvent(command);

    return new EventCommand(EventCommandKind::SendEvent, command);
}

// -------------------------------------------------------

void DialogCommandSendEvent::chooseTarget(QVector<QString> &command) const{
    if (ui->radioButtonAll->isChecked()){
        command.append("0");
    }
    else if(ui->radioButtonDetection->isChecked()){
        command.append("1");
        command.append("1");
        // TODO
    }
    else if(ui->radioButtonObject->isChecked()){
        command.append("2");
        command.append("1");
        // TODO
    }
    else if(ui->radioButtonSender->isChecked()){
        command.append("3");
    }
    else if(ui->radioButtonHero->isChecked()){
        command.append("4");
    }
}
