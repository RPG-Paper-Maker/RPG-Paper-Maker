/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandallowforbidsavesmainmenu.h"
#include "ui_dialogcommandallowforbidsavesmainmenu.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandAllowForbidSavesMainMenu::DialogCommandAllowForbidSavesMainMenu(
    EventCommandKind kind, EventCommand *command, SystemCommonObject *object,
    QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    m_kind(kind),
    ui(new Ui::DialogCommandAllowForbidSavesMainMenu)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }

    this->translate();
}

DialogCommandAllowForbidSavesMainMenu::~DialogCommandAllowForbidSavesMainMenu() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandAllowForbidSavesMainMenu::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    this->setWindowTitle(m_kind == EventCommandKind::AllowForbidSaves ? RPM
        ::translate(Translations::ALLOW_FORBID_SAVES) + RPM::DOT_DOT_DOT : RPM
        ::translate(Translations::ALLOW_FORBID_MAIN_MENU) + RPM::DOT_DOT_DOT);
    ui->panelPrimitiveAllow->initializeSwitch(m_parameters, properties);
}

//-------------------------------------------------

void DialogCommandAllowForbidSavesMainMenu::translate()
{
    ui->labelAllow->setText(RPM::translate(Translations::ALLOW) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandAllowForbidSavesMainMenu::initialize(EventCommand *command) {
    int i;

    i = 0;
    ui->panelPrimitiveAllow->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandAllowForbidSavesMainMenu::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveAllow->getCommand(command);

    return new EventCommand(m_kind, command);
}
