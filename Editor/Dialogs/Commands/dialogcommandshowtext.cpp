/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandshowtext.h"
#include "ui_dialogcommandshowtext.h"
#include "eventcommandkind.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandShowText::DialogCommandShowText(EventCommand* command,
                                             QWidget *parent):
    DialogCommand(parent),
    ui(new Ui::DialogCommandShowText)
{
    ui->setupUi(this);
    

    if (command != nullptr) initialize(command);
}

DialogCommandShowText::~DialogCommandShowText()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandShowText::initialize(EventCommand* command){
    ui->plainTextMessage->setPlainText(command->valueCommandAt(0));
}

// -------------------------------------------------------

EventCommand* DialogCommandShowText::getCommand() const{
    QVector<QString> command;
    command.append(ui->plainTextMessage->toPlainText());

    return new EventCommand(EventCommandKind::ShowText, command);
}
