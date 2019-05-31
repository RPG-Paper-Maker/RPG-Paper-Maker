/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/
#include "dialogcommandwait.h"
#include "ui_dialogcommandwait.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandWait::DialogCommandWait(EventCommand *command, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandWait)
{
    ui->setupUi(this);
    

    if (command != nullptr)
        initialize(command);
}

DialogCommandWait::~DialogCommandWait()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandWait::initialize(EventCommand* command){
    ui->doubleSpinBox->setValue(command->valueCommandAt(0).toDouble());
}

// -------------------------------------------------------

EventCommand* DialogCommandWait::getCommand() const{
    QVector<QString> command;
    command.append(QString::number(ui->doubleSpinBox->value()));

    return new EventCommand(EventCommandKind::Wait, command);
}
