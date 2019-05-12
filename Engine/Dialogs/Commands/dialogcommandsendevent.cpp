/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
