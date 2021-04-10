/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandlabel.h"
#include "ui_dialogcommandlabel.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandLabel::DialogCommandLabel(bool jump, EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    m_isJump(jump),
    ui(new Ui::DialogCommandLabel)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandLabel::~DialogCommandLabel()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandLabel::initializePrimitives() {
    ui->panelPrimitiveLabel->initializeMessage(false, m_parameters, m_properties);
}

//-------------------------------------------------

void DialogCommandLabel::translate()
{
    this->setWindowTitle(RPM::translate(m_isJump ? Translations::JUMP_TO_LABEL :
        Translations::LABEL) + RPM::DOT_DOT_DOT);
    ui->labelLabel->setText(RPM::translate(Translations::LABEL) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandLabel::initialize(EventCommand *command) {
    int i;

    i = 0;
    ui->panelPrimitiveLabel->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandLabel::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveLabel->getCommand(command);

    return new EventCommand(m_isJump ? EventCommandKind::JumpLabel :
        EventCommandKind::Label, command);
}
