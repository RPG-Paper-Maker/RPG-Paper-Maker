/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandflashscreen.h"
#include "ui_dialogcommandflashscreen.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandFlashScreen::DialogCommandFlashScreen(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    ui(new Ui::DialogCommandFlashScreen)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandFlashScreen::~DialogCommandFlashScreen()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandFlashScreen::initializePrimitives()
{
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    ui->panelPrimitiveColorID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), m_parameters, properties);
    ui->panelPrimitiveTime->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveTime->setNumberDoubleValue(1);
}

//-------------------------------------------------

void DialogCommandFlashScreen::translate()
{
    this->setWindowTitle(RPM::translate(Translations::FLASH_SCREEN) + RPM
        ::DOT_DOT_DOT);
    ui->labelColorID->setText(RPM::translate(Translations::COLOR_ID) + RPM
        ::COLON);
    ui->checkBoxWaitEnd->setText(RPM::translate(Translations
        ::WAIT_END_MOVE_BEFORE_NEXT_COMMAND));
    ui->labelTime->setText(RPM::translate(Translations::TIME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandFlashScreen::initialize(EventCommand *command) {
    int i;

    i = 0;
    ui->panelPrimitiveColorID->initializeCommand(command, i);
    ui->checkBoxWaitEnd->setChecked(RPM::stringToBool(command->valueCommandAt(
        i++)));
    ui->panelPrimitiveTime->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandFlashScreen::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveColorID->getCommand(command);
    command.append(RPM::boolToString(ui->checkBoxWaitEnd->isChecked()));
    ui->panelPrimitiveTime->getCommand(command);

    return new EventCommand(EventCommandKind::FlashScreen, command);
}
