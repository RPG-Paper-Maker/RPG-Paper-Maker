/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangescreentone.h"
#include "ui_dialogcommandchangescreentone.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeScreenTone::DialogCommandChangeScreenTone(EventCommand
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    ui(new Ui::DialogCommandChangeScreenTone)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }

    this->translate();
}

DialogCommandChangeScreenTone::~DialogCommandChangeScreenTone() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeScreenTone::initializePrimitives() {
    ui->panelColorsTransition->initializePrimitives(m_properties, m_parameters);
    ui->panelPrimitiveTime->initializeNumber(m_parameters, m_properties, false);
}

//-------------------------------------------------

void DialogCommandChangeScreenTone::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_SCREEN_TONE) + RPM
        ::DOT_DOT_DOT);
    ui->panelColorsTransition->translate();
    ui->labelTime->setText(RPM::translate(Translations::TIME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    ui->checkBoxWaitEnd->setText(RPM::translate(Translations
        ::WAIT_END_CHANGE_BEFORE_NEXT_COMMAND));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeScreenTone::initialize(EventCommand *command) {
    int i;

    i = 0;
    ui->panelColorsTransition->initialize(command, i);
    ui->checkBoxWaitEnd->setChecked(RPM::stringToBool(command->valueCommandAt(
        i++)));
    ui->panelPrimitiveTime->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandChangeScreenTone::getCommand() const{
    QVector<QString> command;

    ui->panelColorsTransition->getCommand(command);
    command.append(RPM::boolToString(ui->checkBoxWaitEnd->isChecked()));
    ui->panelPrimitiveTime->getCommand(command);

    return new EventCommand(EventCommandKind::ChangeScreenTone, command);
}
