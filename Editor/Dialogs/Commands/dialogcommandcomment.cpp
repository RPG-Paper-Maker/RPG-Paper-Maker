/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandcomment.h"
#include "ui_dialogcommandcomment.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandComment::DialogCommandComment(EventCommand *command, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandComment)
{
    ui->setupUi(this);

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandComment::~DialogCommandComment()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandComment::translate()
{
    this->setWindowTitle(RPM::translate(Translations::COMMENT) + RPM::DOT_DOT_DOT);
    ui->labelComment->setText(RPM::translate(Translations::COMMENT) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandComment::initialize(EventCommand *command) {
    ui->lineEditComment->setText(command->valueCommandAt(0));
}

// -------------------------------------------------------

EventCommand * DialogCommandComment::getCommand() const{
    QVector<QString> command;

    command << ui->lineEditComment->text();

    return new EventCommand(EventCommandKind::Comment, command);
}
