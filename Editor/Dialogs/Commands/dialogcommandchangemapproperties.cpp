/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangemapproperties.h"
#include "ui_dialogcommandchangemapproperties.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeMapProperties::DialogCommandChangeMapProperties(EventCommand
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeMapProperties),
    m_properties(properties),
    m_parameters(parameters)
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandChangeMapProperties::~DialogCommandChangeMapProperties()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeMapProperties::initializePrimitives()
{

}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::translate()
{
    //this->setWindowTitle(RPM::translate(Translations::CHANGE_MAP_PROPERTIES) + RPM::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandChangeMapProperties::getCommand() const
{
    QVector<QString> command;
    return new EventCommand(EventCommandKind::ChangeMapProperties, command);
}

// -------------------------------------------------------

void DialogCommandChangeMapProperties::initialize(EventCommand *command)
{
    int i = 0;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------
