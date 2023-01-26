/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommanddisplayananimation.h"
#include "ui_dialogcommanddisplayananimation.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandDisplayAnAnimation::DialogCommandDisplayAnAnimation(EventCommand
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    m_modelObjects(nullptr),
    ui(new Ui::DialogCommandDisplayAnAnimation)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandDisplayAnAnimation::~DialogCommandDisplayAnAnimation()
{
    delete ui;

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        SuperListItem::deleteModel(m_modelObjects);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandDisplayAnAnimation::initializePrimitives()
{
    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    } else {
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    ui->panelPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
        m_parameters, m_properties);
    ui->panelPrimitiveAnimationID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->animationsDatas()->model(), m_parameters,
        m_properties);
}

//-------------------------------------------------

void DialogCommandDisplayAnAnimation::translate()
{
    this->setWindowTitle(RPM::translate(Translations::DISPLAY_AN_ANIMATION) + RPM
        ::DOT_DOT_DOT);
    ui->labelObjectID->setText(RPM::translate(Translations::OBJECT_ID) + RPM
        ::COLON);
    ui->labelAnimationID->setText(RPM::translate(Translations::ANIMATION_ID) + RPM
        ::COLON);
    ui->checkBoxWaitEnd->setText(RPM::translate(Translations
        ::WAIT_END_ANIMATION_NEXT_COMMAND));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandDisplayAnAnimation::initialize(EventCommand *command) {
    int i = 0;
    ui->panelPrimitiveObjectID->initializeCommand(command, i);
    ui->panelPrimitiveAnimationID->initializeCommand(command, i);
    ui->checkBoxWaitEnd->setChecked(RPM::stringToBool(command->valueCommandAt(
        i++)));
}

// -------------------------------------------------------

EventCommand * DialogCommandDisplayAnAnimation::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveObjectID->getCommand(command);
    ui->panelPrimitiveAnimationID->getCommand(command);
    command.append(RPM::boolToString(ui->checkBoxWaitEnd->isChecked()));

    return new EventCommand(EventCommandKind::DisplayAnAnimation, command);
}
