/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandshakescreen.h"
#include "ui_dialogcommandshakescreen.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandShakeScreen::DialogCommandShakeScreen(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    ui(new Ui::DialogCommandShakeScreen)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandShakeScreen::~DialogCommandShakeScreen()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandShakeScreen::initializePrimitives()
{
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    ui->panelPrimitiveOffset->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveShakeNumber->initializeNumber(m_parameters, properties,
        false);
    ui->panelPrimitiveTime->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveOffset->setNumberValue(30);
    ui->panelPrimitiveShakeNumber->setNumberDoubleValue(2);
    ui->panelPrimitiveTime->setNumberDoubleValue(2);
}

//-------------------------------------------------

void DialogCommandShakeScreen::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SHAKE_SCREEN) + RPM
        ::DOT_DOT_DOT);
    ui->labelOffset->setText(RPM::translate(Translations::OFFSET) + RPM::COLON);
    ui->labelPixels->setText(RPM::translate(Translations::PIXEL_S).toLower());
    ui->labelShakeNumber->setText(RPM::translate(Translations::SHAKES_NUMBER) +
        RPM::COLON);
    ui->labelPerSecond->setText(RPM::translate(Translations::PER_SECOND).toLower());
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

void DialogCommandShakeScreen::initialize(EventCommand *command) {
    int i;

    i = 0;
    ui->panelPrimitiveOffset->initializeCommand(command, i);
    ui->panelPrimitiveShakeNumber->initializeCommand(command, i);
    ui->checkBoxWaitEnd->setChecked(RPM::stringToBool(command->valueCommandAt(
        i++)));
    ui->panelPrimitiveTime->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandShakeScreen::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveOffset->getCommand(command);
    ui->panelPrimitiveShakeNumber->getCommand(command);
    command.append(RPM::boolToString(ui->checkBoxWaitEnd->isChecked()));
    ui->panelPrimitiveTime->getCommand(command);

    return new EventCommand(EventCommandKind::ShakeScreen, command);
}
