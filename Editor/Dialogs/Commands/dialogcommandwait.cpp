/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandwait.h"
#include "ui_dialogcommandwait.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandWait::DialogCommandWait(EventCommand *command, QStandardItemModel
    *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    ui(new Ui::DialogCommandWait)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        initialize(command);
    }
    this->translate();
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

void DialogCommandWait::initializePrimitives() {
    ui->panelPrimitiveTime->initializeNumber(m_parameters, m_properties, false);
}

//-------------------------------------------------

void DialogCommandWait::translate()
{
    this->setWindowTitle(RPM::translate(Translations::WAIT) + RPM::DOT_DOT_DOT);
    ui->labelTime->setText(RPM::translate(Translations::TIME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogCommandWait::getCommandList(QVector<QString> &command) const
{
    ui->panelPrimitiveTime->getCommand(command);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandWait::getCommand() const
{
    QVector<QString> command;
    this->getCommandList(command);
    return new EventCommand(EventCommandKind::Wait, command);
}

// -------------------------------------------------------

void DialogCommandWait::initialize(EventCommand *command)
{
    int i = 0;
    ui->panelPrimitiveTime->initializeCommand(command, i);
}
