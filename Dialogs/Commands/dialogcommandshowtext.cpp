/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
