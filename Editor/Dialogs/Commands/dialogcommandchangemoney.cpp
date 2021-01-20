/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangemoney.h"
#include "ui_dialogcommandchangemoney.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeMoney::DialogCommandChangeMoney(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    ui(new Ui::DialogCommandChangeMoney)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }

    this->translate();
}

DialogCommandChangeMoney::~DialogCommandChangeMoney()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeMoney::initializePrimitives()
{
    QStandardItemModel *properties = nullptr;
    if (m_object != nullptr)
    {
        properties = m_object->modelProperties();
    }

    ui->panelPrimitiveMoneyID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelCurrencies(), m_parameters,
        properties);
    ui->panelPrimitiveNumber->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveNumber->setNumberValue(1);
}

//-------------------------------------------------

void DialogCommandChangeMoney::translate()
{
    this->setWindowTitle(RPM::translate(Translations::MODIFY_CURRENCY) + RPM
        ::DOT_DOT_DOT);
    ui->groupBoxSelection->setTitle(RPM::translate(Translations::SELECTION));
    ui->labelMoneyID->setText(RPM::translate(Translations::CURRENCY_ID) + RPM
        ::COLON);
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->radioButtonPlus->setText(RPM::PARENTHESIS_LEFT + RPM::PLUS + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::PLUS));
    ui->radioButtonMinus->setText(RPM::PARENTHESIS_LEFT + RPM::MINUS + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::MINUS));
    ui->radioButtonTimes->setText(RPM::PARENTHESIS_LEFT + RPM::TIMES + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::TIMES));
    ui->radioButtonEquals->setText(RPM::PARENTHESIS_LEFT + RPM::EQUAL + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::EQUALS));
    ui->radioButtonModulo->setText(RPM::PARENTHESIS_LEFT + RPM::MODULO + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::MODULO));
    ui->radioButtonDivided->setText(RPM::PARENTHESIS_LEFT + RPM::DIVIDED_BY +
        RPM::PARENTHESIS_RIGHT + RPM::translate(Translations::DIVIDED_BY));
    ui->groupBoxNumber->setTitle(RPM::translate(Translations::NUMBER));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeMoney::initialize(EventCommand *command) {
    int i = 0;
    ui->panelPrimitiveMoneyID->initializeCommand(command, i);

    // Operation
    switch(command->valueCommandAt(i++).toInt()){
    case 0: ui->radioButtonEquals->setChecked(true); break;
    case 1: ui->radioButtonPlus->setChecked(true); break;
    case 2: ui->radioButtonMinus->setChecked(true); break;
    case 3: ui->radioButtonTimes->setChecked(true); break;
    case 4: ui->radioButtonDivided->setChecked(true); break;
    case 5: ui->radioButtonModulo->setChecked(true); break;
    }

    ui->panelPrimitiveNumber->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandChangeMoney::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveMoneyID->getCommand(command);
    if (ui->radioButtonEquals->isChecked()) command.append("0");
    else if (ui->radioButtonPlus->isChecked()) command.append("1");
    else if (ui->radioButtonMinus->isChecked()) command.append("2");
    else if (ui->radioButtonTimes->isChecked()) command.append("3");
    else if (ui->radioButtonDivided->isChecked()) command.append("4");
    else if (ui->radioButtonModulo->isChecked()) command.append("5");
    ui->panelPrimitiveNumber->getCommand(command);

    return new EventCommand(EventCommandKind::ModifyCurrency, command);
}
