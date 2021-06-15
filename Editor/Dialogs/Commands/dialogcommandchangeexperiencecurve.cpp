/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangeexperiencecurve.h"
#include "ui_dialogcommandchangeexperiencecurve.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeExperienceCurve::DialogCommandChangeExperienceCurve(EventCommand
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeExperienceCurve),
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

DialogCommandChangeExperienceCurve::~DialogCommandChangeExperienceCurve()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeExperienceCurve::initializePrimitives()
{

}

// -------------------------------------------------------

void DialogCommandChangeExperienceCurve::translate()
{
    //this->setWindowTitle(RPM::translate(Translations::CHANGE_EXPERIENCE_CURVE) + RPM::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandChangeExperienceCurve::getCommand() const
{
    QVector<QString> command;
    return new EventCommand(EventCommandKind::ChangeExperienceCurve, command);
}

// -------------------------------------------------------

void DialogCommandChangeExperienceCurve::initialize(EventCommand *command)
{
    int i = 0;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------
